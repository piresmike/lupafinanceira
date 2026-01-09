import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CardPaymentRequest {
  paymentMethod: "card";
  formData: {
    token: string;
    email: string;
    identificationNumber: string;
    identificationType: string;
    installments: number;
    paymentMethodId: string;
    issuerId: string;
  };
  userId: string;
}

interface PixPaymentRequest {
  paymentMethod: "pix";
  formData: {
    email: string;
    cpf: string;
  };
  userId: string;
}

type PaymentRequest = CardPaymentRequest | PixPaymentRequest;

function getPaymentStatusMessage(status: string, statusDetail: string): string {
  const messages: Record<string, string> = {
    approved: "Pagamento aprovado!",
    pending: "Pagamento pendente. Aguarde a confirmação.",
    in_process: "Pagamento em processamento.",
    rejected: "Pagamento recusado.",
    cc_rejected_insufficient_amount: "Saldo insuficiente no cartão.",
    cc_rejected_bad_filled_card_number: "Número do cartão inválido.",
    cc_rejected_bad_filled_security_code: "Código de segurança inválido.",
    cc_rejected_call_for_authorize: "Entre em contato com seu banco para autorizar.",
    cc_rejected_card_disabled: "Cartão desabilitado.",
    cc_rejected_high_risk: "Pagamento recusado por segurança.",
  };

  return messages[statusDetail] || messages[status] || "Erro no pagamento.";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!MP_ACCESS_TOKEN) {
      throw new Error("MP_ACCESS_TOKEN not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body: PaymentRequest = await req.json();
    const { paymentMethod, formData, userId } = body;

    console.log(`Processing ${paymentMethod} payment for user ${userId}`);

    if (paymentMethod === "card") {
      const cardData = formData as CardPaymentRequest["formData"];
      
      // Create payment with Mercado Pago
      const paymentResponse = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "X-Idempotency-Key": `${userId}_${Date.now()}`,
        },
        body: JSON.stringify({
          transaction_amount: 29.90,
          token: cardData.token,
          description: "Lupa Financeira - Plano Básico Mensal",
          installments: cardData.installments || 1,
          payment_method_id: cardData.paymentMethodId,
          issuer_id: cardData.issuerId,
          payer: {
            email: cardData.email,
            identification: {
              type: cardData.identificationType,
              number: cardData.identificationNumber.replace(/\D/g, ""),
            },
          },
          statement_descriptor: "LUPA FINANCEIRA",
          external_reference: `USER_${userId}_${Date.now()}`,
        }),
      });

      const payment = await paymentResponse.json();
      console.log("Mercado Pago payment response:", payment);

      if (payment.error) {
        console.error("Mercado Pago error:", payment);
        return new Response(
          JSON.stringify({
            success: false,
            error: payment.message || "Erro ao processar pagamento",
            message: payment.message || "Erro ao processar pagamento. Tente novamente.",
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Save subscription to database
      const { error: dbError } = await supabase.from("subscriptions").insert({
        user_id: userId,
        payment_id: String(payment.id),
        external_reference: `USER_${userId}_${Date.now()}`,
        status: payment.status === "approved" ? "approved" : "pending",
        amount: 29.90,
        payment_method: "credit_card",
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (dbError) {
        console.error("Database error:", dbError);
      }

      if (payment.status === "approved") {
        return new Response(
          JSON.stringify({
            success: true,
            status: payment.status,
            paymentId: payment.id,
            message: "Pagamento aprovado! Redirecionando...",
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          status: payment.status,
          statusDetail: payment.status_detail,
          message: getPaymentStatusMessage(payment.status, payment.status_detail),
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (paymentMethod === "pix") {
      const pixData = formData as PixPaymentRequest["formData"];

      // Create PIX payment
      const paymentResponse = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "X-Idempotency-Key": `${userId}_pix_${Date.now()}`,
        },
        body: JSON.stringify({
          transaction_amount: 29.90,
          description: "Lupa Financeira - Plano Básico Mensal",
          payment_method_id: "pix",
          payer: {
            email: pixData.email,
            identification: {
              type: "CPF",
              number: pixData.cpf.replace(/\D/g, ""),
            },
          },
          external_reference: `USER_${userId}_${Date.now()}`,
        }),
      });

      const payment = await paymentResponse.json();
      console.log("Mercado Pago PIX response:", payment);

      if (payment.error) {
        console.error("Mercado Pago PIX error:", payment);
        return new Response(
          JSON.stringify({
            success: false,
            error: payment.message || "Erro ao gerar PIX",
            message: payment.message || "Erro ao gerar QR Code. Tente novamente.",
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Save pending subscription to database
      const { error: dbError } = await supabase.from("subscriptions").insert({
        user_id: userId,
        payment_id: String(payment.id),
        external_reference: `USER_${userId}_${Date.now()}`,
        status: "pending",
        amount: 29.90,
        payment_method: "pix",
      });

      if (dbError) {
        console.error("Database error:", dbError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: "pending",
          qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
          paymentId: payment.id,
          message: "QR Code gerado! Escaneie para pagar.",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Método de pagamento inválido" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        message: "Erro ao processar pagamento. Tente novamente.",
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
