
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Revisar si ya está instalada
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Buscar evento global existente (capturado en index.html)
    if ((window as any).deferredPrompt) {
      setInstallPrompt((window as any).deferredPrompt);
      setIsVisible(true);
    }

    // 3. Escuchar evento si ocurre después
    const handlePrompt = (e: any) => {
      e.preventDefault(); // Prevenir banner nativo mini
      setInstallPrompt(e);
      (window as any).deferredPrompt = e; // Actualizar global por si acaso
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);

    // 4. Timer de respaldo para mostrar el banner (UX: mostrar botón siempre)
    // Pero solo si no se ha detectado ya
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    // Intentar obtener el prompt del estado local o del global (respaldo)
    const promptToUse = installPrompt || (window as any).deferredPrompt;

    if (promptToUse) {
      promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      // Limpiar
      setInstallPrompt(null);
      (window as any).deferredPrompt = null;
    } else {
      // Si llegamos aquí, el navegador no nos dio el evento.
      // Puede ser porque ya se intentó, o por políticas del navegador.
      // Intentamos un reload suave para ver si dispara el evento, 
      // o mostramos una ayuda visual muy sutil.
      console.log("Prompt de instalación no disponible aún.");
      alert("Instalación nativa no disponible en este momento. Intenta recargar o usa el menú del navegador.");
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
              className="bg-white text-[#1a2f23] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap cursor-pointer"
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
