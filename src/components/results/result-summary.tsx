
import React from "react";
import { Subject } from "@/lib/data";
import GlassCard from "@/components/ui/glass-card";
import { Award, BookOpen, Calendar, GraduationCap } from "lucide-react";

interface ResultSummaryProps {
  subjects: Subject[];
  studentName: string;
  semester: string;
}

const ResultSummary = ({ subjects, studentName, semester }: ResultSummaryProps) => {
  // Calculate GPA
  const calculateGPA = (subjects: Subject[]): number => {
    const gradePoints: Record<string, number> = {
      "A": 4.0,
      "B": 3.0,
      "C": 2.0,
      "D": 1.0,
      "F": 0.0,
    };

    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const weightedSum = subjects.reduce(
      (sum, subject) => sum + gradePoints[subject.grade] * subject.credits,
      0
    );

    return totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0;
  };

  // Calculate total credits
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  
  // Calculate average score
  const averageScore = subjects.length > 0
    ? parseFloat((subjects.reduce((sum, subject) => sum + subject.score, 0) / subjects.length).toFixed(1))
    : 0;

  const gpa = calculateGPA(subjects);

  return (
    <GlassCard className="mb-6" variant="elevated">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-primary uppercase tracking-wide">Result Summary</span>
          <h2 className="text-2xl font-bold mt-1">{studentName}</h2>
          <div className="flex items-center mt-2 text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{semester}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">GPA</p>
              <p className="font-semibold">{gpa.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="font-semibold">{averageScore}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Credits</p>
              <p className="font-semibold">{totalCredits}</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ResultSummary;
