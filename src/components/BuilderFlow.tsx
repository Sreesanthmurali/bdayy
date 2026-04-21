import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { AppPayload } from '../App';

const THEMES = ['Night Sparkle', 'Pastel Party', 'Golden Glow', 'Nature Calm'];
const RECIPIENTS = ['Her 🎀', 'Him 🎯', 'Best friend 🤝', 'Partner ❤️', 'Sibling 🌟', 'Someone special ✨'];

const QUOTES = [
  "The world became more fun the day you arrived.",
  "I’m grateful the world got you the day you were born.",
  "Life has been better since you showed up in it.",
  "Today isn’t just your birthday. It’s a celebration of you.",
  "Another year of your life, another year of making the world brighter."
];

const LETTER_TEMPLATES = [
  "Birthdays come every year, but people like you don’t.\n\nYou make life lighter, warmer, and more meaningful.\n\nI hope this little surprise makes you smile today.",
  "I am so lucky to know you.\n\nMay this year bring you as much happiness as you give to everyone around you.",
  "Just wanted to remind you how amazing you are.\n\nKeep shining and never change. Happy Birthday!",
];

export default function BuilderFlow() {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<AppPayload>({
    theme: 'Night Sparkle',
    recipientType: 'Best friend 🤝',
    recipientName: '',
    photos: [],
    quote: QUOTES[0],
    letter: LETTER_TEMPLATES[0],
    from: '',
    cakeStyle: 'Silhouette Dark'
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => setStep(s => s + 1);

  const handleThemeChange = (newTheme: string) => {
    setPayload(p => ({ ...p, theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const cycleQuote = () => {
    const nextIdx = (quoteIndex + 1) % QUOTES.length;
    setQuoteIndex(nextIdx);
    setPayload(p => ({ ...p, quote: QUOTES[nextIdx] }));
  };

  const cycleLetter = () => {
    const nextIdx = (letterIndex + 1) % LETTER_TEMPLATES.length;
    setLetterIndex(nextIdx);
    setPayload(p => ({ ...p, letter: LETTER_TEMPLATES[nextIdx] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos = [...payload.photos];

    // Using a public anonymous ImgBB key for stateless image hosting
    const IMGBB_KEY = '5ef4df78229fb4ba9cb56ffde70fc0ef'; 

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('image', files[i]);
      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          newPhotos.push(data.data.url);
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image. Please try another.");
      }
    }
    setPayload(p => ({ ...p, photos: newPhotos }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateLink = () => {
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const url = `${window.location.origin}/?mode=view&data=${b64}`;
    setShareUrl(url);
    handleNext();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard! Send it to them before midnight 😉');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg flex-col gap-6 fade-in">
        
        {step === 1 && (
          <div className="flex-col gap-4 text-center">
            <h1 className="text-3xl mb-4">Who is this for?</h1>
            <input 
              type="text" 
              className="input-field mb-4 text-center" 
              placeholder="Their First Name" 
              value={payload.recipientName}
              onChange={e => setPayload({...payload, recipientName: e.target.value})}
            />
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {RECIPIENTS.map(r => (
                <button 
                  key={r}
                  onClick={() => setPayload({...payload, recipientType: r})}
                  className={`px-4 py-2 rounded-full border border-[rgba(255,255,255,0.2)] transition-all ${
                    payload.recipientType === r ? 'bg-accent text-white scale-105' : 'hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <h2 className="text-xl mb-4 font-sans text-secondary">Choose Vibe</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {THEMES.map(t => (
                <button 
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`px-4 py-2 rounded-full border border-[rgba(255,255,255,0.2)] transition-all ${
                    payload.theme === t ? 'bg-accent text-white scale-105' : 'hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button 
              disabled={!payload.recipientName.trim()} 
              onClick={handleNext} 
              className="btn-primary w-full disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-6">
            <h1 className="text-3xl text-center">Add Birthday Memories</h1>
            <p className="text-center text-secondary">Upload photos straight from your device.</p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]! text-primary!"
              style={{background: 'transparent'}}
              disabled={uploading}
            >
              <Camera size={20} /> {uploading ? 'Uploading...' : 'Upload Photos'}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {payload.photos.length > 0 && (
              <div className="photo-grid">
                {payload.photos.map((src, i) => (
                  <img key={i} src={src} className="photo-thumbnail fade-up" style={{animationDelay: `${i*0.1}s`}} alt="memory" />
                ))}
              </div>
            )}

            <button onClick={handleNext} className="btn-primary w-full mt-4">
              Next Step
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col gap-6">
            <h1 className="text-3xl text-center mb-2">Message & Letter</h1>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-secondary">Intro Quote</span>
                <button onClick={cycleQuote} className="text-accent flex items-center gap-1 text-sm"><RefreshCw size={14}/> Rotate</button>
              </div>
              <textarea 
                className="input-field" 
                value={payload.quote}
                onChange={e => setPayload({...payload, quote: e.target.value})}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-secondary">Birthday Letter</span>
                <button onClick={cycleLetter} className="text-accent flex items-center gap-1 text-sm"><RefreshCw size={14}/> Rotate</button>
              </div>
              <textarea 
                className="input-field" 
                value={payload.letter}
                onChange={e => setPayload({...payload, letter: e.target.value})}
                style={{minHeight: '180px'}}
              />
            </div>

            <div>
              <span className="text-sm text-secondary block mb-2">Who is it from?</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Your Name" 
                value={payload.from}
                onChange={e => setPayload({...payload, from: e.target.value})}
              />
            </div>

            <button disabled={!payload.from.trim()} onClick={generateLink} className="btn-primary w-full mt-4">
              <Sparkles size={20} /> Create Birthday Gift
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex-col gap-6 text-center">
            <h1 className="text-4xl text-accent mb-4 font-display">It's Ready! 🎁</h1>
            <p className="text-secondary mb-6">Your unique birthday surprise is wrapped and ready to be sent.</p>
            
            <div className="flex flex-col gap-3">
              <button onClick={copyLink} className="btn-primary w-full bg-accent">
                <Copy size={20} /> Copy Magic Link
              </button>
              
              <a href={shareUrl} target="_blank" rel="noreferrer" className="btn-primary w-full bg-transparent border border-white/20 hover:bg-white/5">
                <ExternalLink size={20} /> Preview Gift
              </a>
            </div>
            
            <p className="text-xs text-secondary mt-8">Works best when opened on a mobile device or full screen. Turn on sound!</p>
          </div>
        )}

      </div>
    </div>
  );
}
