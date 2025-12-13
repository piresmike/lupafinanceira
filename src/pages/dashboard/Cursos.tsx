import { motion } from "framer-motion";
import { AlertTriangle, Clock, BarChart, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: 1,
    title: "Introdução ao Mercado de Ações",
    description: "Aprenda os fundamentos do mercado de ações e como começar a investir.",
    duration: "2h 30min",
    level: "Iniciante",
    lessons: 12,
    locked: false,
  },
  {
    id: 2,
    title: "Como Ler um Balanço Patrimonial",
    description: "Domine a análise de demonstrações financeiras de empresas.",
    duration: "3h 45min",
    level: "Intermediário",
    lessons: 15,
    locked: false,
  },
  {
    id: 3,
    title: "Fundos de Investimento para Iniciantes",
    description: "Entenda como funcionam os fundos e qual é ideal para você.",
    duration: "1h 50min",
    level: "Iniciante",
    lessons: 8,
    locked: false,
  },
  {
    id: 4,
    title: "Análise Técnica: Os Fundamentos",
    description: "Aprenda a ler gráficos e identificar tendências de mercado.",
    duration: "4h 20min",
    level: "Intermediário",
    lessons: 18,
    locked: false,
  },
  {
    id: 5,
    title: "Diversificação de Portfólio",
    description: "Estratégias para montar uma carteira equilibrada e resiliente.",
    duration: "2h 15min",
    level: "Intermediário",
    lessons: 10,
    locked: false,
  },
  {
    id: 6,
    title: "Renda Fixa: Títulos Públicos e Privados",
    description: "Tudo sobre CDBs, LCIs, LCAs, Tesouro Direto e debêntures.",
    duration: "3h 00min",
    level: "Iniciante",
    lessons: 14,
    locked: false,
  },
  {
    id: 7,
    title: "Criptomoedas: Conceitos Básicos",
    description: "Entenda o mundo das criptomoedas e blockchain.",
    duration: "2h 40min",
    level: "Iniciante",
    lessons: 11,
    locked: false,
  },
  {
    id: 8,
    title: "Como Montar uma Carteira de Investimentos",
    description: "Passo a passo para construir seu portfólio ideal.",
    duration: "2h 00min",
    level: "Iniciante",
    lessons: 9,
    locked: false,
  },
  {
    id: 9,
    title: "Indicadores Econômicos que Todo Investidor Deve Conhecer",
    description: "PIB, inflação, juros e outros indicadores explicados.",
    duration: "1h 45min",
    level: "Iniciante",
    lessons: 7,
    locked: false,
  },
  {
    id: 10,
    title: "Gestão de Risco e Proteção Patrimonial",
    description: "Aprenda a proteger seus investimentos em qualquer cenário.",
    duration: "3h 30min",
    level: "Avançado",
    lessons: 16,
    locked: true,
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Iniciante":
      return "bg-accent/10 text-accent border-accent/20";
    case "Intermediário":
      return "bg-primary/10 text-primary border-primary/20";
    case "Avançado":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Cursos() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          Cursos Educacionais
        </h1>
        <p className="text-muted-foreground">
          Aprenda sobre o mercado financeiro com nossos cursos estruturados.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-warning mb-1">Importante</p>
          <p className="text-sm text-muted-foreground">
            Estes cursos não substituem uma instituição de ensino, mas servem como uma bússola 
            para direcionar seu aprendizado no mercado financeiro.
          </p>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 ${
              course.locked ? "opacity-60" : "hover:shadow-medium"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {course.locked ? (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <Play className="w-6 h-6 text-primary" />
                )}
              </div>
              <Badge variant="outline" className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
            </div>

            <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="w-4 h-4" />
                {course.lessons} aulas
              </div>
            </div>

            <Button
              variant={course.locked ? "outline" : "default"}
              className="w-full"
              disabled={course.locked}
            >
              {course.locked ? "Upgrade para Acessar" : "Iniciar Curso"}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
