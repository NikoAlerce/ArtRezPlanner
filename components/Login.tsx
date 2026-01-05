
import React from 'react';
import { Producer } from '../types';

interface LoginProps {
  onLogin: (user: Producer) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const users: { id: Producer, name: string, icon: string, color: string }[] = [
    { id: 'Rocío', name: 'Rocío', icon: '🌸', color: 'from-pink-500 to-rose-400' },
    { id: 'Nicolás', name: 'Alerce', icon: '🌲', color: 'from-sky-500 to-blue-400' },
    { id: 'Mariano', name: 'Mariano', icon: '🌿', color: 'from-emerald-500 to-teal-400' },
  ];

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-200 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Acceso Producción</h1>
          <p className="text-gray-500 font-medium">Selecciona tu perfil para gestionar tus tareas</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onLogin(user.id)}
              className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 active:scale-[0.98]"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${user.color} flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform`}>
                {user.icon}
              </div>
              <div className="text-left">
                <span className="block text-xl font-black text-gray-900 leading-none">{user.name}</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1 block">Entrar</span>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
