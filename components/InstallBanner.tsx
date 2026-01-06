
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está en modo instalada
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone;

    if (isStandalone) return;

    // 2. Detectar iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) && !(window as any).MSStream;
    setIsIOS(ios);

    // 3. Capturar el evento de instalación (Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Mostrar inmediatamente cuando el navegador esté listo
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Forzar visibilidad en móviles tras un breve retraso si no se disparó el evento
    // para asegurar que el usuario vea la opción, especialmente en iOS.
    const timer = setTimeout(() => {
      const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
      if (isMobile && !isVisible) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [isVisible]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Disparo del prompt nativo (un solo clic para instalar)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // En iOS no existe API de un clic, se mantiene la instrucción visual
      return;
    } else {
      // Fallback si el evento se perdió pero estamos en Android/Chrome
      alert('Para instalar: Toca el menú (⋮) y selecciona "Instalar aplicación"');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] animate-in slide-in-from-top-full duration-700 pointer-events-none">
      <div className="bg-[#1a2f23] text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group pointer-events-auto">
        {/* Decoración de fondo */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Instalar App</h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 truncate">
              {isIOS ? 'Toca compartir > Inicio' : 'Acceso directo en tu pantalla'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isIOS ? (
              <button 
                onClick={handleInstallClick}
                className="bg-white text-[#1a2f23] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap"
              >
                Instalar
              </button>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl border border-white/10 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
            )}

            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-white/30 hover:text-white transition-colors ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
