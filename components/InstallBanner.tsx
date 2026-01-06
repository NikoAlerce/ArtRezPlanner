
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Detectar plataforma
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) return; // No mostrar si ya está instalada

    if (isIOS) {
      setPlatform('ios');
      // Mostrar después de un pequeño retraso para no agobiar
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      setPlatform('android');
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] animate-in slide-in-from-top-full duration-700">
      <div className="bg-[#1a2f23] text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden group">
        {/* Decoración de fondo */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5">
            🌲
          </div>
          <div className="flex-1">
            <h3 className="font-black text-lg leading-tight tracking-tight">INSTALAR LA APP</h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
              {platform === 'ios' 
                ? 'Toca compartir y "Añadir a inicio"' 
                : 'Lleva el bosque en tu bolsillo'}
            </p>
          </div>
          
          {platform === 'android' ? (
            <button 
              onClick={handleInstallClick}
              className="bg-white text-[#1a2f23] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Instalar
            </button>
          ) : platform === 'ios' ? (
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </div>
          ) : null}

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-1 -right-1 p-3 text-white/30 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
