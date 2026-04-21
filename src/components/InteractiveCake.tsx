import React, { useState } from 'react';

interface InteractiveCakeProps {
  onCut: () => void;
}

export default function InteractiveCake({ onCut }: InteractiveCakeProps) {
  const [cut, setCut] = useState(false);

  const handleCut = () => {
    if (cut) return;
    setCut(true);
    
    // Play light slice sound effect if available (optional)
    try {
      const sx = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // soft swoosh
      sx.volume = 0.5;
      sx.play();
    } catch(e) {}

    // Slight delay before ending the scene
    setTimeout(() => {
      onCut();
    }, 1500);
  };

  // Add touch swipe detection
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (Math.abs(e.changedTouches[0].clientX - touchStartX) > 40) handleCut();
  };

  return (
    <div className="flex flex-col items-center gap-8 fade-up text-center">
      <h2 className="text-3xl font-display text-accent mb-8">Make a wish & cut the cake! ✨</h2>
      <p className="text-sm text-secondary mb-12">(Tap or swipe to cut)</p>
      
      <div 
        className={`cake-container ${cut ? 'cake-cut' : ''}`} 
        onClick={handleCut}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cake-base"></div>
        <div className="cake-slice"></div>
      </div>
    </div>
  );
}
