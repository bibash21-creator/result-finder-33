
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import GlassCard from "@/components/ui/glass-card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  getStudentsForAdmin, 
  setResultsPublished, 
  areResultsPublished,
  updateStudentCredentials,
  deleteStudent,
  updateStudentSubject,
  addSubjectToStudent
} from "@/lib/database";
import { Student, Subject } from "@/lib/data";
import { PenSquare, Image, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const Admin = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPublished, setResultsPublishedState] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editSemester, setEditSemester] = useState(""); // New state for semester
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectCode, setEditSubjectCode] = useState("");
  const [editSubjectCredits, setEditSubjectCredits] = useState<number>(0);
  const [editSubjectScore, setEditSubjectScore] = useState<number>(0);
  
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectCredits, setNewSubjectCredits] = useState<number>(3);
  const [newSubjectScore, setNewSubjectScore] = useState<number>(75);
  const [addingSubjectTo, setAddingSubjectTo] = useState<Student | null>(null);
  
  const ADMIN_PASSWORD = "admin123";
  
  const loadData = () => {
    const allStudents = getStudentsForAdmin();
    setStudents(allStudents);
    setResultsPublishedState(areResultsPublished());
    setLoading(false);
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Admin login successful");
    } else {
      toast.error("Invalid admin password");
    }
  };
  
  const handleTogglePublish = () => {
    const newState = !resultsPublished;
    setResultsPublished(newState);
    setResultsPublishedState(newState);
    
    if (newState) {
      toast.success("Results have been published and are now visible to students");
    } else {
      toast.info("Results are now hidden from students");
    }
  };
  
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditId(student.id);
    setEditPassword(student.password);
    setEditSemester(student.semester); // Set the current semester value
  };
  
  const handleSaveEdit = () => {
    if (!editingStudent) return;
    
    const success = updateStudentCredentials(editingStudent.id, {
      name: editName !== editingStudent.name ? editName : undefined,
      id: editId !== editingStudent.id ? editId : undefined,
      password: editPassword !== editingStudent.password ? editPassword : undefined,
      semester: editSemester !== editingStudent.semester ? editSemester : undefined, // Add semester to update
    });
    
    if (success) {
      toast.success("Student information updated successfully");
      setEditingStudent(null);
      loadData();
    } else {
      toast.error("Failed to update student. ID may already exist.");
    }
  };
  
  const handleDeleteStudent = (studentId: string) => {
    const success = deleteStudent(studentId);
    
    if (success) {
      toast.success("Student deleted successfully");
      loadData();
    } else {
      toast.error("Failed to delete student");
    }
  };
  
  const handleEditSubject = (student: Student, subject: Subject) => {
    setSelectedStudent(student);
    setSubjectToEdit(subject);
    setEditSubjectName(subject.name);
    setEditSubjectCode(subject.code);
    setEditSubjectCredits(subject.credits);
    setEditSubjectScore(subject.score);
  };
  
  const handleSaveSubject = () => {
    if (!selectedStudent || !subjectToEdit) return;
    
    const success = updateStudentSubject(
      selectedStudent.id,
      subjectToEdit.id,
      {
        name: editSubjectName !== subjectToEdit.name ? editSubjectName : undefined,
        code: editSubjectCode !== subjectToEdit.code ? editSubjectCode : undefined,
        credits: editSubjectCredits !== subjectToEdit.credits ? editSubjectCredits : undefined,
        score: editSubjectScore !== subjectToEdit.score ? editSubjectScore : undefined,
      }
    );
    
    if (success) {
      toast.success(`Subject ${editSubjectName} updated successfully`);
      setSelectedStudent(null);
      setSubjectToEdit(null);
      loadData();
    } else {
      toast.error("Failed to update subject information");
    }
  };
  
  const handleAddSubject = (student: Student) => {
    setAddingSubjectTo(student);
    setNewSubjectName("");
    setNewSubjectCode("");
    setNewSubjectCredits(3);
    setNewSubjectScore(75);
  };
  
  const handleSaveNewSubject = () => {
    if (!addingSubjectTo) return;
    
    if (!newSubjectName || !newSubjectCode) {
      toast.error("Subject name and code are required");
      return;
    }
    
    const success = addSubjectToStudent(
      addingSubjectTo.id,
      {
        name: newSubjectName,
        code: newSubjectCode,
        credits: newSubjectCredits,
        score: newSubjectScore
      }
    );
    
    if (success) {
      toast.success(`New subject ${newSubjectName} added successfully`);
      setAddingSubjectTo(null);
      loadData();
    } else {
      toast.error("Failed to add new subject");
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
          <GlassCard className="w-full max-w-md">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2 text-center mb-6">
                <h2 className="text-3xl font-bold tracking-tighter">Admin Access</h2>
                <p className="text-muted-foreground">
                  Enter admin password to manage student results
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
              >
                Login as Admin
              </Button>
            </form>
          </GlassCard>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded-md mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <GlassCard className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage student results and publication status</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="results-published" 
                checked={resultsPublished}
                onCheckedChange={handleTogglePublish}
              />
              <Label htmlFor="results-published">
                {resultsPublished ? "Results Published" : "Results Hidden"}
              </Label>
            </div>
          </div>
        </GlassCard>
        
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <GlassCard>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all students and their results</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const avgScore = student.subjects.length > 0 
                    ? student.subjects.reduce((sum, subj) => sum + subj.score, 0) / student.subjects.length
                    : 0;
                  
                  const gradePoints: Record<string, number> = {
                    "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0,
                  };
                  const totalCredits = student.subjects.reduce((sum, subj) => sum + subj.credits, 0);
                  const weightedSum = student.subjects.reduce(
                    (sum, subj) => sum + gradePoints[subj.grade] * subj.credits, 0
                  );
                  const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                          {student.password}
                        </span>
                      </TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>{avgScore.toFixed(1)}%</TableCell>
                      <TableCell>{gpa}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStudent(student)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Student Information</DialogTitle>
                                <DialogDescription>
                                  Make changes to the student's credentials.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editName">Student Name</Label>
                                  <Input
                                    id="editName"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editId">Student ID</Label>
                                  <Input
                                    id="editId"
                                    value={editId}
                                    onChange={(e) => setEditId(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editPassword">Password</Label>
                                  <Input
                                    id="editPassword"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editSemester">Semester</Label>
                                  <Input
                                    id="editSemester"
                                    value={editSemester}
                                    onChange={(e) => setEditSemester(e.target.value)}
                                    placeholder="e.g. Fall 2024"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleSaveEdit}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the student "{student.name}" with ID: {student.id}.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Subjects
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Manage Subjects for {student.name}</DialogTitle>
                                <DialogDescription>
                                  View and edit subject information for this student.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <div className="flex justify-end mb-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAddSubject(student)}
                                    className="flex items-center gap-1"
                                  >
                                    <Plus className="h-4 w-4" /> 
                                    Add Subject
                                  </Button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Subject Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Credits</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {student.subjects.length > 0 ? (
                                        student.subjects.map((subject) => (
                                          <TableRow key={subject.id}>
                                            <TableCell>{subject.name}</TableCell>
                                            <TableCell>{subject.code}</TableCell>
                                            <TableCell>{subject.credits}</TableCell>
                                            <TableCell>{subject.score}%</TableCell>
                                            <TableCell>{subject.grade}</TableCell>
                                            <TableCell className="text-right">
                                              <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleEditSubject(student, subject)}
                                              >
                                                <PenSquare className="h-4 w-4 mr-1" />
                                                Edit
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                            No subjects found. Add a subject to get started.
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Image className="h-4 w-4 mr-1" />
                                Result Image
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Result Image</DialogTitle>
                                <DialogDescription>
                                  Upload or update the result image for {student.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <ImageUploader 
                                  studentId={student.id}
                                  currentImage={student.resultImage}
                                  onImageUpdate={loadData}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
        
        {subjectToEdit && selectedStudent && (
          <Dialog open={!!subjectToEdit} onOpenChange={(open) => !open && setSubjectToEdit(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogDescription>
                  Make changes to {subjectToEdit.name} for {selectedStudent.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editSubjectName">Subject Name</Label>
                  <Input
                    id="editSubjectName"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSubjectCode">Subject Code</Label>
                  <Input
                    id="editSubjectCode"
                    value={editSubjectCode}
                    onChange={(e) => setEditSubjectCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSubjectCredits">Credits</Label>
                  <Input
                    id="editSubjectCredits"
                    type="number"
                    min="1"
                    max="6"
                    value={editSubjectCredits}
                    onChange={(e) => setEditSubjectCredits(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSubjectScore">Score (%)</Label>
                  <Input
                    id="editSubjectScore"
                    type="number"
                    min="0"
                    max="100"
                    value={editSubjectScore}
                    onChange={(e) => setEditSubjectScore(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveSubject}>
                  Save Subject Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {addingSubjectTo && (
          <Dialog 
            open={!!addingSubjectTo} 
            onOpenChange={(open) => !open && setAddingSubjectTo(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Add a new subject for {addingSubjectTo.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newSubjectName">Subject Name</Label>
                  <Input
                    id="newSubjectName"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSubjectCode">Subject Code</Label>
                  <Input
                    id="newSubjectCode"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    placeholder="e.g. MATH101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSubjectCredits">Credits</Label>
                  <Input
                    id="newSubjectCredits"
                    type="number"
                    min="1"
                    max="6"
                    value={newSubjectCredits}
                    onChange={(e) => setNewSubjectCredits(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSubjectScore">Score (%)</Label>
                  <Input
                    id="newSubjectScore"
                    type="number"
                    min="0"
                    max="100"
                    value={newSubjectScore}
                    onChange={(e) => setNewSubjectScore(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveNewSubject}>
                  Add Subject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Admin;
