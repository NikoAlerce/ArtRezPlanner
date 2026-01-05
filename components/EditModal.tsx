
import React, { useState, useEffect } from 'react';
import { DayData } from '../types';

interface EditModalProps {
  day: DayData | null;
  onClose: () => void;
  onSave: (updatedDay: DayData) => void;
}

const EditModal: React.FC<EditModalProps> = ({ day, onClose, onSave }) => {
  const [formData, setFormData] = useState<DayData | null>(null);

  useEffect(() => {
    if (day) setFormData({ ...day });
  }, [day]);

  if (!day || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">Editar {formData.name} {formData.date}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Comidas</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Almuerzo</label>
              <textarea
                name="lunch"
                value={formData.lunch}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none resize-none text-gray-800"
                placeholder="¿Qué comemos al mediodía?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cena</label>
              <textarea
                name="dinner"
                value={formData.dinner}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none resize-none text-gray-800"
                placeholder="¿Qué comemos a la noche?"
              />
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1 mt-2">Actividades</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mañana</label>
              <textarea
                name="morningActivities"
                value={formData.morningActivities}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none resize-none text-gray-800"
                placeholder="Actividades de la mañana..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarde</label>
              <textarea
                name="afternoonActivities"
                value={formData.afternoonActivities}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none resize-none text-gray-800"
                placeholder="Actividades de la tarde..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
