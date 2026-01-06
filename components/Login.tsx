
import React, { useState } from 'react';
import { Producer } from '../types';

interface LoginProps {
  onLogin: (user: Producer) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<Producer | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const users: { id: Producer, name: string, icon: string, color: string, role: string }[] = [
    { id: 'Rocío', name: 'Rocío', icon: '🌸', color: 'bg-[#f8e7e7]', role: 'Coordinación' },
    { id: 'Nicolás', name: 'Alerce', icon: '🌲', color: 'bg-[#e7f3f8]', role: 'Técnica' },
    { id: 'Mariano', name: 'Mariano', icon: '🌿', color: 'bg-[#e7f8ee]', role: 'Gestión' },
  ];

  const handleSelectUser = (user: Producer) => {
    setSelectedUser(user);
    setError(false);
    setPassword('');
  };

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación insensible a mayúsculas/minúsculas según pedido del usuario
    if (password.trim().toLowerCase() === 'chopi') {
      onLogin(selectedUser!);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fdfaf6] z-[100] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Elementos decorativos de fondo sutiles */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#2d4f3c05] rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#3a5a6b05] rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-xs w-full relative z-10">
        <div className="text-center mb-6">
          <span className="text-[#2d4f3c] font-black tracking-[0.3em] uppercase text-[8px] mb-1 block">Guardianes del Bosque</span>
          <h1 className="text-2xl font-black text-[#1a2f23] mb-1">Acceso al Refugio</h1>
          <p className="text-stone-400 text-xs italic">Identificación requerida para la labor</p>
        </div>

        {!selectedUser ? (
          <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="group relative flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-[#2d4f3c] transition-all duration-300 hover:shadow-md"
              >
                <div className={`w-10 h-10 rounded-lg ${user.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                  {user.icon}
                </div>
                <div className="text-left">
                  <span className="block text-base font-black text-[#1a2f23] leading-none">{user.id === 'Nicolás' ? 'Alerce' : user.name}</span>
                  <span className="text-[8px] font-bold text-stone-300 mt-0.5 block uppercase tracking-widest">{user.role}</span>
                </div>
                <div className="ml-auto w-6 h-6 rounded-full border border-stone-50 flex items-center justify-center group-hover:bg-[#1a2f23] group-hover:text-white transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form 
            onSubmit={handleLoginAttempt}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-[1.5rem] border border-stone-100 shadow-xl animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-center gap-3 mb-5 border-b border-stone-50 pb-4">
              <button 
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-6 h-6 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-sm ${users.find(u => u.id === selectedUser)?.color}`}>
                  {users.find(u => u.id === selectedUser)?.icon}
                </div>
                <span className="text-base font-black text-[#1a2f23]">{selectedUser === 'Nicolás' ? 'Alerce' : selectedUser}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Contraseña</label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Palabra Clave"
                  className={`w-full px-4 py-2 text-sm rounded-lg border ${error ? 'border-red-200 bg-red-50' : 'border-stone-100 bg-stone-50'} focus:ring-2 focus:ring-[#2d4f3c] focus:border-[#2d4f3c] outline-none transition-all text-center font-bold tracking-widest`}
                />
                {error && <p className="text-red-400 text-[8px] font-bold text-center mt-2 animate-pulse uppercase tracking-widest italic">Susurro incorrecto...</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#2d4f3c] text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-[#1a2f23] transform hover:-translate-y-0.5 transition-all"
              >
                Validar Cuidado
              </button>
            </div>
          </form>
        )}
        
        <p className="text-center mt-8 text-stone-300 font-bold italic text-[10px]">"Silencio y labor en el Bosque de Gracias."</p>
      </div>
    </div>
  );
};

export default Login;
