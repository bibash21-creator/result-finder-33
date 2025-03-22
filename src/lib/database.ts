import { Student, Subject } from "./data";

// Database key for storing all students
const DB_STUDENTS_KEY = "students_database";
const DB_RESULTS_PUBLISHED_KEY = "results_published";

// Initialize the database with data from data.ts if it doesn't exist yet
export const initializeDatabase = (): void => {
  // Check if database already exists
  const existingData = localStorage.getItem(DB_STUDENTS_KEY);
  
  if (!existingData) {
    // Import all students from data.ts
    import("./data").then(({ students }) => {
      // Store the students in localStorage
      localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
      console.log("Database initialized with initial data");
    });
  }
  
  // Set results as not published by default if not set
  if (localStorage.getItem(DB_RESULTS_PUBLISHED_KEY) === null) {
    localStorage.setItem(DB_RESULTS_PUBLISHED_KEY, JSON.stringify(false));
  }
};

// Get all students
export const getAllStudents = (): Student[] => {
  const data = localStorage.getItem(DB_STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

// Get student by credentials (for login)
export const getStudentByCredentials = (
  studentId: string,
  password: string
): Student | undefined => {
  const students = getAllStudents();
  return students.find(
    (student) => student.id === studentId && student.password === password
  );
};

// Get student by ID
export const getStudentById = (studentId: string): Student | undefined => {
  const students = getAllStudents();
  return students.find((student) => student.id === studentId);
};

// Add new student - fixed to return Student directly instead of Promise<Student>
export const addNewStudent = (newStudent: {
  id: string;
  name: string;
  password: string;
}): Student => {
  const students = getAllStudents();
  
  // Check if student ID already exists
  if (students.some((student) => student.id === newStudent.id)) {
    throw new Error("Student ID already exists");
  }
  
  // Create the new student with empty subjects array
  const student: Student = {
    id: newStudent.id,
    name: newStudent.name,
    password: newStudent.password,
    semester: "Fall 2023",
    subjects: [], // Initialize with empty subjects array
    resultImage: null, // Initialize with no image
  };
  
  // Add to students array
  students.push(student);
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  
  return student;
};

// Update student results
export const updateStudentResults = (
  studentId: string,
  subjects: Subject[]
): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  students[studentIndex].subjects = subjects;
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  return true;
};

// Check if results are published
export const areResultsPublished = (): boolean => {
  const published = localStorage.getItem(DB_RESULTS_PUBLISHED_KEY);
  return published ? JSON.parse(published) : false;
};

// Publish or unpublish results
export const setResultsPublished = (published: boolean): void => {
  localStorage.setItem(DB_RESULTS_PUBLISHED_KEY, JSON.stringify(published));
};

// Admin functionality - get student results
export const getStudentsForAdmin = (): Student[] => {
  return getAllStudents();
};

// NEW FUNCTION: Update student credentials
export const updateStudentCredentials = (
  studentId: string,
  updatedData: {
    name?: string;
    password?: string;
    id?: string;
  }
): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  // Update the student data
  if (updatedData.name) {
    students[studentIndex].name = updatedData.name;
  }
  
  if (updatedData.password) {
    students[studentIndex].password = updatedData.password;
  }
  
  // If id is changing, ensure the new ID is unique
  if (updatedData.id && updatedData.id !== studentId) {
    // Check if the new ID already exists
    if (students.some(s => s.id === updatedData.id)) {
      return false; // ID already exists, can't update
    }
    students[studentIndex].id = updatedData.id;
  }
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  return true;
};

// NEW FUNCTION: Delete student
export const deleteStudent = (studentId: string): boolean => {
  const students = getAllStudents();
  const newStudents = students.filter(s => s.id !== studentId);
  
  // Check if a student was removed
  if (newStudents.length === students.length) {
    return false;
  }
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(newStudents));
  return true;
};

// NEW FUNCTION: Update student subject details
export const updateStudentSubject = (
  studentId: string,
  subjectId: string,
  updatedSubject: {
    name?: string;
    code?: string;
    credits?: number;
    score?: number;
  }
): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  const subjectIndex = students[studentIndex].subjects.findIndex(
    (s) => s.id === subjectId
  );
  
  if (subjectIndex === -1) return false;
  
  // Update the subject properties
  if (updatedSubject.name) {
    students[studentIndex].subjects[subjectIndex].name = updatedSubject.name;
  }
  
  if (updatedSubject.code) {
    students[studentIndex].subjects[subjectIndex].code = updatedSubject.code;
  }
  
  if (updatedSubject.credits) {
    students[studentIndex].subjects[subjectIndex].credits = updatedSubject.credits;
  }
  
  if (updatedSubject.score !== undefined) {
    students[studentIndex].subjects[subjectIndex].score = updatedSubject.score;
    
    // Update the grade based on the new score
    import("./data").then(({ calculateGrade }) => {
      students[studentIndex].subjects[subjectIndex].grade = calculateGrade(updatedSubject.score as number);
      
      // Re-save to localStorage
      localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
    });
  }
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  return true;
};

// NEW FUNCTION: Get student subjects
export const getStudentSubjects = (studentId: string): Subject[] | null => {
  const student = getStudentById(studentId);
  return student ? student.subjects : null;
};

// NEW FUNCTION: Upload result image
export const uploadResultImage = (
  studentId: string,
  imageBase64: string
): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  // Update the result image
  students[studentIndex].resultImage = imageBase64;
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  return true;
};

// NEW FUNCTION: Remove result image
export const removeResultImage = (studentId: string): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  // Remove the result image
  students[studentIndex].resultImage = null;
  
  // Update localStorage
  localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  return true;
};

// NEW FUNCTION: Add new subject to student
export const addSubjectToStudent = (
  studentId: string,
  newSubject: {
    name: string;
    code: string;
    credits: number;
    score: number;
  }
): boolean => {
  const students = getAllStudents();
  const studentIndex = students.findIndex((s) => s.id === studentId);
  
  if (studentIndex === -1) return false;
  
  import("./data").then(({ calculateGrade }) => {
    // Create the new subject with a unique ID
    const subjectId = `SUB${students[studentIndex].subjects.length}`;
    const subject: Subject = {
      id: subjectId,
      name: newSubject.name,
      code: newSubject.code,
      credits: newSubject.credits,
      score: newSubject.score,
      grade: calculateGrade(newSubject.score)
    };
    
    // Add the subject to the student's subjects array
    students[studentIndex].subjects.push(subject);
    
    // Update localStorage
    localStorage.setItem(DB_STUDENTS_KEY, JSON.stringify(students));
  });
  
  return true;
};
