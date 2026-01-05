
import React, { useState, useEffect } from 'react';
import { ProductionSchedule, Producer, ProductionTask, DayProduction } from '../types';

interface ProductionDashboardProps {
  user: Producer;
  production: ProductionSchedule;
  onToggleTask: (dayId: string, segment: string) => void;
  onLogout: () => void;
}

const ProductionDashboard: React.FC<ProductionDashboardProps> = ({ user, production, onToggleTask, onLogout }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  const encouragementMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Eres una máquina de producción! 🚀",
    "¡Esa tarea quedó impecable! ✨",
    "¡Gracias por cuidar la casa! ❤️",
    "¡Nivel PRO desbloqueado! 🏆",
    "¡Seguimos con todo! 💪",
    "¡Producción de lujo! 🎬"
  ];

  const myTasks: { dayId: string, dayName: string, segment: string, label: string, task: ProductionTask }[] = [];
  
  Object.values(production).forEach((day: DayProduction) => {
    const segments = [
      { key: 'morning', label: 'Mañana' },
      { key: 'lunchCook', label: 'Cocinar Almuerzo' },
      { key: 'afternoon', label: 'Tarde' },
      { key: 'dinnerCook', label: 'Cocinar Cena' },
      { key: 'night', label: 'Noche' }
    ];

    segments.forEach(seg => {
      const task = (day as any)[seg.key];
      if (task?.assignee === user) {
        myTasks.push({ dayId: day.id, dayName: day.name, segment: seg.key, label: seg.label, task });
      }
    });
  });

  const completedCount = myTasks.filter(t => t.task.completed).length;
  const totalTasks = myTasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleToggle = (dayId: string, segment: string, alreadyDone: boolean) => {
    onToggleTask(dayId, segment);
    if (!alreadyDone) {
      setLastMessage(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getBadges = () => {
    const badges = [];
    if (completedCount >= 1) badges.push({ icon: '🥉', title: 'Bronce', desc: 'Primera tarea' });
    if (completedCount >= 5) badges.push({ icon: '🥈', title: 'Plata', desc: '5 tareas hechas' });
    if (completedCount >= 10) badges.push({ icon: '🥇', title: 'Oro', desc: '10 tareas hechas' });
    if (completedCount === totalTasks && totalTasks > 0) badges.push({ icon: '👑', title: 'Leyenda', desc: 'Semana perfecta' });
    return badges;
  };

  const displayName = user === 'Nicolás' ? 'Alerce' : user;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 scale-150">
             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {displayName[0]}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">Hola, {displayName}</h2>
                <p className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Panel de Producción Individual</p>
              </div>
            </div>
            <button onClick={onLogout} className="px-4 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm">Cerrar Sesión</button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Progreso de la Semana</span>
              <span className="text-2xl font-black text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-50">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-3 text-gray-400 font-bold text-xs uppercase">{completedCount} de {totalTasks} tareas completadas</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {getBadges().map(badge => (
              <div key={badge.title} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl animate-in zoom-in duration-300">
                <span className="text-xl">{badge.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-800 uppercase leading-none">{badge.title}</span>
                  <span className="text-[9px] text-blue-400 font-bold">{badge.desc}</span>
                </div>
              </div>
            ))}
            {getBadges().length === 0 && (
              <p className="text-gray-300 font-bold italic text-sm">Completa tareas para ganar medallas...</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTasks.map(({ dayId, dayName, segment, label, task }) => (
          <button
            key={`${dayId}-${segment}`}
            onClick={() => handleToggle(dayId, segment, !!task.completed)}
            className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 group relative ${
              task.completed 
                ? 'bg-emerald-50 border-emerald-500/30' 
                : 'bg-white border-gray-100 hover:border-blue-500 hover:shadow-2xl shadow-blue-900/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${task.completed ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {dayName} • {label}
                </span>
                <h3 className={`text-lg font-black leading-tight ${task.completed ? 'text-emerald-900' : 'text-gray-900'}`}>
                  {task.description}
                </h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                task.completed ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-blue-500 group-hover:text-white'
              }`}>
                {task.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                )}
              </div>
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${task.completed ? 'text-emerald-500' : 'text-blue-500 opacity-0 group-hover:opacity-100'}`}>
              {task.completed ? 'Tarea Finalizada' : 'Marcar como Hecho'}
            </div>
          </button>
        ))}
      </div>

      {showCelebration && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-300 z-[100]">
          <span className="text-2xl animate-bounce">🎉</span>
          <p className="font-black text-xl tracking-tight">{lastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ProductionDashboard;
