
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Guardar datos
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

  // Gestión de Notificaciones
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.log("Este navegador no soporta notificaciones.");
        return;
      }

      if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification("¡Bosque de Gracias!", {
              body: "Te avisaremos de tus turnos de cuidado.",
              icon: "https://img.icons8.com/ios-filled/192/1A2F23/pine-tree.png"
            });
          }
        } catch (error) {
          console.error("Error solicitando notificaciones", error);
        }
      }
    };

    requestNotificationPermission();
  }, []);

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
        [dayId]: {
          ...day,
          [segment]: {
            ...task,
            completed: !task.completed
          }
        }
      };
    });
  };

  const handleReset = () => {
    const msg = '¿Restablecer organigrama?';
    if (confirm(msg)) {
      if (activeTab === 'artistic') setSchedule(INITIAL_DATA);
      else setProduction(INITIAL_PRODUCTION_DATA);
    }
  };

  const handleExportImage = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const element = containerRef.current;
      const dataUrl = await toPng(element, {
        backgroundColor: '#fdfaf6',
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: { padding: '40px', width: `${element.scrollWidth}px`, overflow: 'visible' },
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `bosque-${activeTab}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Error exportando.');
    } finally {
      setIsExporting(false);
    }
  };

  const daysOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  const prodStats = Object.values(production).reduce((acc, day: DayProduction) => {
    [day.morning, day.lunchCook, day.afternoon, day.dinnerCook, day.night].forEach(task => {
      if (task?.assignee) {
        if (!acc[task.assignee]) acc[task.assignee] = { total: 0, completed: 0 };
        acc[task.assignee].total += 1;
        if (task.completed) acc[task.assignee].completed += 1;
      }
    });
    return acc;
  }, {} as Record<string, { total: number, completed: number }>);

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
        {activeTab === 'artistic' ? (
          <div ref={containerRef} className={`pb-6 -mx-2 px-2`}>
            {/* Grid de dos columnas para el cronograma artístico */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {daysOrder.map((dayId) => {
                const day = schedule[dayId];
                if (!day) return null;
                return (
                  <div key={dayId} className="bg-white/70 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] border border-stone-200/40 shadow-sm flex flex-col group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-4 md:p-6 bg-gradient-to-br from-stone-50 to-white border-b border-stone-100 flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h3 className="text-[8px] md:text-[10px] font-black text-[#2d4f3c] uppercase tracking-[0.2em] md:tracking-[0.3em]">{day.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl md:text-4xl font-serif font-black text-[#1a2f23] tracking-tighter">{day.date}</span>
                          <span className="text-stone-300 font-serif italic text-xs md:text-sm">Ene</span>
                        </div>
                      </div>
                      <button onClick={() => setEditingDay(day)} className="p-1.5 md:p-2 rounded-xl text-stone-300 hover:text-[#2d4f3c] hover:bg-white transition-all md:opacity-0 md:group-hover:opacity-100 print:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                    
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-grow relative">
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                           <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-orange-600/60">Almuerzo</span>
                        </div>
                        <p className="text-[#1a2f23] font-serif italic text-sm md:text-base leading-snug line-clamp-3">{day.lunch || "..."}</p>
                      </div>
                      
                      <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                           <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-blue-600/60">Cena</span>
                        </div>
                        <p className="text-[#1a2f23] font-serif italic text-sm md:text-base leading-snug line-clamp-3">{day.dinner || "..."}</p>
                      </div>
                    </div>

                    <div className="bg-[#1a2f23] p-4 md:p-6 text-white space-y-3">
                      <div className="space-y-0.5 relative z-10">
                        <span className="text-[7px] md:text-[9px] font-bold text-stone-500 uppercase tracking-widest">Mañana</span>
                        <p className="font-bold text-[11px] md:text-sm leading-tight text-stone-200 line-clamp-2">{day.morningActivities || "Espacio"}</p>
                      </div>
                      <div className="space-y-0.5 relative z-10">
                        <span className="text-[7px] md:text-[9px] font-bold text-stone-500 uppercase tracking-widest">Tarde</span>
                        <p className="font-bold text-[11px] md:text-sm leading-tight text-stone-200 line-clamp-2">{day.afternoonActivities || "Conexión"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ProductionDashboard 
            user={currentUser!} 
            production={production} 
            onToggleTask={handleToggleTask} 
            onLogout={() => setCurrentUser(null)} 
          />
        )}
      </main>

      {activeTab === 'production' && (
        <section className="mt-8 glass rounded-[2rem] p-8 border border-white/50 shadow-lg print:hidden animate-in fade-in duration-700">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#1a2f23] flex items-center gap-3">
              Estadísticas de Cuidado
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Rocío', 'Nicolás', 'Mariano'].map((name) => {
              const stats = prodStats[name] || { total: 0, completed: 0 };
              const prodName = name as Producer;
              return (
                <div key={name} className="bg-white/40 p-5 rounded-2xl border border-stone-100 flex items-center justify-between group">
                  <div className="space-y-1">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getAssigneeColor(prodName)}`}>
                      {name === 'Nicolás' ? 'Alerce' : name}
                    </span>
                    <div className="w-32 bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-[#3a5a6b] rounded-full transition-all duration-700"
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#1a2f23]">{stats.completed}</span>
                    <span className="text-stone-300 font-bold text-[10px] ml-1">/ {stats.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {editingDay && <EditModal day={editingDay} onClose={() => setEditingDay(null)} onSave={handleUpdateDay} />}
      {editingProdDay && <EditProductionModal day={editingProdDay} onClose={() => setEditingProdDay(null)} onSave={handleUpdateProdDay} />}

      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-[#fdfaf6]/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 animate-sway">
             <svg width="64" height="64" viewBox="0 0 24 24" fill="#2d4f3c"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <p className="text-xs font-black text-[#1a2f23] uppercase tracking-widest animate-pulse">Revelando el Arte...</p>
        </div>
      )}
    </div>
  );
};

export default App;
