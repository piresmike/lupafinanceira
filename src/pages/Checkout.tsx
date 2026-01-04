import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Check, ArrowRight, CreditCard, QrCode, FileText, TrendingUp,
  Lock, Shield, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cartao");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Termos obrigatórios",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nome || !formData.email || !formData.cpf || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento confirmado!",
        description: "Redirecionando para seu perfil de investidor...",
      });

      setTimeout(() => {
        navigate("/perfil-investidor");
      }, 1500);
    }, 2000);
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
          {/* Payment Form - 3 columns */}
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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Forma de Pagamento
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="cartao"
                        id="cartao"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="cartao"
                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                      >
                        <CreditCard className="w-6 h-6 mb-2 text-primary" />
                        <span className="text-sm font-medium">Cartão</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="pix"
                        id="pix"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="pix"
                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                      >
                        <QrCode className="w-6 h-6 mb-2 text-primary" />
                        <span className="text-sm font-medium">PIX</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="boleto"
                        id="boleto"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="boleto"
                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                      >
                        <FileText className="w-6 h-6 mb-2 text-primary" />
                        <span className="text-sm font-medium">Boleto</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details */}
                {paymentMethod === "cartao" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/AA"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
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
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === "pix" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-secondary/50 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      Após confirmar, você receberá o código PIX para pagamento.
                    </p>
                  </motion.div>
                )}

                {paymentMethod === "boleto" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-secondary/50 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      Após confirmar, você receberá o boleto por e-mail.
                    </p>
                  </motion.div>
                )}

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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Pagamento - R$ 29,90/mês
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-8 space-y-6">
              {/* Summary Card */}
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

                  {/* Included Features */}
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

              {/* Security Badge */}
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

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Mercado Pago</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
