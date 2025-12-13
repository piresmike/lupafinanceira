import { motion } from "framer-motion";
import { 
  Newspaper, 
  GraduationCap, 
  FileText, 
  LineChart, 
  Calculator, 
  Headphones,
  MessageCircle,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Newspaper,
    title: "Notícias em Tempo Real",
    description: "Acompanhe as principais notícias do mercado financeiro brasileiro e mundial em tempo real.",
    color: "primary",
  },
  {
    icon: GraduationCap,
    title: "Cursos Educacionais",
    description: "Aprenda com cursos estruturados sobre investimentos, análise técnica e fundamentos.",
    color: "accent",
  },
  {
    icon: FileText,
    title: "Relatórios Personalizados",
    description: "Receba relatórios detalhados sobre os temas que mais importam para você.",
    color: "primary",
  },
  {
    icon: LineChart,
    title: "Painel de Cotações",
    description: "Acompanhe suas ações, fundos e criptomoedas favoritas em um painel personalizado.",
    color: "accent",
  },
  {
    icon: Calculator,
    title: "Calculadora de Juros",
    description: "Simule seus investimentos e veja o poder dos juros compostos ao longo do tempo.",
    color: "primary",
  },
  {
    icon: Headphones,
    title: "Resumos em Áudio",
    description: "Ouça seus relatórios em formato podcast, ideal para o dia a dia corrido.",
    color: "accent",
  },
  {
    icon: MessageCircle,
    title: "Entrega via WhatsApp",
    description: "Receba seus relatórios diretamente no WhatsApp ou Telegram.",
    color: "primary",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Seja notificado sobre eventos importantes que afetam seus investimentos.",
    color: "accent",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Funcionalidades
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Tudo que Você Precisa em{" "}
            <span className="text-gradient">Um Só Lugar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Da análise de mercado à educação financeira, a Lupa Financeira oferece 
            um ecossistema completo para suas decisões de investimento.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium"
            >
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === "primary" 
                    ? "bg-primary/10" 
                    : "bg-accent/10"
                }`}
              >
                <feature.icon 
                  className={`w-6 h-6 ${
                    feature.color === "primary" 
                      ? "text-primary" 
                      : "text-accent"
                  }`} 
                />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
