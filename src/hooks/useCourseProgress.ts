import { useState, useEffect, useCallback } from "react";
import { CourseCompletion } from "@/data/coursesData";

const STORAGE_KEY = "lupa_financeira_course_completions";

export function useCourseProgress() {
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load completions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const completionsWithDates = parsed.map((c: any) => ({
          ...c,
          completedAt: new Date(c.completedAt),
        }));
        setCompletions(completionsWithDates);
      }
    } catch (error) {
      console.error("Error loading course completions:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever completions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
    }
  }, [completions, isLoaded]);

  const completeCourse = useCallback(
    (courseId: string, courseSlug: string, courseName: string, readingTimeMinutes: number) => {
      // Check if already completed
      const alreadyCompleted = completions.some((c) => c.courseId === courseId);
      if (alreadyCompleted) return false;

      const newCompletion: CourseCompletion = {
        courseId,
        courseSlug,
        courseName,
        completedAt: new Date(),
        readingTimeMinutes,
      };

      setCompletions((prev) => [...prev, newCompletion]);
      return true;
    },
    [completions]
  );

  const isCourseCompleted = useCallback(
    (courseId: string) => {
      return completions.some((c) => c.courseId === courseId);
    },
    [completions]
  );

  const getCompletionDate = useCallback(
    (courseId: string) => {
      const completion = completions.find((c) => c.courseId === courseId);
      return completion?.completedAt;
    },
    [completions]
  );

  const getTotalStudyTime = useCallback(() => {
    return completions.reduce((sum, c) => sum + c.readingTimeMinutes, 0);
  }, [completions]);

  const getCompletedCount = useCallback(() => {
    return completions.length;
  }, [completions]);

  const getCompletions = useCallback(() => {
    return [...completions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }, [completions]);

  return {
    completions,
    isLoaded,
    completeCourse,
    isCourseCompleted,
    getCompletionDate,
    getTotalStudyTime,
    getCompletedCount,
    getCompletions,
  };
}
