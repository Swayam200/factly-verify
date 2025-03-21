
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onResult: (text: string) => void;
  isDisabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, isDisabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setSupportsSpeech(false);
      console.log('Speech recognition not supported');
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      // Only send final results
      if (event.results[0].isFinal) {
        onResult(transcript);
        stopListening();
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast.error('Speech recognition error: ' + event.error);
      stopListening();
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        stopListening();
      }
    };
  }, [onResult]);
  
  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    } catch (err) {
      console.error('Error starting speech recognition', err);
      toast.error('Error starting speech recognition');
    }
  };
  
  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping speech recognition', err);
    }
  };
  
  if (!supportsSpeech) {
    return null; // Don't render if speech is not supported
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-background hover:bg-secondary/80 transition-colors"
      onClick={isListening ? stopListening : startListening}
      disabled={isDisabled}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isListening ? (
        <div className="relative">
          <MicOff size={18} className="text-red-500" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </div>
      ) : (
        <Mic size={18} />
      )}
    </Button>
  );
};

export default VoiceInput;
