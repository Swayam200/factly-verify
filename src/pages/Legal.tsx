
import React from 'react';
import { Link } from 'react-router-dom';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Legal = () => {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Legal Information</h1>
          <p className="text-muted-foreground">
            Terms, disclaimers, and policies for this fact-checking tool.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
            <p className="text-muted-foreground">
              This fact-checking tool is a student project created for educational and informational purposes only.
              By using this service, you acknowledge that the information provided is not professional advice
              and should be verified through official sources for important matters.
            </p>
            <p className="text-muted-foreground mt-4">
              This service is provided "as is" without any warranties, express or implied.
            </p>
          </div>
          
          <LegalDisclaimer className="bg-card rounded-lg p-6 shadow-sm" />
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <p className="text-muted-foreground">
              We respect your privacy and are committed to protecting it. We may store your search queries
              to improve this educational tool, but do not share this information with third parties
              except as required by law.
            </p>
            <p className="text-muted-foreground mt-4">
              This is a non-commercial student project that does not collect personal identifiable information
              beyond what is necessary for the service to function.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Student Project Disclaimer</h2>
            <p className="text-muted-foreground">
              This fact-checking tool was created by a student as an educational project and is not affiliated with
              any commercial organization or professional fact-checking service.
            </p>
            <p className="text-muted-foreground mt-4">
              For any questions or concerns about this project, please contact:
              <a href="mailto:swayam.panda200@gmail.com" className="text-primary hover:underline ml-1">swayam.panda200@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
