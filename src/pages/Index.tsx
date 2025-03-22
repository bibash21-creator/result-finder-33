
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import GlassCard from "@/components/ui/glass-card";
import { ChevronRight } from "lucide-react";

const Index = () => {
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
      
      <main className="container mx-auto px-4 pt-16 pb-24 flex flex-col items-center">
        <section className="max-w-4xl w-full text-center space-y-6 mt-12 animate-slide-up">
          <div className="space-y-2">
            <span className="inline-block text-sm font-medium text-primary px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm">
             BIT Student Results Portal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight md:px-8">
              Access Your BIT Semesters Results with Ease
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
              A convinent way to view your academic performance. Log in or sign up to see your results.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate("/login")}
              className="px-6 py-6 text-md rounded-xl transition-all duration-300 flex items-center gap-2 hover:gap-3"
              size="lg"
            >
              <span>View your results</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="px-6 py-6 text-md rounded-xl transition-all duration-300"
              size="lg"
            >
              Sign up
            </Button>
          </div>
        </section>
        
        <section className="max-w-5xl w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Simple Access" 
            description="Log in with your student ID to instantly view your academic results."
            icon={<KeyIcon />}
          />
          <FeatureCard 
            title="Performance Insights" 
            description="Get a clear overview of your grades, credits, and academic progress."
            icon={<ChartIcon />}
          />
          <FeatureCard 
            title="Secure & Private" 
            description="Your academic information is kept secure and accessible only to you."
            icon={<ShieldIcon />}
          />
        </section>
      </main>
      
      <footer className="border-t backdrop-blur-sm bg-background/40 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 ResultsHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => (
  <GlassCard className="p-6 animate-blur-in" variant="bordered">
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="p-2 bg-primary/10 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </GlassCard>
);

// Icons
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default Index;
