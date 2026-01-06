
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 1. Revisar si ya está en modo App (Standalone)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Función para guardar el prompt
    const handlePrompt = (e: any) => {
      e.preventDefault();
      console.log("PWA install prompt capturado en componente");
      setInstallPrompt(e);
      (window as any).deferredPrompt = e;
      setIsVisible(true);
    };

    // 3. Revisar si ya existe el evento global (capturado en index.html)
    if ((window as any).deferredPrompt) {
      handlePrompt((window as any).deferredPrompt);
    }

    // 4. Escuchar evento
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('pwa-prompt-ready', () => {
       if ((window as any).deferredPrompt) handlePrompt((window as any).deferredPrompt);
    });

    // 5. Fallback: Mostrar banner siempre después de un momento
    // Si no tenemos el prompt, mostraremos instrucciones manuales al hacer clic.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptToUse = installPrompt || (window as any).deferredPrompt;

    if (promptToUse) {
      // Intento Automático
      promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setInstallPrompt(null);
        (window as any).deferredPrompt = null;
      }
    } else {
      // Fallback Manual (Si el navegador no dio el prompt)
      setShowInstructions(true);
      // Ocultar instrucciones después de un tiempo si no interactúan
      setTimeout(() => setShowInstructions(false), 8000);
    }
  };

  if (!isVisible) return null;

  return (
    <>
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

      {/* Modal de Instrucciones Manuales (Solo si falla el automático) */}
      {showInstructions && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 animate-in fade-in duration-300" onClick={() => setShowInstructions(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <h3 className="font-black text-lg text-[#1a2f23]">Instalación Manual</h3>
                <p className="text-stone-500 text-sm mt-1">Tu navegador bloqueó la instalación automática. Sigue estos pasos:</p>
              </div>
            </div>

            <ol className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm font-medium text-stone-700">
                <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-black text-xs">1</span>
                <span>Toca el menú del navegador ({isIOS ? 'Compartir' : '3 puntos'})</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-stone-700">
                <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-black text-xs">2</span>
                <span>Selecciona <span className="font-bold text-[#1a2f23]">"{isIOS ? 'Agregar a Inicio' : 'Instalar aplicación'}"</span></span>
              </li>
            </ol>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 bg-[#1a2f23] text-white rounded-xl font-bold uppercase text-xs tracking-widest"
            >
              Entendido
            </button>
            
            {/* Flecha indicadora flotante (animación) */}
            <div className={`fixed ${isIOS ? 'bottom-4 left-1/2 -translate-x-1/2' : 'top-2 right-2'} pointer-events-none`}>
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
               </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
