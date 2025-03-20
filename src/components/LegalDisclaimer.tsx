
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from 'lucide-react';

interface LegalDisclaimerProps {
  className?: string;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ className }) => {
  return (
    <div className={className}>
      <Alert className="bg-muted/50 backdrop-blur-sm">
        <Info className="h-4 w-4" />
        <AlertTitle>Legal Disclaimer</AlertTitle>
        <AlertDescription>
          <p className="text-sm text-muted-foreground mt-2">
            This fact-checking service is provided for informational purposes only and does not constitute legal, medical, financial, or professional advice. The information provided is based on AI-generated responses which may contain inaccuracies or errors.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            In accordance with Indian laws including the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, users are advised to verify critical information from official sources.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            By using this service, you acknowledge that the operators assume no liability for any actions taken based on the information provided. For grievances or inquiries, please contact: <a href="mailto:swayam.panda200@gmail.com" className="text-primary hover:underline">swayam.panda200@gmail.com</a>
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDisclaimer;
