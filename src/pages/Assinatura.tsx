import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Check, X, Star, ArrowRight, Rocket, Shield, Clock, 
  FileText, BarChart3, Calculator, Headphones, Newspaper,
  TrendingUp, Zap, Lock, AlertTriangle, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Countdown Timer Hook
const useCountdown = (initialHours: number) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('offerCountdown');
    if (saved) {
      const remaining = parseInt(saved) - Date.now();
      return remaining > 0 ? remaining : initialHours * 60 * 60 * 1000;
    }
    const endTime = Date.now() + initialHours * 60 * 60 * 1000;
    localStorage.setItem('offerCountdown', endTime.toString());
    return initialHours * 60 * 60 * 1000;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          const endTime = Date.now() + 48 * 60 * 60 * 1000;
          localStorage.setItem('offerCountdown', endTime.toString());
          return 48 * 60 * 60 * 1000;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

// Fake dynamic counter
const useVagasCounter = () => {
  const [vagas, setVagas] = useState(47);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVagas(prev => {
        const change = Math.random() > 0.7 ? -1 : 0;
        const newValue = prev + change;
        return newValue < 12 ? 47 : newValue;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return vagas;
};

const features = [
  {
    icon: FileText,
    title: "5 Relatórios Personalizados/Mês",
    description: "Escolha os temas mais relevantes para você:",
    bullets: [
      "Ações, Renda Fixa, Criptomoedas, ESG e mais",
      "Versões Resumidas ou Detalhadas",
      "Receba por Email, WhatsApp ou Telegram",
      "Formato PDF ou Áudio"
    ],
    realValue: "R$ 197"
  },
  {
    icon: BarChart3,
    title: "Painel de Cotações em Tempo Real",
    description: "Acompanhe o mercado como um profissional:",
    bullets: [
      "Ações, ETFs e Fundos Imobiliários",
      "Atualização a cada 15 minutos",
      "Watchlist personalizada",
      "Principais índices (Ibovespa, S&P 500)"
    ],
    realValue: "R$ 89"
  },
  {
    icon: Calculator,
    title: "Calculadora de Juros Compostos",
    description: "Visualize seu futuro financeiro:",
    bullets: [
      "Simule investimentos de longo prazo",
      "Gráficos de evolução patrimonial",
      "Planeje aposentadoria",
      "Entenda o poder dos juros compostos"
    ],
    realValue: "R$ 47"
  },
  {
    icon: Headphones,
    title: "Podcast dos Seus Relatórios",
    description: "Consuma informação em qualquer lugar:",
    bullets: [
      "Áudio narrado dos seus relatórios",
      "Resumo semanal, mensal ou anual",
      "Ouça no carro, academia ou caminhada",
      "Voz profissional e clara"
    ],
    realValue: "R$ 67"
  },
  {
    icon: Newspaper,
    title: "Notícias do Mercado Financeiro",
    description: "Fique sempre atualizado:",
    bullets: [
      "Notícias do Brasil e do mundo",
      "Filtros por categoria",
      "Fontes confiáveis e verificadas",
      "Feed atualizado constantemente"
    ],
    realValue: "R$ 79"
  }
];

const testimonials = [
  {
    name: "Ricardo Almeida",
    role: "Analista de Investimentos",
    time: "3 anos na plataforma",
    text: "Antes eu gastava horas pesquisando notícias e cotações em vários sites. Agora tenho tudo em um lugar, organizado e fácil de entender. Os relatórios personalizados me economizam pelo menos 10 horas por semana!",
    avatar: "RA"
  },
  {
    name: "Marina Costa",
    role: "Gestora de Fundos",
    time: "2 anos na plataforma",
    text: "O podcast dos relatórios mudou minha rotina! Ouço no caminho do trabalho e chego informada. A calculadora de juros me ajudou a visualizar minha aposentadoria. Melhor investimento que já fiz - e olha que trabalho no mercado!",
    avatar: "MC"
  },
  {
    name: "Carlos Mendes",
    role: "Trader Independente",
    time: "1 ano na plataforma",
    text: "Por R$ 29,90 tenho acesso a ferramentas que antes só encontrava em plataformas de R$ 200+. O painel de cotações é preciso, os relatórios são bem escritos. Já recomendei para toda minha equipe!",
    avatar: "CM"
  }
];

const forYou = [
  "Você quer tomar decisões financeiras mais inteligentes",
  "Precisa de informações confiáveis sobre o mercado",
  "Não tem tempo para pesquisar em vários sites",
  "Quer acompanhar suas ações e investimentos",
  "Busca relatórios personalizados sobre temas específicos",
  "Deseja entender o poder dos juros compostos",
  "Quer se manter atualizado sobre economia",
  "Procura uma solução profissional por preço acessível"
];

const notForYou = [
  "Você prefere tomar decisões financeiras no escuro",
  "Acredita que informação não tem valor",
  "Tem horas para pesquisar manualmente todos os dias",
  "Não se importa com seu futuro financeiro",
  "Acha que R$ 29,90 é caro demais para seu futuro",
  "Prefere depender de dicas aleatórias de internet",
  "Não quer facilitar sua vida financeira"
];

const faqItems = [
  {
    question: "Por que apenas R$ 29,90? Qual o truque?",
    answer: "Não há truque! Nosso modelo de negócio é baseado em volume. Preferimos ter milhares de clientes satisfeitos pagando pouco do que poucos pagando muito. Além disso, automatizamos processos para reduzir custos e passar a economia para você."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "SIM! Cancele quando quiser, sem multas ou taxas. Acreditamos que você deve pagar apenas enquanto estiver feliz com o serviço."
  },
  {
    question: "Como funcionam os 5 relatórios mensais?",
    answer: "Você escolhe os temas que mais importam para você (ações, criptomoedas, inflação, etc.), o formato (resumido ou detalhado), e recebe via email, WhatsApp ou Telegram. Simples e rápido!"
  },
  {
    question: "As cotações são realmente em tempo real?",
    answer: "São atualizadas a cada 15 minutos durante o horário de pregão, que é o padrão da indústria para plataformas acessíveis. Tempo real absoluto custa milhares por mês em licenças de dados."
  },
  {
    question: "Preciso de conhecimento avançado?",
    answer: "NÃO! A Lupa Financeira foi criada para ser intuitiva. Se você sabe usar WhatsApp, saberá usar nossa plataforma. Além disso, nossos relatórios explicam conceitos de forma clara."
  },
  {
    question: "Tem cursos inclusos?",
    answer: "No Plano Básico, você tem acesso à estrutura dos cursos e conteúdo introdutório. Os cursos completos farão parte de planos futuros, mas já incluímos o essencial para você começar!"
  },
  {
    question: "Qual a diferença para apps de banco?",
    answer: "Apps de banco mostram apenas SEUS investimentos. A Lupa Financeira mostra o MERCADO INTEIRO - notícias, análises, cotações de qualquer ativo. É complementar, não substitui!"
  },
  {
    question: "Como funciona o pagamento?",
    answer: "100% seguro via Mercado Pago. Aceitamos cartão de crédito, PIX e boleto. Seus dados são protegidos por criptografia de nível bancário."
  }
];

const comparisonData = [
  { feature: "Preço", free: "Grátis (anúncios)", premium: "R$ 300-500/mês", lupa: "R$ 29,90/mês" },
  { feature: "Relatórios Personalizados", free: false, premium: true, lupa: "5/mês" },
  { feature: "Cotações Tempo Real", free: "partial", premium: true, lupa: true },
  { feature: "Calculadora Juros", free: "partial", premium: true, lupa: "Avançada" },
  { feature: "Podcast Personalizado", free: false, premium: false, lupa: true },
  { feature: "Notícias Filtradas", free: "partial", premium: true, lupa: true },
  { feature: "Interface Simples", free: "Confusa", premium: "Complexa", lupa: "Intuitiva" },
  { feature: "Suporte", free: false, premium: "partial", lupa: true }
];

const CTAButton = ({ children, className = "", size = "default" }: { children: React.ReactNode; className?: string; size?: "default" | "lg" | "xl" }) => {
  const navigate = useNavigate();
  const sizeClasses = {
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <Button 
      variant="hero" 
      size="xl"
      onClick={() => navigate('/checkout')}
      className={`group ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Button>
  );
};

export default function Assinatura() {
  const { hours, minutes, seconds } = useCountdown(48);
  const vagas = useVagasCounter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
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

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 text-warning border border-warning/30 mb-6"
            >
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">OFERTA EXCLUSIVA - Apenas R$ 29,90/mês</span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
              Transforme-se no <span className="text-gradient">Protagonista</span> da Sua Jornada Financeira
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Enquanto o mercado avança, você não pode ficar para trás. 
              Tome decisões inteligentes com informações que investidores 
              profissionais usam - <strong className="text-foreground">por menos de R$ 1 por dia.</strong>
            </p>

            {/* CTA */}
            <CTAButton size="xl" className="mb-8 animate-pulse">
              <Rocket className="w-5 h-5 mr-2" />
              Comece Agora - Apenas R$ 29,90/mês
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </CTAButton>

            {/* Timer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4 mb-6"
            >
              <div className="flex items-center gap-2 text-warning">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Oferta válida por:</span>
              </div>
              <div className="flex gap-3">
                {[
                  { value: hours.toString().padStart(2, '0'), label: 'Horas' },
                  { value: minutes.toString().padStart(2, '0'), label: 'Min' },
                  { value: seconds.toString().padStart(2, '0'), label: 'Seg' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-card border border-border shadow-medium flex items-center justify-center">
                      <span className="font-heading font-bold text-2xl text-foreground">{item.value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span>Acesso imediato após pagamento</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <span>Pagamento 100% seguro via Mercado Pago</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STORYTELLING SECTION */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Por Que a Maioria Das Pessoas <span className="text-gradient">Fica Estagnada</span> no Mercado Financeiro?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                Falta de Informação Confiável
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A cada dia que passa sem informações corretas, você perde oportunidades de crescimento. 
                Enquanto investidores bem-informados lucram, outros assistem de longe.
              </p>
            </motion.div>

            {/* Consequence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-warning/5 border border-warning/20"
            >
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                O Tempo Não Espera
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada decisão financeira adiada é dinheiro deixado na mesa. 
                Juros compostos trabalham contra você quando não age. O mercado não para.
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-accent/5 border border-accent/20"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                Torne-se o Herói
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Com as ferramentas certas, você toma controle. 
                Informação de qualidade + decisões inteligentes = liberdade financeira. 
                Sua jornada começa hoje.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Tudo Que Você Precisa Para <span className="text-gradient">Dominar Suas Finanças</span>
            </h2>
            <p className="text-xl text-foreground font-semibold mb-2">Por Apenas R$ 29,90/mês</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acesso completo a ferramentas profissionais que investidores 
              experientes pagam centenas de reais mensalmente.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <ul className="space-y-1 mb-4">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground line-through">Valor Real: {feature.realValue}/mês</p>
                  <p className="text-sm font-semibold text-accent flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Incluso no seu plano
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Value Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border-2 border-primary/30 shadow-large text-center"
          >
            <p className="text-muted-foreground mb-2">Valor Real de Mercado:</p>
            <p className="font-heading font-bold text-3xl text-muted-foreground line-through mb-4">R$ 479/mês</p>
            <p className="text-muted-foreground mb-2">Seu Investimento:</p>
            <p className="font-heading font-bold text-5xl text-foreground mb-4">R$ 29,90<span className="text-xl font-normal text-muted-foreground">/mês</span></p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
              <span className="font-bold">🎁 Você Economiza: R$ 449,10/mês (93% de desconto)</span>
            </div>
            <CTAButton size="lg" className="w-full md:w-auto">
              💎 Garantir Minha Vaga Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Junte-se a Centenas de <span className="text-gradient">Investidores Inteligentes</span>
            </h2>
            <p className="text-muted-foreground">Veja como a Lupa Financeira está transformando vidas</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border shadow-soft"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-accent">{testimonial.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOR YOU SECTION */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              A Lupa Financeira É <span className="text-gradient">Para Você</span> Se...
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For You */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-accent/5 border border-accent/20"
            >
              <ul className="space-y-3">
                {forYou.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-foreground">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not For You */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20"
            >
              <ul className="space-y-3">
                {notForYou.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <CTAButton size="lg">
              ✨ Sim, Isso É Para Mim!
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON TABLE */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Compare: Lupa Financeira vs. <span className="text-gradient">Alternativas</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left font-heading font-bold text-foreground bg-secondary/50 rounded-tl-xl">Recurso</th>
                  <th className="p-4 text-center font-heading font-medium text-muted-foreground bg-secondary/50">Sites Gratuitos</th>
                  <th className="p-4 text-center font-heading font-medium text-muted-foreground bg-secondary/50">Bloomberg/Reuters</th>
                  <th className="p-4 text-center font-heading font-bold text-primary bg-primary/10 rounded-tr-xl">Lupa Financeira</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-4 font-medium text-foreground">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.free === true ? <Check className="w-5 h-5 text-accent mx-auto" /> :
                       row.free === false ? <X className="w-5 h-5 text-destructive mx-auto" /> :
                       row.free === "partial" ? <span className="text-warning">⚠️</span> :
                       <span className="text-sm text-muted-foreground">{row.free}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {row.premium === true ? <Check className="w-5 h-5 text-accent mx-auto" /> :
                       row.premium === false ? <X className="w-5 h-5 text-destructive mx-auto" /> :
                       row.premium === "partial" ? <span className="text-warning">⚠️</span> :
                       <span className="text-sm text-muted-foreground">{row.premium}</span>}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {row.lupa === true ? <Check className="w-5 h-5 text-accent mx-auto" /> :
                       row.lupa === false ? <X className="w-5 h-5 text-destructive mx-auto" /> :
                       <span className="text-sm font-semibold text-primary">{row.lupa}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="text-center mt-10">
            <CTAButton size="lg">
              🏆 Escolher a Melhor Opção
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* 7. GUARANTEE SECTION */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-card to-accent/5 border-2 border-accent/30 shadow-large text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
              🛡️ GARANTIA DE SATISFAÇÃO 100%
            </h2>
            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
              Experimente sem Risco por 7 Dias
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto">
              Se nos próximos 7 dias você não sentir que a Lupa Financeira 
              vale cada centavo, basta cancelar e você receberá 100% do 
              seu dinheiro de volta. Sem perguntas. Sem burocracia. <strong className="text-foreground">Simples assim.</strong>
            </p>
            <CTAButton size="lg">
              ✅ Quero Testar Sem Risco
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Perguntas <span className="text-gradient">Frequentes</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-background border border-border rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* 9. URGENCY SECTION */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-destructive/10 via-card to-warning/10 border-2 border-destructive/30 shadow-large text-center animate-pulse-subtle"
          >
            <div className="flex items-center justify-center gap-2 text-destructive mb-4">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-heading font-bold text-xl">ATENÇÃO: VAGAS LIMITADAS</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Para manter a qualidade do serviço e do suporte, estamos 
              limitando novas assinaturas a <strong className="text-foreground">100 pessoas por semana</strong>.
            </p>
            <div className="mb-6">
              <p className="text-muted-foreground mb-2">Atualmente restam:</p>
              <p className="font-heading font-bold text-4xl text-destructive">{vagas} vagas</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Não perca essa oportunidade de transformar sua vida 
              financeira por menos de R$ 1 por dia.
            </p>
            <div className="flex items-center justify-center gap-2 text-warning mb-6">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Esta página expira em: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <CTAButton size="xl" className="animate-pulse">
              🔥 QUERO GARANTIR MINHA VAGA AGORA
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* 10. FINAL CTA SECTION */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-primary-foreground/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary-glow)/0.3),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
              Sua Jornada Financeira Começa <span className="underline decoration-warning decoration-4">HOJE</span>
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Não deixe para amanhã a decisão que pode mudar seu futuro
            </p>

            {/* Summary */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-primary-foreground/90 text-sm mb-10">
              {[
                "R$ 29,90/mês",
                "5 Relatórios",
                "Cotações",
                "Calculadora",
                "Podcast",
                "Notícias",
                "Cancele Quando Quiser"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Big CTA */}
            <Button 
              size="xl"
              onClick={() => window.location.href = '/checkout'}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg md:text-xl px-10 py-6 rounded-xl shadow-large hover:shadow-glow transition-all group"
            >
              <Rocket className="w-6 h-6 mr-2" />
              SIM! QUERO TRANSFORMAR MINHAS FINANÇAS AGORA
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-primary-foreground/70 mt-4">R$ 29,90/mês - Acesso Imediato</p>

            {/* Micro-copy */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pagamento 100% Seguro via Mercado Pago</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Acesso instantâneo após confirmação</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Garantia de 7 dias ou seu dinheiro de volta</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-background" />
              </div>
              <span className="font-heading font-bold text-xl text-background">
                Lupa Financeira
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
              <a href="#" className="hover:text-background transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-background transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-background transition-colors">Perguntas Frequentes</a>
              <a href="#" className="hover:text-background transition-colors">Contato/Suporte</a>
              <a href="#" className="hover:text-background transition-colors">Sobre Nós</a>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
            <p className="mb-2">© 2026 Lupa Financeira - CNPJ XX.XXX.XXX/0001-XX</p>
            <p className="mb-2">Todos os direitos reservados.</p>
            <p className="max-w-2xl mx-auto">
              A Lupa Financeira não é uma instituição financeira e não 
              oferece consultoria de investimentos. Todo conteúdo é 
              informativo e educacional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
