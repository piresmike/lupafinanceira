import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  GraduationCap,
  FileText,
  LineChart,
  Calculator,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quickStats = [
  { label: "Ibovespa", value: "127.450", change: "+1.24%", positive: true },
  { label: "Dólar", value: "R$ 4,92", change: "-0.45%", positive: false },
  { label: "Bitcoin", value: "$42.350", change: "+2.18%", positive: true },
  { label: "Selic", value: "11,75%", change: "0%", positive: true },
];

const quickActions = [
  {
    icon: Newspaper,
    title: "Notícias",
    description: "Últimas notícias do mercado",
    path: "/dashboard/noticias",
    color: "primary",
  },
  {
    icon: GraduationCap,
    title: "Cursos",
    description: "Continue aprendendo",
    path: "/dashboard/cursos",
    color: "accent",
  },
  {
    icon: FileText,
    title: "Novo Relatório",
    description: "Gerar relatório personalizado",
    path: "/dashboard/relatorios",
    color: "primary",
  },
  {
    icon: LineChart,
    title: "Cotações",
    description: "Acompanhe seus ativos",
    path: "/dashboard/cotacoes",
    color: "accent",
  },
  {
    icon: Calculator,
    title: "Calculadora",
    description: "Simule seus investimentos",
    path: "/dashboard/calculadora",
    color: "primary",
  },
];

const recentNews = [
  {
    title: "Ibovespa fecha em alta com expectativa de corte de juros",
    source: "InfoMoney",
    time: "2h atrás",
  },
  {
    title: "Dólar recua após dados positivos da economia brasileira",
    source: "Valor Econômico",
    time: "3h atrás",
  },
  {
    title: "Bitcoin supera US$ 42 mil e renova máxima de 2024",
    source: "CoinDesk",
    time: "4h atrás",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-2">
          Olá, Investidor! 👋
        </h1>
        <p className="text-muted-foreground">
          Confira as principais informações do mercado hoje.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickStats.map((stat, index) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border shadow-soft"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-heading font-bold text-xl text-foreground">
              {stat.value}
            </p>
            <div className={`flex items-center gap-1 text-sm ${
              stat.positive ? "text-accent" : "text-destructive"
            }`}>
              {stat.positive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stat.change}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
          Acesso Rápido
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  action.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                }`}
              >
                <action.icon
                  className={`w-5 h-5 ${
                    action.color === "primary" ? "text-primary" : "text-accent"
                  }`}
                />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent News */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-foreground">
            Últimas Notícias
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/noticias">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="space-y-3">
          {recentNews.map((news, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
            >
              <h3 className="font-medium text-foreground mb-2">{news.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{news.source}</span>
                <span>•</span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-xl mb-2">
              Quer um relatório personalizado?
            </h3>
            <p className="text-primary-foreground/80">
              Escolha um tema e receba análises detalhadas diretamente no seu WhatsApp.
            </p>
          </div>
          <Button variant="glass" size="lg" asChild>
            <Link to="/dashboard/relatorios">
              Gerar Relatório
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
