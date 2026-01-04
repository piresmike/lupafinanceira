import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { coursesData } from "@/data/coursesData";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { CourseCard } from "@/components/courses/CourseCard";
import { StudyHistory } from "@/components/courses/StudyHistory";

export default function Cursos() {
  const [activeTab, setActiveTab] = useState("all");
  const { isCourseCompleted, getCompletions, getTotalStudyTime, isLoaded } = useCourseProgress();

  const handleViewCourses = () => {
    setActiveTab("all");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 flex items-center gap-3">
          📚 Academia Lupa Financeira
        </h1>
        <p className="text-muted-foreground">
          Desenvolva suas habilidades no mercado financeiro com nossos cursos estruturados.
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-6">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              Todos os Cursos
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none">
              Meu Histórico de Estudos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {coursesData.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompleted={isCourseCompleted(course.id)}
                  index={index}
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="history">
            <StudyHistory
              completions={getCompletions()}
              totalStudyTime={getTotalStudyTime()}
              onViewCourses={handleViewCourses}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
