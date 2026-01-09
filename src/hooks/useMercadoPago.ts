import { useState, useEffect, useCallback } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  thumbnail: string;
}

interface Installment {
  installments: number;
  installment_amount: number;
  installment_rate: number;
  recommended_message: string;
}

interface CardTokenData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

export function useMercadoPago() {
  const [mp, setMp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        // Fetch public key from edge function
        const { data, error: fnError } = await supabase.functions.invoke("get-mp-public-key");
        
        if (fnError || !data?.publicKey) {
          throw new Error("Erro ao obter chave pública do Mercado Pago");
        }

        await loadMercadoPago();
        
        const mercadopago = new window.MercadoPago(data.publicKey, {
          locale: "pt-BR",
        });
        
        setMp(mercadopago);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing MercadoPago:", err);
        setError("Erro ao inicializar sistema de pagamento");
        setLoading(false);
      }
    };

    initMercadoPago();
  }, []);

  const getPaymentMethods = useCallback(async (bin: string): Promise<PaymentMethod[] | null> => {
    if (!mp || bin.length < 6) return null;

    try {
      const response = await mp.getPaymentMethods({ bin: bin.substring(0, 6) });
      return response.results;
    } catch (err) {
      console.error("Error getting payment methods:", err);
      return null;
    }
  }, [mp]);

  const getIssuers = useCallback(async (paymentMethodId: string): Promise<any[] | null> => {
    if (!mp) return null;

    try {
      const response = await mp.getIssuers({ paymentMethodId });
      return response;
    } catch (err) {
      console.error("Error getting issuers:", err);
      return null;
    }
  }, [mp]);

  const getInstallments = useCallback(async (
    bin: string,
    amount: number = 29.90
  ): Promise<Installment[] | null> => {
    if (!mp || bin.length < 6) return null;

    try {
      const response = await mp.getInstallments({
        amount: String(amount),
        locale: "pt-BR",
        bin: bin.substring(0, 6),
        paymentTypeId: "credit_card",
      });
      
      if (response && response.length > 0) {
        return response[0].payer_costs;
      }
      return null;
    } catch (err) {
      console.error("Error getting installments:", err);
      return null;
    }
  }, [mp]);

  const createCardToken = useCallback(async (cardData: CardTokenData): Promise<string | null> => {
    if (!mp) return null;

    try {
      const cardToken = await mp.createCardToken({
        cardNumber: cardData.cardNumber.replace(/\s/g, ""),
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: cardData.cardExpirationMonth,
        cardExpirationYear: cardData.cardExpirationYear,
        securityCode: cardData.securityCode,
        identificationType: cardData.identificationType,
        identificationNumber: cardData.identificationNumber.replace(/\D/g, ""),
      });

      if (cardToken && cardToken.id) {
        return cardToken.id;
      }
      return null;
    } catch (err) {
      console.error("Error creating card token:", err);
      return null;
    }
  }, [mp]);

  return {
    mp,
    loading,
    error,
    getPaymentMethods,
    getIssuers,
    getInstallments,
    createCardToken,
  };
}
