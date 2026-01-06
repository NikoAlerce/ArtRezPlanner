
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canInstallAuto, setCanInstallAuto] = useState(false);

  useEffect(() => {
    // 1. Detectar iOS (Donde NUNCA es automático por restricción de Apple)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 2. Verificar si ya está instalada la App
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      console.log("App ya instalada en modo standalone.");
      return;
    }

    // 3. Revisar si el evento de instalación ya ocurrió
    const checkPrompt = () => {
      if ((window as any).deferredPrompt) {
        console.log("✅ Prompt nativo detectado y listo para usar.");
        setCanInstallAuto(true);
      }
    };

    // Escuchamos el evento personalizado disparado desde index.html
    window.addEventListener('pwa-ready', checkPrompt);
    
    // Verificamos periódicamente por si el evento ocurrió muy rápido
    const interval = setInterval(checkPrompt, 1000);

    // 4. Mostrar el banner inicial
    const timer = setTimeout(() => setIsVisible(true), 2500);

    return () => {
      window.removeEventListener('pwa-ready', checkPrompt);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;

    if (promptEvent && !isIOS) {
      console.log('🚀 Disparando ventana de instalación automática...');
      promptEvent.prompt();
      
      const { outcome } = await promptEvent.userChoice;
      console.log(`Resultado de la instalación: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsVisible(false);
        (window as any).deferredPrompt = null;
        setCanInstallAuto(false);
      }
    } else {
      // Fallback a instrucciones (iOS o si el navegador aún no da el prompt)
      setShowInstructions(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed top-4 left-4 right-4 z-[200] animate-in slide-in-from-top-full duration-700 pointer-events-none">
        <div className="bg-[#1a2f23] text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden pointer-events-auto group">
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 transition-colors ${canInstallAuto ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="font-black text-sm uppercase tracking-tight">
                {canInstallAuto ? '¡Instalar Ahora!' : 'Descargar App'}
              </h3>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                {isIOS 
                  ? '⚠️ Manual en iPhone' 
                  : canInstallAuto 
                    ? <><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Listo para un clic</>
                    : '⏳ Preparando descarga...'}
              </p>
            </div>
            
            <button 
              onClick={handleInstallClick}
              className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all ${
                canInstallAuto 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400' 
                  : 'bg-white text-[#1a2f23] hover:bg-stone-100'
              }`}
            >
              {canInstallAuto ? 'INSTALAR' : 'VER CÓMO'}
            </button>

            <button onClick={() => setIsVisible(false)} className="p-1 text-white/20 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-md flex items-end justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowInstructions(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a2f23" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <h3 className="font-black text-xl text-[#1a2f23]">Guía de Instalación</h3>
              <p className="text-stone-500 text-xs font-bold mt-2 leading-relaxed">
                {isIOS 
                  ? 'Apple no permite la descarga automática. Debes seguir estos dos pasos:' 
                  : 'Tu navegador aún está verificando la seguridad. Puedes instalarla así:'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="w-8 h-8 rounded-full bg-[#1a2f23] text-white flex items-center justify-center font-black text-sm shadow-md">1</span>
                <p className="text-xs font-black text-stone-700">Toca el botón <span className="text-[#1a2f23] font-black">{isIOS ? 'Compartir (cuadrado con flecha)' : 'Opciones (3 puntos)'}</span>.</p>
              </div>
              <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="w-8 h-8 rounded-full bg-[#1a2f23] text-white flex items-center justify-center font-black text-sm shadow-md">2</span>
                <p className="text-xs font-black text-stone-700">Selecciona <span className="text-[#1a2f23] font-black underline underline-offset-4 decoration-2">"{isIOS ? 'Agregar a Inicio' : 'Instalar aplicación'}"</span>.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full py-4 bg-[#1a2f23] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
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
