import { motion } from "framer-motion";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course, getCourseLevelColor } from "@/data/coursesData";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  isCompleted: boolean;
  index: number;
}

export function CourseCard({ course, isCompleted, index }: CourseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/cursos/${course.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium flex flex-col"
    >
      {/* Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
          {course.icon}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={getCourseLevelColor(course.level)}>
            {course.level}
          </Badge>
          {isCompleted ? (
            <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Concluído
            </Badge>
          ) : (
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Novo Curso
            </Badge>
          )}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2">
        {course.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
        {course.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {course.durationMinutes} min
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          {course.content.sections.length} seções
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleClick}
        variant={isCompleted ? "outline" : "default"}
        className="w-full"
      >
        {isCompleted ? "Revisar Curso" : "Iniciar Curso"}
      </Button>
    </motion.div>
  );
}
