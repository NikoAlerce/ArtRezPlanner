
import React from 'react';

interface HeaderProps {
  activeTab: 'artistic' | 'production';
  setActiveTab: (tab: 'artistic' | 'production') => void;
  onExportImage: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExportImage, onReset }) => {
  return (
    <header className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1a2f23] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2 transition-transform hover:rotate-0 duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a2f23] tracking-tight">Bosque de Gracias</h1>
            <p className="text-stone-400 font-bold italic text-sm">Residencia Artística Patagonia</p>
          </div>
        </div>
        
        <div className="flex gap-2 print:hidden">
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reiniciar
          </button>
          <button 
            onClick={onExportImage}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all transform hover:scale-105 flex items-center gap-2 ${activeTab === 'artistic' ? 'bg-[#2d4f3c] hover:bg-[#1a2f23]' : 'bg-[#3a5a6b] hover:bg-[#253d4a]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar PNG
          </button>
        </div>
      </div>

      <nav className="flex justify-center md:justify-start">
        <div className="bg-stone-100/80 p-1 rounded-full flex gap-1 glass">
          <button
            onClick={() => setActiveTab('artistic')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'artistic' ? 'bg-white text-[#2d4f3c] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Artistas
          </button>
          <button
            onClick={() => setActiveTab('production')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'production' ? 'bg-white text-[#3a5a6b] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Producción
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
