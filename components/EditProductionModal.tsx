
import React, { useState, useEffect } from 'react';
import { DayProduction, Producer } from '../types';

interface EditProductionModalProps {
  day: DayProduction | null;
  onClose: () => void;
  onSave: (updatedDay: DayProduction) => void;
}

const producers: { value: Producer, label: string }[] = [
  { value: 'Rocío', label: 'Rocío' },
  { value: 'Nicolás', label: 'Alerce (Nicolás)' },
  { value: 'Mariano', label: 'Mariano' }
];

const EditProductionModal: React.FC<EditProductionModalProps> = ({ day, onClose, onSave }) => {
  const [formData, setFormData] = useState<DayProduction | null>(null);

  useEffect(() => {
    if (day) setFormData({ ...day });
  }, [day]);

  if (!day || !formData) return null;

  const handleTaskChange = (segment: keyof DayProduction, field: 'assignee' | 'description', value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const currentTask = (prev as any)[segment];
      return {
        ...prev,
        [segment]: {
          ...currentTask,
          [field]: value
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  const renderTaskFields = (segment: keyof DayProduction, label: string) => {
    const task = (formData as any)[segment];
    if (!task || typeof task === 'string') return null;

    const isCook = segment.toString().includes('Cook');

    return (
      <div className={`space-y-3 p-4 rounded-xl border ${isCook ? 'bg-orange-50/30 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isCook ? 'text-orange-600' : 'text-blue-500'}`}>
            {label}
          </label>
          <select 
            value={task.assignee}
            onChange={(e) => handleTaskChange(segment, 'assignee', e.target.value)}
            className="text-xs font-bold px-2 py-1 rounded bg-white border border-gray-200 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sin asignar</option>
            {producers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <textarea
          value={task.description}
          onChange={(e) => handleTaskChange(segment, 'description', e.target.value)}
          rows={isCook ? 1 : 2}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
          placeholder={`¿Qué se hace en ${label.toLowerCase()}?`}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
          <h2 className="text-xl font-bold text-blue-900">Tareas de {formData.name} {formData.date}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {renderTaskFields('morning', 'Mañana')}
          {renderTaskFields('lunchCook', 'Cocinar Almuerzo')}
          {renderTaskFields('afternoon', 'Tarde')}
          {renderTaskFields('dinnerCook', 'Cocinar Cena')}
          {renderTaskFields('night', 'Noche')}

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Guardar Tareas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductionModal;
