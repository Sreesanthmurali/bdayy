import { useEffect, useState } from 'react';
import BuilderFlow from './components/BuilderFlow';
import ReceiverFlow from './components/ReceiverFlow';

export interface AppPayload {
  theme: string;
  recipientType: string;
  recipientName: string;
  photos: string[];
  quote: string;
  letter: string;
  from: string;
  cakeStyle: string;
}

function App() {
  const [mode, setMode] = useState<'build' | 'view'>('build');
  const [payload, setPayload] = useState<AppPayload | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const dataParam = params.get('data');

    if (modeParam === 'view' && dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setPayload(decoded);
        setMode('view');
        // Apply theme immediately
        if (decoded.theme) {
          document.documentElement.setAttribute('data-theme', decoded.theme);
        }
      } catch (e) {
        console.error("Failed to decode payload", e);
        setMode('build');
      }
    } else {
      setMode('build');
      document.documentElement.setAttribute('data-theme', 'Night Sparkle'); // default
    }
  }, []);

  return (
    <>
      {mode === 'build' ? <BuilderFlow /> : (payload ? <ReceiverFlow payload={payload} /> : <BuilderFlow />)}
    </>
  );
}

export default App;
