
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Mail, Twitter, MapPin, Phone, ExternalLink } from 'lucide-react';
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
          <h1 className="text-4xl font-bold mb-3">About Me</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aspiring Data & AI Professional | Problem Solver | Open-Source Contributor
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-foreground">SP</span>
              </div>
              
              <div className="flex-1 space-y-3 text-center md:text-left">
                <h2 className="text-2xl font-bold">Swayam Prakash Panda</h2>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail size={16} />
                    <a href="mailto:swayam.panda200@gmail.com" className="hover:text-primary">
                      swayam.panda200@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone size={16} />
                    <span>+91 9989654631</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={16} />
                    <span>Daman and Diu</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                  <a 
                    href="https://github.com/Swayam200" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-card border rounded-full text-sm hover:bg-muted transition-colors"
                  >
                    <Github size={14} />
                    <span>Swayam200</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">VIT Bhopal University</h3>
                <p className="text-sm text-muted-foreground">B.Tech Computer Science and Engineering (Specialisation in AIML) - 8.35</p>
                <p className="text-sm text-muted-foreground">2023 - 2027</p>
                <p className="mt-2">
                  Building expertise in AI, ML, and data science, applying predictive analytics and cryptographic techniques to solve real-world problems.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium">Leptospirosis Predictor</h3>
                  <span className="text-sm text-muted-foreground">Dec 2025 - Feb 2025</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Utilised machine learning to develop a predictive model for Leptospirosis disease diagnosis, enhancing diagnostic capabilities.</li>
                  <li>Developed and implemented a robust frontend framework utilising React, HTML, CSS, and JavaScript for structure, styling, and interactivity, while leveraging Python for machine learning model development.</li>
                  <li>Trained the model on a dataset incorporating medical and weather data to accurately forecast future leptospirosis rates.</li>
                </ul>
                <div className="mt-2">
                  <span className="text-sm font-medium">Tech Stack: </span>
                  <span className="text-sm text-muted-foreground">Python, Scikit-learn, Pandas, NumPy, React.js, JavaScript, HTML, CSS</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium">Goldfish Password Generator</h3>
                  <span className="text-sm text-muted-foreground">Oct 2024 - Jan 2024</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Designed and developed an True Random Number Generator (TRNG) utilising goldfish movements as an entropy source for secure password generation.</li>
                  <li>Utilised computer vision (OpenCV) to track fish motion, applied Euclidean distance metrics for randomness, and integrated SHA-256 hashing for cryptographic security, offering a low-cost, scalable alternative to traditional hardware-based TRNGs for cybersecurity applications.</li>
                </ul>
                <div className="mt-2">
                  <span className="text-sm font-medium">Tech Stack: </span>
                  <span className="text-sm text-muted-foreground">Python, OpenCV, NumPy, Cryptographic Hashing (SHA-256), Computer Vision</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-base font-medium mb-2">Programming Languages</h3>
                <p className="text-muted-foreground">Python, C++, SQL</p>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">Frameworks & Libraries</h3>
                <p className="text-muted-foreground">Pandas, NumPy, Matplotlib, Scikit-learn, OpenCV</p>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">Tools & Platforms</h3>
                <p className="text-muted-foreground">Git, VSCode, Tableau, MATLAB, Google Cloud Platform, Google Sheets</p>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">Database Management</h3>
                <p className="text-muted-foreground">MySQL, Google BigQuery</p>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">Domains</h3>
                <p className="text-muted-foreground">Machine Learning, Data Analysis, Predictive Modelling, Cryptography</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">About Fact Check</h2>
            <p className="text-muted-foreground">
              This fact-checking app was created to help combat misinformation by leveraging AI technology to analyze claims
              and provide accurate information. Using advanced language models, it can assess the validity of statements
              and provide relevant sources to help users make informed decisions.
            </p>
            <p className="text-muted-foreground mt-4">
              While our AI is powerful, we always recommend cross-referencing important information
              with multiple sources. No fact-checking system is perfect, but we strive to provide
              the most accurate and helpful information possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
