
import React from 'react';

const MovingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <div 
        className="absolute inset-0 w-[120%] h-[120%] bg-cover bg-center blur-sm opacity-20 animate-slow-pan"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b)',
          animation: 'moveBg 60s linear infinite alternate'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
};

export default MovingBackground;
