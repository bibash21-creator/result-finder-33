
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  score: number;
  grade: string;
}

export interface Student {
  id: string;
  name: string;
  password: string;
  semester: string;
  subjects: Subject[];
}

// Generate a random score between 60-100
export const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 41) + 60; // Scores between 60-100
};

// Calculate grade based on score
export const calculateGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

// Subject definitions
export const subjects = [
  { name: "Mathematics", code: "MATH101" },
  { name: "English", code: "ENG101" },
  { name: "Physics", code: "PHY101" },
  { name: "Chemistry", code: "CHEM101" },
  { name: "Biology", code: "BIO101" },
  { name: "Computer Science", code: "CS101" },
  { name: "History", code: "HIST101" },
];

// Student names
export const names = [
  "Emma Thompson", "Liam Johnson", "Olivia Davis", "Noah Wilson", "Ava Martinez",
  "William Anderson", "Sophia Taylor", "James Thomas", "Isabella Brown", "Oliver White",
  "Charlotte Harris", "Benjamin Lewis", "Amelia King", "Lucas Scott", "Mia Green",
  "Henry Adams", "Harper Nelson", "Alexander Baker", "Evelyn Hill", "Daniel Rivera",
  "Abigail Campbell", "Matthew Mitchell", "Emily Rodriguez", "David Phillips", "Elizabeth Torres",
  "Joseph Parker", "Sofia Gray", "Michael Evans", "Camila Cooper", "Jackson Hughes",
  "Scarlett Flores", "Gabriel Morris", "Victoria Reed"
];

// Create students with random results
export const students: Student[] = names.map((name, index) => {
  const studentId = `STU${(10000 + index).toString()}`;
  
  // Generate random subjects for each student
  const studentSubjects: Subject[] = subjects.map((subject, subIndex) => {
    const score = generateRandomScore();
    return {
      id: `SUB${subIndex}`,
      name: subject.name,
      code: subject.code,
      credits: Math.floor(Math.random() * 2) + 2, // 2-3 credits
      score,
      grade: calculateGrade(score)
    };
  });
  
  return {
    id: studentId,
    name,
    password: "password", // Default password for demo
    semester: "Fall 2023",
    subjects: studentSubjects
  };
});

// Fix these functions to properly handle the Promise response
export const getStudentByCredentials = async (studentId: string, password: string): Promise<Student | undefined> => {
  const db = await import('./database');
  return db.getStudentByCredentials(studentId, password);
};

export const addNewStudent = async (newStudent: { id: string; name: string; password: string }): Promise<Student> => {
  const db = await import('./database');
  return db.addNewStudent(newStudent);
};

export const getStudentById = async (studentId: string): Promise<Student | undefined> => {
  const db = await import('./database');
  return db.getStudentById(studentId);
};
