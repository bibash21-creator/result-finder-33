
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import ResultCard from "@/components/results/result-card";
import ResultSummary from "@/components/results/result-summary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Student, Subject } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { areResultsPublished } from "@/lib/database";
import GlassCard from "@/components/ui/glass-card";

const Dashboard = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPublished, setResultsPublished] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedStudent = localStorage.getItem("currentStudent");
    if (!storedStudent) {
      navigate("/login");
      return;
    }

    // Check if results are published
    const published = areResultsPublished();
    setResultsPublished(published);

    // Simulate loading data
    const timer = setTimeout(() => {
      setCurrentStudent(JSON.parse(storedStudent));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Filter subjects based on search term
  const filteredSubjects = currentStudent?.subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("currentStudent");
    toast.success("Logged out successfully");
    navigate("/");
  };

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

  if (!resultsPublished) {
    return (
      <div className="min-h-screen gradient-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
          <GlassCard className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Results Not Published Yet</h2>
            <p className="text-muted-foreground mb-6">
              Your results have not been published yet. Please check back later.
            </p>
            <Button onClick={handleLogout}>Logout</Button>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {currentStudent && (
          <>
            <ResultSummary 
              subjects={currentStudent.subjects}
              studentName={currentStudent.name}
              semester={currentStudent.semester}
            />
            
            <Tabs defaultValue="all" className="w-full animate-scale-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <TabsList className="bg-secondary/80 backdrop-blur-sm">
                  <TabsTrigger value="all">All Subjects</TabsTrigger>
                  <TabsTrigger value="passed">Passed</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-[250px] bg-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubjects?.map((subject) => (
                    <ResultCard key={subject.id} subject={subject} />
                  ))}
                  
                  {filteredSubjects?.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No subjects found matching "{searchTerm}"</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="passed" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubjects
                    ?.filter(subject => subject.grade !== "F")
                    .map((subject) => (
                      <ResultCard key={subject.id} subject={subject} />
                    ))}
                  
                  {filteredSubjects?.filter(subject => subject.grade !== "F").length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm ? `No passed subjects found matching "${searchTerm}"` : "No passed subjects found"}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="link" 
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="failed" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubjects
                    ?.filter(subject => subject.grade === "F")
                    .map((subject) => (
                      <ResultCard key={subject.id} subject={subject} />
                    ))}
                  
                  {filteredSubjects?.filter(subject => subject.grade === "F").length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? `No failed subjects found matching "${searchTerm}"`
                          : "No failed subjects found - Great job!"
                        }
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="link" 
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
