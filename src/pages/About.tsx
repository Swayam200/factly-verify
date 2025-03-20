
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Mail, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MovingBackground from '@/components/MovingBackground';

const About = () => {
  return (
    <div className="container px-4 py-8 mx-auto relative z-10">
      <MovingBackground />
      <div className="max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">About Fact Check</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A tool to combat misinformation using AI technology
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p className="text-muted-foreground">
              Fact Check was designed to help users verify information in an era of widespread misinformation. 
              Using advanced AI models, this tool can analyze claims against known facts and provide relevant 
              sources to help users make informed decisions.
            </p>
            <p className="text-muted-foreground mt-4">
              Our mission is to make fact-checking accessible to everyone, helping to create a more 
              informed society where facts take precedence over falsehoods.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">AI-Powered Analysis</h3>
                <p className="mt-2 text-muted-foreground">
                  Our tool leverages state-of-the-art language models to compare claims against reliable 
                  information sources, identifying potential misinformation.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Source Verification</h3>
                <p className="mt-2 text-muted-foreground">
                  Every analysis includes citations to reputable sources, allowing users to verify information 
                  directly and make their own judgment.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">User Privacy</h3>
                <p className="mt-2 text-muted-foreground">
                  We take privacy seriously - all API keys are stored locally on your device and are never 
                  transmitted to our servers. All processing occurs directly through secure API calls.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">About the Developer</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">SP</span>
              </div>
              
              <div className="flex-1 space-y-3 text-center md:text-left">
                <h3 className="text-xl font-bold">Swayam Prakash Panda</h3>
                <p className="text-muted-foreground">
                  Computer Science and Engineering student at VIT Bhopal University, specializing in AI and Machine Learning. 
                  Passionate about using technology to solve real-world problems and combat misinformation.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail size={16} />
                    <a href="mailto:swayam.panda200@gmail.com" className="hover:text-primary">
                      swayam.panda200@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={16} />
                    <span>Daman and Diu, India</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <a 
                    href="https://github.com/Swayam200" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-card border rounded-full text-sm hover:bg-muted transition-colors"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Legal and Contact</h2>
            <p className="text-muted-foreground">
              This fact-checking service is provided for informational purposes only and does not constitute legal, 
              medical, financial, or professional advice. The information provided is based on AI-generated 
              responses which may contain inaccuracies or errors.
            </p>
            <p className="text-muted-foreground mt-4">
              Users are advised to verify critical information from official sources. By using this service, 
              you acknowledge that the operators assume no liability for any actions taken based on the information provided.
            </p>
            <p className="text-muted-foreground mt-4">
              For any inquiries, legal concerns, or grievances, please contact: 
              <a href="mailto:swayam.panda200@gmail.com" className="text-primary ml-1 hover:underline">
                swayam.panda200@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
