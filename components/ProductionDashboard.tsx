
import React, { useState, useEffect, useCallback } from 'react';
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
    "¡Tu energía nutre el bosque! 🌿",
    "¡Misión cumplida! ✨",
    "¡Gracias por cuidar! ❤️",
    "¡Has florecido! 🌸",
    "¡El bosque te agradece! 🌲"
  ];

  const myTasks: { dayId: string, dayName: string, segment: string, label: string, task: ProductionTask, date: string }[] = [];
  
  Object.values(production).forEach((day: DayProduction) => {
    const segments = [
      { key: 'morning', label: 'Mañana' },
      { key: 'lunchCook', label: 'Cocinó Almuerzo' },
      { key: 'afternoon', label: 'Tarde' },
      { key: 'dinnerCook', label: 'Cocinó Cena' },
      { key: 'night', label: 'Noche' }
    ];

    segments.forEach(seg => {
      const task = (day as any)[seg.key];
      if (task?.assignee === user) {
        myTasks.push({ dayId: day.id, dayName: day.name, segment: seg.key, label: seg.label, task, date: day.date });
      }
    });
  });

  const sendLocalNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        // Fix: Cast options to any to avoid TypeScript error as 'vibrate' is not in standard DOM NotificationOptions
        registration.showNotification(title, {
          body,
          icon: 'https://img.icons8.com/ios-filled/192/1A2F23/pine-tree.png',
          badge: 'https://img.icons8.com/ios-filled/96/1A2F23/pine-tree.png',
          vibrate: [200, 100, 200],
          tag: 'task-reminder'
        } as any);
      });
    }
  }, []);

  // Verificar tareas de hoy y notificar
  useEffect(() => {
    const today = new Date().getDate().toString();
    const tasksForToday = myTasks.filter(t => t.date === today && !t.task.completed);

    if (tasksForToday.length > 0) {
      const taskList = tasksForToday.map(t => t.label).join(", ");
      sendLocalNotification(
        `¡Hola ${user === 'Nicolás' ? 'Alerce' : user}!`,
        `Hoy tienes ${tasksForToday.length} tareas pendientes: ${taskList}.`
      );
    }
  }, []);

  const completedCount = myTasks.filter(t => t.task.completed).length;
  const totalTasks = myTasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleToggle = (dayId: string, segment: string, alreadyDone: boolean) => {
    onToggleTask(dayId, segment);
    if (!alreadyDone) {
      setLastMessage(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }
  };

  const getBadges = () => {
    const badges = [];
    if (completedCount >= 1) badges.push({ icon: '🌱', title: 'Semilla' });
    if (completedCount >= 5) badges.push({ icon: '🌿', title: 'Brote' });
    if (completedCount >= 10) badges.push({ icon: '🌳', title: 'Arrayán' });
    return badges;
  };

  const displayName = user === 'Nicolás' ? 'Alerce' : user;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 border border-white shadow-lg mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#2d4f3c] text-white flex items-center justify-center text-2xl font-black shadow-xl">
              {displayName[0]}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-[#1a2f23]">Hola, {displayName}</h2>
              <p className="text-stone-400 font-bold uppercase tracking-widest text-[9px]">Guardián Bosque</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => sendLocalNotification("Prueba de Bosque", "Las notificaciones están activas 🌲")}
              className="px-4 py-2 rounded-xl border border-stone-100 text-[#3a5a6b] hover:bg-stone-50 transition-all font-bold text-xs flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              Test
            </button>
            <button 
              onClick={onLogout} 
              className="px-6 py-2 rounded-xl border border-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50/50 transition-all font-bold text-xs"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Vitalidad de Labores</span>
              <span className="text-3xl font-black text-[#2d4f3c]">{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden p-1 shadow-inner border border-stone-50">
              <div 
                className="h-full bg-[#2d4f3c] rounded-full transition-all duration-[1s]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {getBadges().map(badge => (
              <div key={badge.title} className="flex items-center gap-2 bg-white border border-stone-100 px-4 py-2 rounded-xl shadow-sm hover:-translate-y-1 transition-all">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-[10px] font-black text-[#2d4f3c] uppercase">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {myTasks.map(({ dayId, dayName, segment, label, task }) => (
          <button
            key={`${dayId}-${segment}`}
            onClick={() => handleToggle(dayId, segment, !!task.completed)}
            className={`group relative text-left p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
              task.completed 
                ? 'bg-[#f0f4f1]/40 border-[#2d4f3c22]' 
                : 'bg-white border-stone-100 hover:border-[#3a5a6b] hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col space-y-1.5">
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ${task.completed ? 'text-[#2d4f3c]' : 'text-[#3a5a6b]'}`}>
                  {dayName} • {label}
                </span>
                <h3 className={`text-base font-black leading-tight ${task.completed ? 'text-[#1a2f23] line-through opacity-40' : 'text-[#1a2f23]'}`}>
                  {task.description}
                </h3>
              </div>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                task.completed ? 'bg-[#2d4f3c] text-white shadow-lg' : 'bg-stone-50 text-stone-300 group-hover:bg-[#3a5a6b] group-hover:text-white'
              }`}>
                {task.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle></svg>
                )}
              </div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${task.completed ? 'text-[#2d4f3c]' : 'text-[#3a5a6b] opacity-0 group-hover:opacity-100 transition-opacity'}`}>
              {task.completed ? 'Tarea Realizada' : 'Marcar como Lista'}
            </span>
          </button>
        ))}
      </div>

      {showCelebration && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-12 z-[100]">
          <span className="text-xl animate-bounce">🌲</span>
          <p className="font-black text-sm text-[#1a2f23]">{lastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ProductionDashboard;
