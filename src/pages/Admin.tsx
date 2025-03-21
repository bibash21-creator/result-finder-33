
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
  getStudentsForAdmin, 
  setResultsPublished, 
  areResultsPublished 
} from "@/lib/database";
import { Student } from "@/lib/data";

const Admin = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPublished, setResultsPublishedState] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const ADMIN_PASSWORD = "admin123"; // In a real app, this would be stored securely
  
  useEffect(() => {
    if (isAuthenticated) {
      // Load students and check if results are published
      setStudents(getStudentsForAdmin());
      setResultsPublishedState(areResultsPublished());
      setLoading(false);
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
    // Toggle published state
    const newState = !resultsPublished;
    setResultsPublished(newState);
    setResultsPublishedState(newState);
    
    if (newState) {
      toast.success("Results have been published and are now visible to students");
    } else {
      toast.info("Results are now hidden from students");
    }
  };
  
  // Filter students based on search term
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
          <Table>
            <TableCaption>A list of all students and their results</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>GPA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                // Calculate average score
                const avgScore = student.subjects.reduce((sum, subj) => sum + subj.score, 0) / student.subjects.length;
                
                // Calculate GPA
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
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>{avgScore.toFixed(1)}%</TableCell>
                    <TableCell>{gpa}</TableCell>
                  </TableRow>
                );
              })}
              
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No students found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GlassCard>
      </main>
    </div>
  );
};

export default Admin;
