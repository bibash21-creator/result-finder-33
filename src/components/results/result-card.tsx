
import React from "react";
import { Subject } from "@/lib/data";
import GlassCard from "@/components/ui/glass-card";

interface ResultCardProps {
  subject: Subject;
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A":
      return "text-green-600";
    case "B":
      return "text-blue-600";
    case "C":
      return "text-yellow-600";
    case "D":
      return "text-orange-600";
    case "F":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const ResultCard = ({ subject }: ResultCardProps) => {
  return (
    <GlassCard className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{subject.name}</h3>
          <p className="text-muted-foreground text-sm">{subject.code}</p>
        </div>
        <div className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>
          {subject.grade}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="font-medium">{subject.score}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${subject.score}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">Credits</span>
          <span className="font-medium">{subject.credits}</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default ResultCard;
