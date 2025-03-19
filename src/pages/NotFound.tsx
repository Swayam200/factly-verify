
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold animate-fade-in">404</h1>
        
        <div className="space-y-2">
          <p className="text-xl text-foreground animate-slide-in">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground animate-slide-in">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link to="/" className="inline-block animate-slide-in">
          <Button className="gap-2">
            <Home size={16} />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
