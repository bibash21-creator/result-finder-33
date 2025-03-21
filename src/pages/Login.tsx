
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import LoginForm from "@/components/auth/login-form";

const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedStudent = localStorage.getItem("currentStudent");
    if (storedStudent) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
