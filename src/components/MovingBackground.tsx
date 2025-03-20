
import React from 'react';

const MovingBackground: React.FC = () => {
  // Define the keyframes animation as a string
  const keyframesStyle = `
    @keyframes moveBg {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-25%, -25%); }
    }
  `;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <div 
        className="absolute inset-0 w-[200%] h-[200%]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          opacity: 0.2,
          animation: 'moveBg 60s linear infinite alternate'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Use a regular style tag instead of style jsx */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
    </div>
  );
};

export default MovingBackground;
