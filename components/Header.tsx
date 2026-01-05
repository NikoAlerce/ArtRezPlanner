
import React from 'react';

interface HeaderProps {
  activeTab: 'artistic' | 'production';
  setActiveTab: (tab: 'artistic' | 'production') => void;
  onExportImage: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExportImage, onReset }) => {
  return (
    <header className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">ArtRes Planner</h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            {activeTab === 'artistic' ? 'Residencia Artística — Comidas y Actividades' : 'Equipo de Producción — Tareas y Responsables'}
          </p>
        </div>
        <div className="flex gap-2 print:hidden flex-wrap">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-all shadow-sm"
            title="Restablecer vista actual"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Restablecer
          </button>
          <button 
            onClick={onExportImage}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all shadow-md ${activeTab === 'artistic' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar PNG
          </button>
        </div>
      </div>

      <nav className="flex bg-gray-100 p-1 rounded-xl w-fit print:hidden">
        <button
          onClick={() => setActiveTab('artistic')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'artistic' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Residencia Artística
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'production' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Equipo Producción
        </button>
      </nav>
    </header>
  );
};

export default Header;
