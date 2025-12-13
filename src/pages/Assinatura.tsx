import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight, CreditCard, QrCode, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 29,90",
    period: "/mês",
    description: "Ideal para quem está começando",
    features: [
      "Notícias básicas do mercado",
      "2 relatórios personalizados/mês",
      "Calculadora de juros compostos",
      "Cursos básicos",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 79,90",
    period: "/mês",
    description: "Para investidores comprometidos",
    features: [
      "Tudo do Básico +",
      "Notícias premium ilimitadas",
      "Relatórios ilimitados",
      "Painel de cotações completo",
      "Todos os cursos",
      "Podcast de resumos",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 149,90",
    period: "/mês",
    description: "Para profissionais exigentes",
    features: [
      "Tudo do Pro +",
      "Relatórios detalhados prioritários",
      "Análises exclusivas",
      "Suporte dedicado via WhatsApp",
      "Acesso antecipado a novidades",
    ],
    popular: false,
  },
];

export default function Assinatura() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("cartao");
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    toast({
      title: "Pagamento confirmado!",
      description: "Redirecionando para seu perfil de investidor...",
    });

    setTimeout(() => {
      navigate("/perfil-investidor");
    }, 1500);
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Lupa <span className="text-gradient">Financeira</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Escolha Seu <span className="text-gradient">Plano</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecione o plano ideal para suas necessidades e comece sua jornada financeira hoje.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plans Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Cards */}
            <div id="pricing" className="grid md:grid-cols-3 gap-4">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? "bg-card border-2 border-primary shadow-large"
                      : "bg-card border border-border hover:border-primary/50 shadow-soft"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-accent text-accent-foreground text-xs font-semibold">
                        <Star className="w-3 h-3" />
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="font-heading font-bold text-2xl text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {selectedPlan === plan.id && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-soft"
            >
              <h2 className="font-heading font-bold text-xl text-foreground mb-6">
                Dados para Pagamento
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={handleInputChange}
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
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <Label>Forma de Pagamento</Label>
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
                  <div className="grid md:grid-cols-3 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
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

                <Button type="submit" variant="hero" size="xl" className="w-full">
                  Confirmar Pagamento e Começar
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8 p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <h3 className="font-heading font-bold text-lg text-foreground mb-6">
                Resumo do Pedido
              </h3>

              {selectedPlanData && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        Plano {selectedPlanData.name}
                      </span>
                      {selectedPlanData.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlanData.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{selectedPlanData.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="text-accent">- R$ 0,00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-heading font-bold text-foreground">Total</span>
                    <div className="text-right">
                      <span className="font-heading font-bold text-2xl text-foreground">
                        {selectedPlanData.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedPlanData.period}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-accent text-center">
                  🔒 Pagamento 100% seguro e criptografado
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
