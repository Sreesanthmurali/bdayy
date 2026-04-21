import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AppPayload } from '../App';
import InteractiveCake from './InteractiveCake';
import { Play } from 'lucide-react';

export default function ReceiverFlow({ payload }: { payload: AppPayload }) {
  const [scene, setScene] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Auto-advance scenes
  useEffect(() => {
    let timer: any;
    if (scene === 1) {
      // Intro
      timer = setTimeout(() => setScene(2), 3500);
    } else if (scene === 2) {
      // Quote
      timer = setTimeout(() => setScene(3), 4000);
    } else if (scene === 3) {
      // Photos
      if (payload.photos && payload.photos.length > 0) {
        if (photoIndex < payload.photos.length - 1) {
          timer = setTimeout(() => setPhotoIndex(p => p + 1), 3000);
        } else {
          timer = setTimeout(() => setScene(4), 3000);
        }
      } else {
        // No photos, skip
        setTimeout(() => setScene(4), 500);
      }
    } else if (scene === 6) {
      // Confetti
      fireConfetti();
    }
    return () => clearTimeout(timer);
  }, [scene, photoIndex, payload.photos]);

  const startExperience = () => {
    // Start Audio
    bgmRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/135/135-preview.mp3'); // Soft magical bgm
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;
    bgmRef.current.play().catch(e => console.log('Audio play blocked', e));
    setScene(1);
  };

  const handleEnvelopeOpen = () => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    try {
      const pop = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      pop.play();
    } catch(e) {}
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EAB308', '#D946EF', '#10B981', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EAB308', '#D946EF', '#10B981', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Scene 0: Start */}
      <div className={`scene ${scene === 0 ? 'active' : ''}`}>
        <button onClick={startExperience} className="btn-primary animate-pulse text-lg px-8 py-4 bg-accent">
          <Play size={24} fill="currentColor" /> Open Your Present
        </button>
      </div>

      {/* Scene 1: Intro */}
      <div className={`scene ${scene === 1 ? 'active fade-in' : ''}`}>
        <h1 className="text-3xl font-display text-center leading-relaxed">
          Hey {payload.recipientName},<br/><br/>
          <span className="text-xl text-secondary fade-up delay-1 inline-block">Someone made something for you 🎁</span>
        </h1>
      </div>

      {/* Scene 2: Quote */}
      <div className={`scene ${scene === 2 ? 'active' : ''}`}>
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-display italic leading-tight quote-underline">
            "{payload.quote}"
          </h2>
        </div>
      </div>

      {/* Scene 3: Memory Photos */}
      <div className={`scene ${scene === 3 ? 'active' : ''}`}>
        <h3 className="absolute top-10 text-xl font-display text-secondary tracking-widest uppercase">Memories with you</h3>
        {payload.photos.map((src, idx) => (
          <div key={idx} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${photoIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={src} className="memory-image shadow-lg" alt="Memory" />
          </div>
        ))}
      </div>

      {/* Scene 4: Envelope & Letter */}
      <div className={`scene ${scene === 4 ? 'active fade-in' : ''}`}>
        {!envelopeOpen && <p className="absolute top-20 text-secondary animate-pulse text-lg tracking-wide">Tap to open</p>}
        
        <div className="envelope-container" onClick={handleEnvelopeOpen}>
          <div className={`envelope ${envelopeOpen ? 'open' : ''}`}>
            <div className="envelope-flap"></div>
            <div className="envelope-body flex items-center justify-center">
              <span className="font-display tracking-widest opacity-50">FOR YOU</span>
            </div>
            
            <div className="letter">
              {envelopeOpen && (
                <div className="typewriter-text text-sm sm:text-base leading-relaxed text-slate-800" style={{ width: '100%', borderRight: 'none', animation: 'none' }}>
                  {/* Since pure CSS typing on multi-line text is buggy, we'll just use a fade-in for the text content inside the letter once open */}
                  <div className="fade-in" style={{animationDelay: '1s'}}>
                    <p className="whitespace-pre-wrap">{payload.letter}</p>
                    <p className="mt-4 font-bold text-accent">— {payload.from}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {envelopeOpen && (
          <button 
            onClick={() => setScene(5)} 
            className="btn-primary absolute bottom-10 fade-in" 
            style={{animationDelay: '2.5s'}}
          >
            There's more...
          </button>
        )}
      </div>

      {/* Scene 5: Interactive Cake */}
      <div className={`scene ${scene === 5 ? 'active fade-in' : ''}`}>
         <InteractiveCake onCut={() => setScene(6)} />
      </div>

      {/* Scene 6: Celebration Finale */}
      <div className={`scene ${scene === 6 ? 'active fade-in' : ''}`}>
        <div className="text-center z-20">
          <h1 className="text-5xl font-display text-accent mb-6 leading-tight drop-shadow-lg scale-110 fade-up">
            Happy Birthday,<br/>{payload.recipientName}!
          </h1>
          <p className="text-xl text-secondary fade-up delay-1">Hope you have a beautiful day. 🎉</p>
          
          <button 
            onClick={() => window.location.href = window.location.origin} 
            className="btn-primary mt-12 fade-in bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]! p-3"
            style={{animationDelay: '3s', background: 'transparent'}}
          >
            Create your own for someone
          </button>
        </div>
      </div>

    </div>
  );
}
