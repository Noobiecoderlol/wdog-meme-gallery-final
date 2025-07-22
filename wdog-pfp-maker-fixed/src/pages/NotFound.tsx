import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-2 sm:p-4">
      <div className="text-center px-4">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-destructive animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
          Oops! This page doesn't exist
        </p>
        <Button
          size="lg"
          onClick={() => window.location.href = '/'}
          className="bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-300"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
