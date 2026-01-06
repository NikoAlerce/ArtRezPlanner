
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canInstallAuto, setCanInstallAuto] = useState(false);

  useEffect(() => {
    // 1. Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 2. Verificar si ya es Standalone
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 3. Función para actualizar estado de instalabilidad
    const updateInstallState = () => {
      if ((window as any).deferredPrompt) {
        setCanInstallAuto(true);
      }
    };

    // Escuchar el evento personalizado de index.html
    window.addEventListener('pwa-can-install', updateInstallState);
    
    // Verificar si ya existe al montar
    updateInstallState();

    // 4. Mostrar banner después de un momento
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      window.removeEventListener('pwa-can-install', updateInstallState);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;

    if (promptEvent) {
      // PROMPT AUTOMÁTICO (Android / Desktop)
      console.log('Disparando instalación automática...');
      promptEvent.prompt();
      
      const { outcome } = await promptEvent.userChoice;
      console.log(`Resultado de la instalación: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsVisible(false);
        (window as any).deferredPrompt = null;
        setCanInstallAuto(false);
      }
    } else {
      // INSTRUCCIONES (iOS o si el navegador aún no disparó el evento)
      setShowInstructions(true);
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
              <h3 className="font-black text-lg leading-tight tracking-tight uppercase">
                {canInstallAuto ? 'Instalar App' : 'Descargar App'}
              </h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                {canInstallAuto ? 'Instalación Automática' : 'Guía de Instalación'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="bg-white text-[#1a2f23] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                {canInstallAuto ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Instalar
                  </>
                ) : 'Ver Cómo'}
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

      {showInstructions && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 animate-in fade-in duration-300" onClick={() => setShowInstructions(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[#2d4f3c] text-white rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                <h3 className="font-black text-lg text-[#1a2f23]">Pasos Finales</h3>
                <p className="text-stone-500 text-xs font-medium mt-1 leading-relaxed">
                  {isIOS ? 'Apple requiere un paso manual adicional:' : 'Tu navegador requiere este paso manual:'}
                </p>
              </div>
            </div>

            <ol className="space-y-3 mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700">
                <span className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs shadow-sm">1</span>
                <span>Toca el icono <span className="text-[#1a2f23]">{isIOS ? '"Compartir" (el cuadrado con flecha)' : '"Opciones" (los 3 puntos)'}</span></span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700">
                <span className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs shadow-sm">2</span>
                <span>Busca y toca <span className="text-[#1a2f23] underline decoration-2 underline-offset-2">"{isIOS ? 'Agregar a Inicio' : 'Instalar aplicación'}"</span></span>
              </li>
            </ol>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 bg-[#1a2f23] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#2d4f3c] transition-colors"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
