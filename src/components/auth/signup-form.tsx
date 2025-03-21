
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/glass-card";
import { addNewStudent, areResultsPublished } from "@/lib/database";
import { ChevronRight } from "lucide-react";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      try {
        const newStudent = addNewStudent({
          id: studentId,
          name: fullName,
          password,
        });
        
        // Check if results are published
        const resultsPublished = areResultsPublished();
        
        // Store student in localStorage for persistence
        localStorage.setItem("currentStudent", JSON.stringify(newStudent));
        
        if (!resultsPublished) {
          toast.success("Account created successfully! Results will be available when published.");
        } else {
          toast.success("Account created successfully!");
        }
        
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to create account");
        }
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md animate-scale-in">
      <GlassCard className="w-full" variant="elevated">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tighter">Create account</h2>
            <p className="text-muted-foreground">
              Sign up to access your academic results
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
              disabled={isLoading}
            >
              <span>{isLoading ? "Creating account..." : "Sign up"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <a
                href="/login"
                className="text-primary hover:underline transition-all duration-200"
              >
                Log in
              </a>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default SignupForm;
