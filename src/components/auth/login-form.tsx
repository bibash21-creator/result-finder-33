
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/glass-card";
import { getStudentByCredentials } from "@/lib/database";
import { ChevronRight } from "lucide-react";

const LoginForm = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      const student = getStudentByCredentials(studentId, password);
      
      if (student) {
        // Store student in localStorage for persistence
        localStorage.setItem("currentStudent", JSON.stringify(student));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid student ID or password");
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md animate-scale-in">
      <GlassCard className="w-full" variant="elevated">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tighter">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your results
            </p>
          </div>

          <div className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
              disabled={isLoading}
            >
              <span>{isLoading ? "Logging in..." : "Log in"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <a
                href="/signup"
                className="text-primary hover:underline transition-all duration-200"
              >
                Sign up
              </a>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default LoginForm;
