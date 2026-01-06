
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está instalada
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone;

    if (isStandalone) return;

    // 2. Detectar si es dispositivo móvil o tablet
    const mobileCheck = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    setIsMobile(mobileCheck);

    // 3. Capturar el evento nativo de instalación
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Mostrar inmediatamente si el evento se dispara
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. FORZAR la aparición del banner en móviles/tablets aunque el evento no se dispare aún
    const timer = setTimeout(() => {
      if (mobileCheck && !isStandalone) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Instalación nativa de un solo clic
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Si el navegador aún no ha disparado el evento, le pedimos que intente "instalar"
      // Nota: No podemos forzar el diálogo nativo sin el evento, 
      // pero mostrar el banner permite que el usuario sepa que la app existe.
      console.log("Esperando a que el navegador esté listo para instalar...");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] animate-in slide-in-from-top-full duration-700 pointer-events-none">
      <div className="bg-[#1a2f23] text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group pointer-events-auto">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Bosque App</h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
              {deferredPrompt ? 'Instalar ahora' : 'Preparando instalación...'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              disabled={!deferredPrompt}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg whitespace-nowrap ${
                deferredPrompt 
                  ? 'bg-white text-[#1a2f23] hover:scale-105 active:scale-95' 
                  : 'bg-white/10 text-white/30 cursor-wait'
              }`}
            >
              {deferredPrompt ? 'Instalar' : '...'}
            </button>

            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-white/30 hover:text-white transition-colors"
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
