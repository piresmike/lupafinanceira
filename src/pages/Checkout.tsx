import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ArrowRight, CreditCard, QrCode,
  Lock, Shield, ArrowLeft, TrendingUp, Loader2, Copy, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useMercadoPago } from "@/hooks/useMercadoPago";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Utility functions for formatting
const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const formatCardNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 16);
  return numbers.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 4);
  if (numbers.length >= 2) {
    return numbers.substring(0, 2) + "/" + numbers.substring(2);
  }
  return numbers;
};

interface Installment {
  installments: number;
  installment_amount: number;
  installment_rate: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mp, loading: mpLoading, getPaymentMethods, getIssuers, getInstallments, createCardToken } = useMercadoPago();
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // PIX state
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [pixQRCodeBase64, setPixQRCodeBase64] = useState<string | null>(null);
  const [showPixQRCode, setShowPixQRCode] = useState(false);
  
  // Card state
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [issuerId, setIssuerId] = useState<string | null>(null);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
  });

  // Fetch card info when number changes
  useEffect(() => {
    const fetchCardInfo = async () => {
      const cleanNumber = formData.cardNumber.replace(/\s/g, "");
      if (cleanNumber.length >= 6 && mp) {
        const methods = await getPaymentMethods(cleanNumber);
        if (methods && methods.length > 0) {
          const method = methods[0];
          setPaymentMethodId(method.id);
          setCardBrand(method.name);
          
          const issuers = await getIssuers(method.id);
          if (issuers && issuers.length > 0) {
            setIssuerId(issuers[0].id);
          }
          
          const installmentOptions = await getInstallments(cleanNumber);
          if (installmentOptions) {
            setInstallments(installmentOptions);
          }
        }
      } else {
        setPaymentMethodId(null);
        setCardBrand(null);
        setIssuerId(null);
        setInstallments([]);
      }
    };

    fetchCardInfo();
  }, [formData.cardNumber, mp, getPaymentMethods, getIssuers, getInstallments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "cpf":
        formattedValue = formatCPF(value);
        break;
      case "telefone":
        formattedValue = formatPhone(value);
        break;
      case "cardNumber":
        formattedValue = formatCardNumber(value);
        break;
      case "cardExpiry":
        formattedValue = formatExpiry(value);
        break;
      case "cardCvv":
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
        break;
      case "cardholderName":
        formattedValue = value.toUpperCase();
        break;
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const processCardPayment = async () => {
    if (!mp || !user) {
      toast({ title: "Erro", description: "Sistema não inicializado", variant: "destructive" });
      return;
    }

    const expiryParts = formData.cardExpiry.split("/");
    if (expiryParts.length !== 2) {
      setError("Data de validade inválida");
      return;
    }

    const token = await createCardToken({
      cardNumber: formData.cardNumber,
      cardholderName: formData.cardholderName || formData.nome,
      cardExpirationMonth: expiryParts[0],
      cardExpirationYear: "20" + expiryParts[1],
      securityCode: formData.cardCvv,
      identificationType: "CPF",
      identificationNumber: formData.cpf,
    });

    if (!token) {
      setError("Erro ao processar dados do cartão. Verifique as informações.");
      return;
    }

    const { data, error: fnError } = await supabase.functions.invoke("process-payment", {
      body: {
        paymentMethod: "card",
        formData: {
          token,
          email: formData.email,
          identificationNumber: formData.cpf,
          identificationType: "CPF",
          installments: selectedInstallment,
          paymentMethodId,
          issuerId,
        },
        userId: user.id,
      },
    });

    if (fnError) {
      console.error("Function error:", fnError);
      setError("Erro ao processar pagamento. Tente novamente.");
      return;
    }

    if (data.success && data.status === "approved") {
      toast({ title: "Pagamento aprovado!", description: "Redirecionando..." });
      setTimeout(() => navigate("/perfil-investidor"), 1500);
    } else {
      setError(data.message || "Pagamento recusado. Tente novamente.");
    }
  };

  const processPixPayment = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
      return;
    }

    const { data, error: fnError } = await supabase.functions.invoke("process-payment", {
      body: {
        paymentMethod: "pix",
        formData: {
          email: formData.email,
          cpf: formData.cpf,
        },
        userId: user.id,
      },
    });

    if (fnError) {
      console.error("Function error:", fnError);
      setError("Erro ao gerar PIX. Tente novamente.");
      return;
    }

    if (data.success && data.qrCode) {
      setPixQRCode(data.qrCode);
      setPixQRCodeBase64(data.qrCodeBase64);
      setShowPixQRCode(true);
      toast({ title: "QR Code gerado!", description: "Escaneie para pagar." });
    } else {
      setError(data.message || "Erro ao gerar QR Code.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!acceptTerms) {
      toast({ title: "Termos obrigatórios", description: "Aceite os termos para continuar.", variant: "destructive" });
      return;
    }

    if (!formData.nome || !formData.email || !formData.cpf) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para continuar.", variant: "destructive" });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === "card") {
        await processCardPayment();
      } else {
        await processPixPayment();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixQRCode) {
      navigator.clipboard.writeText(pixQRCode);
      toast({ title: "Código copiado!", description: "Cole no app do seu banco." });
    }
  };

  const includedFeatures = [
    "5 Relatórios Personalizados/Mês",
    "Painel de Cotações em Tempo Real",
    "Calculadora de Juros Compostos",
    "Podcast dos Seus Relatórios",
    "Notícias do Mercado Financeiro",
    "Garantia de 7 Dias",
    "Cancele Quando Quiser"
  ];

  // Show PIX QR Code screen
  if (showPixQRCode && pixQRCode) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-2xl bg-card border border-border shadow-soft text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
            Pague com PIX
          </h2>
          <p className="text-muted-foreground mb-6">
            Escaneie o QR Code ou copie o código
          </p>

          {pixQRCodeBase64 && (
            <div className="mb-6 p-4 bg-white rounded-xl">
              <img 
                src={`data:image/png;base64,${pixQRCodeBase64}`} 
                alt="QR Code PIX" 
                className="w-48 h-48 mx-auto"
              />
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Código PIX:</p>
            <div className="flex gap-2">
              <Input 
                value={pixQRCode} 
                readOnly 
                className="text-xs font-mono"
              />
              <Button onClick={copyPixCode} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Aguardando pagamento...</span>
            </div>
          </div>

          <div className="text-left space-y-2 mb-6">
            <p className="text-sm font-medium text-foreground">Como pagar:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Escolha pagar com PIX</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento de R$ 29,90</li>
            </ol>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setShowPixQRCode(false)}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Lupa <span className="text-gradient">Financeira</span>
            </span>
          </Link>
          <Link 
            to="/assinatura" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para oferta
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-soft">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
                Finalize sua Assinatura
              </h1>
              <p className="text-muted-foreground mb-8">
                Preencha seus dados para começar sua jornada financeira
              </p>

              {mpLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {!mpLoading && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">Pagamento Recusado</p>
                            <p className="text-sm text-destructive/80">{error}</p>
                            <button
                              type="button"
                              onClick={() => setError(null)}
                              className="text-sm text-destructive underline mt-2"
                            >
                              Tentar novamente
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h2 className="font-heading font-semibold text-lg text-foreground">
                      Dados Pessoais
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          placeholder="Seu nome completo"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          maxLength={14}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          maxLength={15}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="space-y-4">
                    <h2 className="font-heading font-semibold text-lg text-foreground">
                      Forma de Pagamento
                    </h2>
                    <div className="flex border-b border-border">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          paymentMethod === "card"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Cartão de Crédito
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          paymentMethod === "pix"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        PIX
                      </button>
                    </div>
                  </div>

                  {/* Card Form */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === "card" && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">
                            Número do Cartão
                            {cardBrand && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({cardBrand})
                              </span>
                            )}
                          </Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            maxLength={19}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Nome no Cartão</Label>
                          <Input
                            id="cardholderName"
                            name="cardholderName"
                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                            value={formData.cardholderName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Validade</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/AA"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv">CVV</Label>
                            <Input
                              id="cardCvv"
                              name="cardCvv"
                              placeholder="123"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                              maxLength={4}
                            />
                          </div>
                        </div>

                        {installments.length > 0 && (
                          <div className="space-y-2">
                            <Label htmlFor="installments">Parcelamento</Label>
                            <select
                              id="installments"
                              value={selectedInstallment}
                              onChange={(e) => setSelectedInstallment(parseInt(e.target.value))}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {installments.map((option) => (
                                <option key={option.installments} value={option.installments}>
                                  {option.installments}x de R$ {option.installment_amount.toFixed(2)}
                                  {option.installment_rate === 0 ? " sem juros" : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                          <p className="text-sm text-accent">
                            <strong>ℹ️ Cobrança Recorrente:</strong> Após a aprovação, você será
                            cobrado automaticamente R$ 29,90 todo mês. Cancele quando quiser.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "pix" && (
                      <motion.div
                        key="pix"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                          <p className="text-sm text-primary">
                            💡 <strong>PIX Instantâneo:</strong> Pagamento aprovado em segundos!
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                          <p className="text-sm text-accent">
                            <strong>ℹ️ Cobrança Recorrente:</strong> Após a aprovação do primeiro
                            pagamento, você será cobrado automaticamente R$ 29,90 todo mês.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      Li e aceito os{" "}
                      <a href="#" className="text-primary hover:underline">
                        Termos de Uso
                      </a>{" "}
                      e a{" "}
                      <a href="#" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    disabled={isLoading || mpLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : paymentMethod === "pix" ? (
                      <>
                        <QrCode className="w-5 h-5 mr-2" />
                        Gerar QR Code PIX - R$ 29,90
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Confirmar Pagamento - R$ 29,90/mês
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      <span>Pagamento 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>Mercado Pago</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-8 space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <h3 className="font-heading font-bold text-lg text-foreground mb-6">
                  Resumo do Pedido
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-bold text-foreground">
                        Plano Básico
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                        Mensal
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acesso completo a todas as ferramentas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Incluso:</p>
                    {includedFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">R$ 29,90</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Economia</span>
                      <span className="text-accent">- R$ 449,10 (93%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-heading font-bold text-foreground">Total</span>
                    <div className="text-right">
                      <span className="font-heading font-bold text-2xl text-foreground">
                        R$ 29,90
                      </span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Compra 100% Segura</p>
                    <p className="text-xs text-muted-foreground">Seus dados estão protegidos</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
