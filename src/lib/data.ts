
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

// Initialize with dummy data for 33 students
const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 41) + 60; // Scores between 60-100
};

const calculateGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const subjects = [
  { name: "Mathematics", code: "MATH101" },
  { name: "English", code: "ENG101" },
  { name: "Physics", code: "PHY101" },
  { name: "Chemistry", code: "CHEM101" },
  { name: "Biology", code: "BIO101" },
  { name: "Computer Science", code: "CS101" },
  { name: "History", code: "HIST101" },
];

const names = [
  "Emma Thompson", "Liam Johnson", "Olivia Davis", "Noah Wilson", "Ava Martinez",
  "William Anderson", "Sophia Taylor", "James Thomas", "Isabella Brown", "Oliver White",
  "Charlotte Harris", "Benjamin Lewis", "Amelia King", "Lucas Scott", "Mia Green",
  "Henry Adams", "Harper Nelson", "Alexander Baker", "Evelyn Hill", "Daniel Rivera",
  "Abigail Campbell", "Matthew Mitchell", "Emily Rodriguez", "David Phillips", "Elizabeth Torres",
  "Joseph Parker", "Sofia Gray", "Michael Evans", "Camila Cooper", "Jackson Hughes",
  "Scarlett Flores", "Gabriel Morris", "Victoria Reed"
];

// Create students with random results
let students: Student[] = names.map((name, index) => {
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

// Function to get a student by credentials
export const getStudentByCredentials = (studentId: string, password: string): Student | undefined => {
  return students.find(student => student.id === studentId && student.password === password);
};

// Function to add a new student
export const addNewStudent = (newStudent: { id: string; name: string; password: string }): Student => {
  // Check if student ID already exists
  if (students.some(student => student.id === newStudent.id)) {
    throw new Error("Student ID already exists");
  }
  
  // Create new student with random subjects
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
  
  const student: Student = {
    id: newStudent.id,
    name: newStudent.name,
    password: newStudent.password,
    semester: "Fall 2023",
    subjects: studentSubjects
  };
  
  // Add to students array
  students.push(student);
  
  return student;
};

// Function to get a student by ID
export const getStudentById = (studentId: string): Student | undefined => {
  return students.find(student => student.id === studentId);
};
