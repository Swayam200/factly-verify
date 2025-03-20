
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Mail, Twitter } from 'lucide-react';

const About = () => {
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
          <h1 className="text-4xl font-bold mb-3">About Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our mission is to promote truth and combat misinformation through AI-powered fact-checking.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              In today's digital age, misinformation spreads faster than ever before. Our fact-checking
              service leverages cutting-edge AI technology to help users quickly verify claims and
              access reliable information. We believe that access to accurate information is essential
              for making informed decisions in both personal and public life.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Our service uses advanced language models from leading AI providers to analyze claims
              against a vast database of reliable sources. When you submit a claim, our AI evaluates
              its accuracy, looks for supporting or contradicting evidence, and provides you with a
              verdict along with relevant source information.
            </p>
            <p className="text-muted-foreground mt-4">
              While our AI is powerful, we always recommend cross-referencing important information
              with multiple sources. No fact-checking system is perfect, but we strive to provide
              the most accurate and helpful information possible.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">The Team</h2>
            <div className="text-center">
              <div className="inline-block bg-muted rounded-full p-1 mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-foreground">AB</span>
                </div>
              </div>
              <h3 className="text-xl font-medium">Your Name</h3>
              <p className="text-muted-foreground mb-4">Founder & Developer</p>
              <p className="text-muted-foreground max-w-lg mx-auto">
                You can add your personal description here. Share your background, interests, 
                and why you created this fact-checking service.
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
