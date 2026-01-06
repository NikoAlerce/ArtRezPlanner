
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import EditModal from './components/EditModal';
import EditProductionModal from './components/EditProductionModal';
import Login from './components/Login';
import ProductionDashboard from './components/ProductionDashboard';
import InstallBanner from './components/InstallBanner';
import { INITIAL_DATA, INITIAL_PRODUCTION_DATA } from './constants';
import { WeeklySchedule, DayData, ProductionSchedule, DayProduction, Producer } from './types';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'artistic' | 'production'>('artistic');
  const [currentUser, setCurrentUser] = useState<Producer | null>(() => {
    return (localStorage.getItem('artres_user') as Producer) || null;
  });
  
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('artres_schedule');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [production, setProduction] = useState<ProductionSchedule>(() => {
    const saved = localStorage.getItem('artres_production');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_DATA;
  });

  const [editingDay, setEditingDay] = useState<DayData | null>(null);
  const [editingProdDay, setEditingProdDay] = useState<DayProduction | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem('artres_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('artres_production', JSON.stringify(production));
  }, [production]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('artres_user', currentUser);
    } else {
      localStorage.removeItem('artres_user');
    }
  }, [currentUser]);

  const handleUpdateDay = (updatedDay: DayData) => {
    setSchedule((prev) => ({ ...prev, [updatedDay.id]: updatedDay }));
    setEditingDay(null);
  };

  const handleUpdateProdDay = (updatedDay: DayProduction) => {
    setProduction((prev) => ({ ...prev, [updatedDay.id]: updatedDay }));
    setEditingProdDay(null);
  };

  const handleToggleTask = (dayId: string, segment: string) => {
    setProduction(prev => {
      const day = prev[dayId];
      if (!day) return prev;
      const task = (day as any)[segment];
      return {
        ...prev,
        [dayId]: { ...day, [segment]: { ...task, completed: !task.completed } }
      };
    });
  };

  const handleReset = () => {
    if (confirm('¿Restablecer organigrama?')) {
      if (activeTab === 'artistic') setSchedule(INITIAL_DATA);
      else setProduction(INITIAL_PRODUCTION_DATA);
    }
  };

  const handleExportImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    try {
      // Breve espera para que los estilos de exportación se apliquen al DOM
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const element = exportRef.current;
      
      // Captura en formato apaisado (2000px de ancho)
      const dataUrl = await toPng(element, {
        backgroundColor: '#fdfaf6',
        style: {
          padding: '50px',
          width: '2000px', // Forzamos ancho cinematográfico/apaisado
          height: 'auto',
          transform: 'none',
          overflow: 'visible'
        },
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `bosque-gracias-${activeTab}-${new Date().toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error exportando la imagen. Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const daysOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  const getAssigneeColor = (name: Producer) => {
    switch(name) {
      case 'Rocío': return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'Nicolás': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Mariano': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-stone-50 text-stone-400 border-stone-100';
    }
  };

  if (activeTab === 'production' && !currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto overflow-x-hidden selection:bg-[#2d4f3c11] relative">
      <InstallBanner />
      
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExportImage={handleExportImage} 
        onReset={handleReset} 
      />

      <main className="relative mt-4 z-10">
        <div ref={exportRef} className={`pb-10 ${isExporting ? 'w-[1900px]' : ''}`}>
          {activeTab === 'artistic' ? (
            <div className={`grid gap-6 ${isExporting ? 'grid-cols-7' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {daysOrder.map((dayId) => {
                const day = schedule[dayId];
                if (!day) return null;
                return (
                  <div key={dayId} className="bg-white/70 backdrop-blur-sm rounded-[2rem] border border-stone-200/40 shadow-sm flex flex-col group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 bg-gradient-to-br from-stone-50 to-white border-b border-stone-100 flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h3 className="text-[10px] font-black text-[#2d4f3c] uppercase tracking-[0.3em]">{day.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-serif font-black text-[#1a2f23] tracking-tighter">{day.date}</span>
                          <span className="text-stone-300 font-serif italic text-sm">Ene</span>
                        </div>
                      </div>
                      <button onClick={() => setEditingDay(day)} className="p-2 rounded-xl text-stone-300 hover:text-[#2d4f3c] hover:bg-white transition-all opacity-0 group-hover:opacity-100 print:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-6 flex-grow relative">
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-orange-600/60">Almuerzo</span>
                        </div>
                        <p className={`text-[#1a2f23] font-serif italic leading-snug ${isExporting ? 'text-sm' : 'text-base'}`}>{day.lunch || "..."}</p>
                      </div>
                      
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">Cena</span>
                        </div>
                        <p className={`text-[#1a2f23] font-serif italic leading-snug ${isExporting ? 'text-sm' : 'text-base'}`}>{day.dinner || "..."}</p>
                      </div>
                    </div>

                    <div className="bg-[#1a2f23] p-6 text-white space-y-4">
                      <div className="space-y-0.5 relative z-10">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Mañana</span>
                        <p className="font-bold text-sm leading-tight text-stone-200">{day.morningActivities || "Espacio"}</p>
                      </div>
                      <div className="space-y-0.5 relative z-10">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Tarde</span>
                        <p className="font-bold text-sm leading-tight text-stone-200">{day.afternoonActivities || "Conexión"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-10">
              {/* No mostramos el dashboard en la exportación para que el mapa de labor sea el protagonista */}
              {!isExporting && (
                <ProductionDashboard 
                  user={currentUser!} 
                  production={production} 
                  onToggleTask={handleToggleTask} 
                  onLogout={() => setCurrentUser(null)} 
                />
              )}
              
              {/* Mapa de Labor (Vista completa para exportación) */}
              <section className={`glass rounded-[2.5rem] p-8 md:p-12 border border-white/50 shadow-xl overflow-hidden ${isExporting ? 'border-none shadow-none bg-white' : ''}`}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-[#1a2f23]">Mapa de Labor Semanal</h2>
                    <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] mt-1">Cuidado Colectivo del Bosque de Gracias</p>
                  </div>
                  <div className="flex gap-4">
                    {['Rocío', 'Nicolás', 'Mariano'].map(p => (
                      <div key={p} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getAssigneeColor(p as Producer)} border`}></div>
                        <span className="text-[10px] font-black text-[#1a2f23]">{p === 'Nicolás' ? 'Alerce' : p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${isExporting ? '' : 'overflow-x-auto custom-scrollbar'}`}>
                  <table className="w-full border-separate border-spacing-2">
                    <thead>
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400 text-left">Día</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Mañana</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Almuerzo</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Tarde</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Cena</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Noche</th>
                        {!isExporting && <th className="p-4 print:hidden"></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {daysOrder.filter(d => production[d]).map(dayId => {
                        const day = production[dayId];
                        const cells = [day.morning, day.lunchCook, day.afternoon, day.dinnerCook, day.night];
                        return (
                          <tr key={dayId} className="group">
                            <td className="p-4 bg-stone-50 rounded-2xl">
                              <span className="text-[10px] font-black uppercase text-[#2d4f3c] block">{day.name}</span>
                              <span className="text-2xl font-serif font-black text-[#1a2f23]">{day.date}</span>
                            </td>
                            {cells.map((task, idx) => (
                              <td key={idx} className={`p-4 rounded-2xl border transition-all ${task.completed ? 'bg-stone-50/50 opacity-40' : 'bg-white shadow-sm border-stone-100'}`}>
                                <div className="space-y-2">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${getAssigneeColor(task.assignee)}`}>
                                    {task.assignee === 'Nicolás' ? 'Alerce' : task.assignee}
                                  </span>
                                  <p className={`font-bold leading-tight text-[#1a2f23] ${isExporting ? 'text-[9px]' : 'text-[11px]'}`}>{task.description}</p>
                                </div>
                              </td>
                            ))}
                            {!isExporting && (
                              <td className="p-4 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingProdDay(day)} className="p-2 text-stone-300 hover:text-[#3a5a6b]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {editingDay && <EditModal day={editingDay} onClose={() => setEditingDay(null)} onSave={handleUpdateDay} />}
      {editingProdDay && <EditProductionModal day={editingProdDay} onClose={() => setEditingProdDay(null)} onSave={handleUpdateProdDay} />}

      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-[#fdfaf6]/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 animate-sway">
             <svg width="64" height="64" viewBox="0 0 24 24" fill="#2d4f3c"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <p className="text-xs font-black text-[#1a2f23] uppercase tracking-widest animate-pulse">Generando formato apaisado...</p>
        </div>
      )}
    </div>
  );
};

export default App;
