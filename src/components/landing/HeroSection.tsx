import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Wallet, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden pt-20 lg:pt-0">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center">
        <div className="w-full py-12 lg:py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Plataforma #1 de Informações Financeiras
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto mb-8"
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight mb-6">
              Torne-se o{" "}
              <span className="text-gradient">Protagonista</span>
              <br />
              das Suas Finanças
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              O mercado não espera. Cada decisão conta. Com a Lupa Financeira, você tem todas as ferramentas, 
              informações e conhecimento para dominar o mercado financeiro.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/assinatura">
                Comece Sua Jornada Agora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#features">Conhecer Recursos</a>
            </Button>
          </motion.div>

          {/* Value Props Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {/* Career/Business Card */}
            <div className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-foreground">
                  Para Sua Carreira & Empresa
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Transforme suas decisões corporativas com análises profundas. 
                  Aumente sua performance profissional e ganhe vantagem competitiva no ambiente de trabalho.
                </p>
                <ul className="space-y-2">
                  {["Relatórios profissionais", "Análises de mercado", "Insights exclusivos"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personal Finance Card */}
            <div className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Wallet className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-foreground">
                  Para Suas Finanças Pessoais
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Empodere suas decisões de investimento. Proteja seu patrimônio e 
                  acelere seu crescimento financeiro pessoal com informações de qualidade.
                </p>
                <ul className="space-y-2">
                  {["Calculadoras inteligentes", "Cursos educacionais", "Alertas personalizados"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { icon: TrendingUp, label: "+50.000 Investidores" },
              { icon: Shield, label: "Dados Criptografados" },
              { icon: Zap, label: "Atualizações em Tempo Real" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
