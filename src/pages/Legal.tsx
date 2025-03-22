
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
            Terms, disclaimers, and legal policies for our fact-checking service.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
            <p className="text-muted-foreground">
              By using our fact-checking service, you agree to abide by these terms and conditions.
              The information provided is for general informational purposes only and should not be
              considered as professional advice.
            </p>
          </div>
          
          <LegalDisclaimer className="bg-card rounded-lg p-6 shadow-sm" />
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <p className="text-muted-foreground">
              We respect your privacy and are committed to protecting it. This Privacy Policy explains
              how we collect, use, and safeguard your information when you use our service.
            </p>
            <p className="text-muted-foreground mt-4">
              We store your search queries to improve our service but do not share this information
              with third parties except as required by law.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              For legal inquiries or concerns, please contact our grievance officer at:
              <a href="mailto:swayam.panda200@gmail.com" className="text-primary hover:underline ml-1">swayam.panda200@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
