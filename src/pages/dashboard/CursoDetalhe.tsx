import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Lightbulb, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCourseBySlug, getCourseLevelColor } from "@/data/coursesData";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CursoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeCourse, isCourseCompleted } = useCourseProgress();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const course = slug ? getCourseBySlug(slug) : undefined;
  const isCompleted = course ? isCourseCompleted(course.id) : false;

  useEffect(() => {
    // Reset start time when course changes
    startTimeRef.current = Date.now();
    // Scroll to top
    window.scrollTo(0, 0);
  }, [slug]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Curso não encontrado</p>
        <Button onClick={() => navigate("/dashboard/cursos")}>
          Voltar para Cursos
        </Button>
      </div>
    );
  }

  const handleFinishCourse = () => {
    const readingTimeMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    
    const success = completeCourse(course.id, course.slug, course.title, readingTimeMinutes);
    
    if (success) {
      setShowSuccessModal(true);
    } else {
      toast({
        title: "Curso já concluído",
        description: "Este curso já está no seu histórico de estudos.",
      });
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    toast({
      title: "✅ Curso concluído com sucesso!",
      description: "Continue sua jornada de aprendizado.",
    });
    navigate("/dashboard/cursos");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/dashboard/cursos")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Cursos
      </motion.button>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-8 border-b border-border"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl">
            {course.icon}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={getCourseLevelColor(course.level)}>
                {course.level}
              </Badge>
              {isCompleted && (
                <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Concluído
                </Badge>
              )}
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Tempo estimado: {course.durationMinutes} minutos
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.content.sections.length} seções
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-lg max-w-none"
      >
        {/* Introduction */}
        <section className="mb-10">
          <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
            Introdução
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {course.content.introduction}
          </p>
        </section>

        {/* Sections */}
        {course.content.sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className="mb-10"
          >
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">📌</span>
              Seção {index + 1}: {section.title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              {section.content}
            </p>

            {section.bullets && (
              <ul className="space-y-2 mb-4">
                {section.bullets.map((bullet, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.tip && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  section.tip.type === "tip"
                    ? "bg-primary/5 border-primary/20"
                    : "bg-warning/10 border-warning/20"
                }`}
              >
                {section.tip.type === "tip" ? (
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium mb-1 ${section.tip.type === "tip" ? "text-primary" : "text-warning"}`}>
                    {section.tip.type === "tip" ? "💡 Dica Pro" : "⚠️ Atenção"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.tip.text}
                  </p>
                </div>
              </div>
            )}
          </motion.section>
        ))}

        {/* Key Learnings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 p-6 rounded-2xl bg-accent/5 border border-accent/20"
        >
          <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
            ✅ Principais Aprendizados
          </h2>
          <ul className="space-y-3">
            {course.content.keyLearnings.map((learning, index) => (
              <li key={index} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>{learning}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-12"
        >
          <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
            Próximos Passos
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {course.content.nextSteps}
          </p>
        </motion.section>
      </motion.article>

      {/* Finish Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-8 border-t border-border text-center"
      >
        {isCompleted ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Você já concluiu este curso. Deseja revisar novamente?
            </p>
            <Button variant="outline" onClick={() => navigate("/dashboard/cursos")}>
              Voltar para Cursos
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleFinishCourse}
            size="xl"
            variant="hero"
            className="gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Finalizar Curso
          </Button>
        )}
      </motion.div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <DialogTitle className="text-2xl font-heading">Parabéns!</DialogTitle>
            <DialogDescription className="text-base">
              Você concluiu o curso:
              <br />
              <strong className="text-foreground">"{course.title}"</strong>
              <br /><br />
              Este curso foi adicionado ao seu histórico de estudos.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={handleCloseModal} className="w-full" variant="default">
              Voltar para Cursos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
