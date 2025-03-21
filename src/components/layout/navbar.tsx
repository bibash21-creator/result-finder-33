
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Student } from "@/lib/data";

const Navbar = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const storedStudent = localStorage.getItem("currentStudent");
    if (storedStudent) {
      setCurrentStudent(JSON.parse(storedStudent));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("currentStudent");
    setCurrentStudent(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="py-4 px-6 md:px-8 backdrop-blur-md bg-background/50 sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <GraduationIcon className="h-7 w-7 text-primary" />
            <span className="font-semibold text-lg">ResultsHub</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {currentStudent ? (
            <>
              <div className="hidden sm:flex items-center mr-2">
                <span className="text-sm font-medium">{currentStudent.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && location.pathname !== "/signup" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="transition-all duration-300"
                  >
                    Log in
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/signup")}
                    className="transition-all duration-300"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Graduation Icon component
const GraduationIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default Navbar;
