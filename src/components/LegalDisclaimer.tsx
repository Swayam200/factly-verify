
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
            This fact-checking service is a student project provided for educational and informational purposes only. It does not constitute legal, medical, financial, or professional advice. The information provided is based on AI-generated responses which may contain inaccuracies or errors.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            In accordance with Indian laws including the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, users are strongly advised to verify all information from official and reliable sources before making any decisions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            By using this service, you acknowledge that: (1) this is a student project created for educational purposes, (2) the creator assumes no liability for any actions taken based on the information provided, and (3) you will independently verify any information that is critical to your decisions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            For any concerns or inquiries about this student project, please contact: <a href="mailto:swayam.panda200@gmail.com" className="text-primary hover:underline">swayam.panda200@gmail.com</a>
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDisclaimer;
