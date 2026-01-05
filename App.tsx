
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import EditModal from './components/EditModal';
import EditProductionModal from './components/EditProductionModal';
import Login from './components/Login';
import ProductionDashboard from './components/ProductionDashboard';
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
    const msg = activeTab === 'artistic' 
      ? '¿Restablecer el organigrama artístico original?' 
      : '¿Restablecer el organigrama de producción con la rotación equitativa?';
    
    if (confirm(msg)) {
      if (activeTab === 'artistic') setSchedule(INITIAL_DATA);
      else setProduction(INITIAL_PRODUCTION_DATA);
    }
  };

  const handleExportImage = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const element = containerRef.current;
      const dataUrl = await toPng(element, {
        backgroundColor: '#fcfbf7',
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: { padding: '40px', width: `${element.scrollWidth}px`, overflow: 'visible' },
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `organigrama-${activeTab}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Error al exportar. Prueba imprimir como PDF.');
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
      case 'Rocío': return 'bg-pink-100 text-pink-700 border-pink-200 ring-pink-500/20';
      case 'Nicolás': return 'bg-sky-100 text-sky-700 border-sky-200 ring-sky-500/20';
      case 'Mariano': return 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      default: return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  const getDisplayName = (name: Producer) => {
    if (name === 'Nicolás') return 'Alerce';
    return name;
  };

  // If we are in production and not logged in, show login screen
  if (activeTab === 'production' && !currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExportImage={handleExportImage} 
        onReset={handleReset} 
      />

      <main className="relative">
        {activeTab === 'artistic' ? (
          <div ref={containerRef} className={`custom-scrollbar pb-6 -mx-4 px-4 ${isExporting ? 'overflow-visible bg-[#fcfbf7]' : 'overflow-x-auto'}`}>
            <div className={`flex gap-4 ${isExporting ? 'w-fit' : 'min-w-[1400px]'}`}>
              {daysOrder.map((dayId) => {
                const day = schedule[dayId];
                if (!day) return null;
                return (
                  <div key={dayId} className="flex-1 min-w-[240px] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{day.name}</h3>
                        <span className="text-4xl font-black text-orange-500 leading-none">{day.date}</span>
                      </div>
                      <button onClick={() => setEditingDay(day)} className="p-2.5 rounded-2xl text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 print:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                    <div className="p-6 flex flex-col gap-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span> Almuerzo
                        </h4>
                        <p className="text-gray-700 font-medium italic text-sm leading-relaxed">{day.lunch || "—"}</p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Cena
                        </h4>
                        <p className="text-gray-700 font-medium italic text-sm leading-relaxed">{day.dinner || "—"}</p>
                      </div>
                    </div>
                    <div className="bg-orange-50/50 p-6 flex-1 border-t border-orange-100/50 flex flex-col gap-5">
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.25em]">Actividades</h4>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-orange-400/70 uppercase">Mañana</span>
                        <p className="text-gray-900 font-bold text-sm leading-tight">{day.morningActivities || "—"}</p>
                      </div>
                      <div className="h-px border-t border-dashed border-orange-200" />
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-orange-400/70 uppercase">Tarde</span>
                        <p className="text-gray-900 font-bold text-sm leading-tight">{day.afternoonActivities || "—"}</p>
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
        <section className="mt-12 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                Carga Semanal del Equipo
              </h2>
              <p className="text-gray-500 font-medium mt-1">Estadísticas de cumplimiento y distribución de tareas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Rocío', 'Nicolás', 'Mariano'].map((name) => {
              const stats = prodStats[name] || { total: 0, completed: 0 };
              const producerName = name as Producer;
              return (
                <div key={name} className="relative bg-gray-50/50 p-6 rounded-3xl border border-gray-100 transition-all hover:border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-4 py-1.5 rounded-2xl text-sm font-black border shadow-sm ${getAssigneeColor(producerName)}`}>
                      {getDisplayName(producerName)}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">
                        {stats.completed}
                      </span>
                      <span className="text-gray-400 font-bold text-xs uppercase">/ {stats.total} Hechas</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
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
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className={`w-20 h-20 border-8 border-t-transparent rounded-full animate-spin mb-8 ${activeTab === 'artistic' ? 'border-orange-500' : 'border-blue-600'}`}></div>
          <p className={`font-black text-3xl animate-pulse tracking-tight ${activeTab === 'artistic' ? 'text-orange-600' : 'text-blue-800'}`}>
            PROCESANDO SEMANA...
          </p>
          <p className="text-gray-400 font-medium mt-4">Generando imagen en alta resolución</p>
        </div>
      )}
    </div>
  );
};

export default App;
