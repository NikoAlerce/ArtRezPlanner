
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 2. Verificar si YA está instalada (Standalone)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    // Si ya es app, no mostrar nada
    if (isStandalone) return;

    // 3. Capturar evento nativo si ocurre
    const handlePrompt = (e: any) => {
      e.preventDefault();
      console.log("Evento de instalación capturado");
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    
    // Recuperar evento si ya ocurrió antes de montar este componente
    if ((window as any).deferredPrompt) {
      handlePrompt((window as any).deferredPrompt);
    }

    // 4. Mostrar banner SIEMPRE tras 1.5 segundos
    // No dependemos del evento técnico para mostrar la UI.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;

    if (promptEvent) {
      // Opción A: Tenemos el evento nativo, lo usamos.
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        (window as any).deferredPrompt = null;
      }
    } else {
      // Opción B: No tenemos evento (iOS o Chrome restringido), mostramos instrucciones.
      setShowInstructions(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner Principal */}
      <div className="fixed top-4 left-4 right-4 z-[200] animate-in slide-in-from-top-full duration-700 pointer-events-none">
        <div className="bg-[#1a2f23] text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group pointer-events-auto">
          {/* Fondo decorativo */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            {/* Icono */}
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
              </svg>
            </div>
            
            {/* Texto */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Instalar App</h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                Bosque de Gracias
              </p>
            </div>
            
            {/* Botones */}
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
                aria-label="Cerrar"
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

      {/* Modal de Instrucciones (Fallback) */}
      {showInstructions && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 animate-in fade-in duration-300" onClick={() => setShowInstructions(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[#2d4f3c] text-white rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                <h3 className="font-black text-lg text-[#1a2f23]">Instalación Manual</h3>
                <p className="text-stone-500 text-xs font-medium mt-1 leading-relaxed">
                  El navegador requiere permiso manual.
                </p>
              </div>
            </div>

            <ol className="space-y-3 mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700">
                <span className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs shadow-sm">1</span>
                <span>Toca el menú ({isIOS ? 'Compartir' : '3 puntos'})</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700">
                <span className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs shadow-sm">2</span>
                <span>Selecciona <span className="text-[#1a2f23] underline decoration-2 underline-offset-2">"{isIOS ? 'Agregar a Inicio' : 'Instalar aplicación'}"</span></span>
              </li>
            </ol>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 bg-[#1a2f23] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#2d4f3c] transition-colors"
            >
              Entendido
            </button>
            
            {/* Flecha indicadora */}
            <div className={`fixed ${isIOS ? 'bottom-4 left-1/2 -translate-x-1/2' : 'top-2 right-2'} pointer-events-none z-[220]`}>
               <span className="flex h-6 w-6 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 border-2 border-white"></span>
               </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
