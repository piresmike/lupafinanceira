import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const questions = [
  {
    id: 1,
    question: "Qual sua experiência com investimentos?",
    options: [
      { value: 1, label: "Nenhuma, estou começando agora" },
      { value: 2, label: "Básica, invisto há menos de 2 anos" },
      { value: 3, label: "Intermediária, invisto há 2-5 anos" },
      { value: 4, label: "Avançada, invisto há mais de 5 anos" },
    ],
  },
  {
    id: 2,
    question: "Qual seu principal objetivo financeiro?",
    options: [
      { value: 1, label: "Preservar capital" },
      { value: 2, label: "Crescimento moderado" },
      { value: 3, label: "Crescimento acelerado" },
      { value: 4, label: "Especulação" },
    ],
  },
  {
    id: 3,
    question: "Como você reage a uma queda de 20% no valor dos seus investimentos?",
    options: [
      { value: 1, label: "Vendo tudo imediatamente" },
      { value: 2, label: "Fico preocupado e considero vender" },
      { value: 3, label: "Mantenho a estratégia" },
      { value: 4, label: "Aproveito para comprar mais" },
    ],
  },
  {
    id: 4,
    question: "Qual percentual do seu patrimônio você está disposto a investir em ativos de maior risco?",
    options: [
      { value: 1, label: "0-10%" },
      { value: 2, label: "10-30%" },
      { value: 3, label: "30-60%" },
      { value: 4, label: "Mais de 60%" },
    ],
  },
  {
    id: 5,
    question: "Qual seu horizonte de investimento?",
    options: [
      { value: 1, label: "Menos de 1 ano" },
      { value: 2, label: "1-3 anos" },
      { value: 3, label: "3-5 anos" },
      { value: 4, label: "Mais de 5 anos" },
    ],
  },
  {
    id: 6,
    question: "Qual seu conhecimento sobre o mercado financeiro?",
    options: [
      { value: 1, label: "Muito baixo" },
      { value: 2, label: "Básico" },
      { value: 3, label: "Intermediário" },
      { value: 4, label: "Avançado" },
    ],
  },
  {
    id: 7,
    question: "Como você prefere alocar seus investimentos?",
    options: [
      { value: 1, label: "Apenas renda fixa" },
      { value: 2, label: "Maior parte renda fixa, pouco renda variável" },
      { value: 3, label: "Equilibrado entre renda fixa e variável" },
      { value: 4, label: "Maior parte renda variável" },
    ],
  },
  {
    id: 8,
    question: "Qual seu principal receio ao investir?",
    options: [
      { value: 1, label: "Perder o capital investido" },
      { value: 2, label: "Não atingir objetivos financeiros" },
      { value: 3, label: "Perder oportunidades melhores" },
      { value: 4, label: "Não me preocupo muito" },
    ],
  },
];

const profiles = {
  conservador: {
    title: "Conservador",
    description: "Você prioriza segurança e preservação de capital. Prefere investimentos de menor risco, mesmo que os retornos sejam mais modestos.",
    icon: Shield,
    color: "accent",
    recommendations: ["Tesouro Direto", "CDB", "LCI/LCA", "Fundos de Renda Fixa"],
  },
  moderado: {
    title: "Moderado",
    description: "Você busca equilíbrio entre segurança e crescimento. Aceita algum risco em troca de retornos potencialmente maiores.",
    icon: Target,
    color: "primary",
    recommendations: ["Fundos Multimercado", "Ações de Dividendos", "Fundos Imobiliários", "Renda Fixa + Variável"],
  },
  arrojado: {
    title: "Arrojado",
    description: "Você aceita riscos maiores em busca de retornos superiores. Tem tolerância para volatilidade e foco no longo prazo.",
    icon: Zap,
    color: "warning",
    recommendations: ["Ações de Crescimento", "Small Caps", "ETFs Internacionais", "Criptomoedas"],
  },
};

export default function PerfilInvestidor() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState<keyof typeof profiles | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateProfile = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 33) return "conservador";
    if (percentage <= 66) return "moderado";
    return "arrojado";
  };

  const handleNext = () => {
    if (answers[questions[currentQuestion].id] === undefined) {
      toast({
        title: "Selecione uma opção",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const calculatedProfile = calculateProfile();
      setProfile(calculatedProfile);
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

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
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                    <span>{Math.round(progress)}% concluído</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Welcome Text (only on first question) */}
                {currentQuestion === 0 && (
                  <div className="text-center mb-8 p-6 rounded-2xl bg-card border border-border">
                    <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
                      Bem-vindo à Lupa Financeira!
                    </h1>
                    <p className="text-muted-foreground">
                      Para personalizar sua experiência, queremos conhecer seu perfil de investidor.
                    </p>
                  </div>
                )}

                {/* Question Card */}
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-soft"
                >
                  <h2 className="font-heading font-bold text-xl text-foreground mb-6">
                    {currentQ.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQ.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(currentQ.id, option.value)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                          selectedAnswer === option.value
                            ? "bg-primary text-primary-foreground shadow-medium"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <Button variant="hero" onClick={handleNext}>
                    {currentQuestion === questions.length - 1 ? "Ver Resultado" : "Próxima"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {profile && (
                  <>
                    <div className="p-8 rounded-2xl bg-card border border-border shadow-large mb-8">
                      <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${
                        profiles[profile].color === "accent" ? "bg-accent/20" :
                        profiles[profile].color === "primary" ? "bg-primary/20" :
                        "bg-warning/20"
                      }`}>
                        {(() => {
                          const Icon = profiles[profile].icon;
                          return <Icon className={`w-10 h-10 ${
                            profiles[profile].color === "accent" ? "text-accent" :
                            profiles[profile].color === "primary" ? "text-primary" :
                            "text-warning"
                          }`} />;
                        })()}
                      </div>

                      <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                        Seu Perfil:{" "}
                        <span className={
                          profiles[profile].color === "accent" ? "text-accent" :
                          profiles[profile].color === "primary" ? "text-gradient" :
                          "text-warning"
                        }>
                          {profiles[profile].title}
                        </span>
                      </h1>

                      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        {profiles[profile].description}
                      </p>

                      <div className="p-4 rounded-xl bg-secondary/50">
                        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
                          Investimentos Recomendados:
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                          {profiles[profile].recommendations.map((rec) => (
                            <span
                              key={rec}
                              className="px-3 py-1 rounded-full text-sm bg-background text-foreground border border-border"
                            >
                              {rec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button variant="hero" size="xl" onClick={goToDashboard}>
                      Ir para Meu Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
