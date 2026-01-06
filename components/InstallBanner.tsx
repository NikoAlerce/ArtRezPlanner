
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está instalada
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Función para actualizar el estado según el prompt global
    const checkPrompt = () => {
      if ((window as any).deferredPrompt) {
        setPromptReady(true);
        setIsVisible(true);
      }
    };

    // 3. Suscribirse a eventos de prompt listo
    window.addEventListener('pwa-prompt-ready', checkPrompt);
    
    // Revisar si ya existe el prompt (capturado en index.html)
    checkPrompt();

    // 4. Forzar visibilidad en móviles tras un pequeño delay si no se ha detectado el prompt
    const timer = setTimeout(() => {
      const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
      if (isMobile && !isStandalone) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('pwa-prompt-ready', checkPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    
    if (deferredPrompt) {
      console.log('Disparando prompt de instalación...');
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Resultado de instalación: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsVisible(false);
        (window as any).deferredPrompt = null;
      }
    } else {
      // Si no hay prompt nativo, no podemos forzarlo, pero intentamos 
      // avisar al sistema a través de un log. En Android, esto a veces
      // ayuda a que el navegador muestre su propio banner de "Instalar".
      console.warn('El navegador aún no permite la instalación automática.');
      alert("Para instalar, busca 'Instalar aplicación' en el menú de tu navegador (los tres puntos arriba a la derecha).");
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
            <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Instalar App</h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
              Bosque de Gracias
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-white text-[#1a2f23] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap"
            >
              Instalar
            </button>

            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-white/30 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
