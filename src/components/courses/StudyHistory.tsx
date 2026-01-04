import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseCompletion, coursesData } from "@/data/coursesData";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudyHistoryProps {
  completions: CourseCompletion[];
  totalStudyTime: number;
  onViewCourses: () => void;
}

export function StudyHistory({ completions, totalStudyTime, onViewCourses }: StudyHistoryProps) {
  const navigate = useNavigate();
  const totalCourses = coursesData.length;
  const completedCount = completions.length;
  const progressPercentage = (completedCount / totalCourses) * 100;

  if (completions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          Você ainda não concluiu nenhum curso
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Comece sua jornada de aprendizado agora e desenvolva suas habilidades no mercado financeiro!
        </p>
        <Button onClick={onViewCourses} variant="default">
          Ver Todos os Cursos
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
      >
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Seu Progresso
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-foreground">
              {completedCount} <span className="text-lg text-muted-foreground">de {totalCourses}</span>
            </p>
            <p className="text-sm text-muted-foreground">cursos concluídos</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-foreground">{totalStudyTime}</p>
            <p className="text-sm text-muted-foreground">minutos de estudo</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-foreground">{totalCourses - completedCount}</p>
            <p className="text-sm text-muted-foreground">cursos restantes</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso total</span>
            <span className="font-medium text-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {completedCount === totalCourses && (
          <div className="mt-4 p-3 rounded-lg bg-accent/20 text-accent text-sm font-medium text-center">
            🎉 Parabéns! Você concluiu todos os cursos!
          </div>
        )}
      </motion.div>

      {/* Completion Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Histórico de Conclusões
        </h3>
        
        <div className="space-y-4">
          {completions.map((completion, index) => (
            <motion.div
              key={completion.courseId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {completion.courseName}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span>
                    Concluído em {format(new Date(completion.completedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {completion.readingTimeMinutes} min de leitura
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/cursos/${completion.courseSlug}`)}
              >
                Revisar
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* View More Courses */}
      <div className="text-center pt-4">
        <Button variant="outline" onClick={onViewCourses}>
          Ver Todos os Cursos Disponíveis
        </Button>
      </div>
    </div>
  );
}
