
import { WeeklySchedule, ProductionSchedule } from './types';

export const INITIAL_DATA: WeeklySchedule = {
  'lunes': {
    id: 'lunes',
    name: 'Lunes',
    date: '5',
    lunch: 'Arroz con poroto c/ ensalada',
    dinner: 'Pastas caseras',
    morningActivities: 'Taller Cyano',
    afternoonActivities: 'Audiovisual Análogo/Digital'
  },
  'martes': {
    id: 'martes',
    name: 'Martes',
    date: '6',
    lunch: 'Hamburger c/ puré y vegetariana',
    dinner: 'Empanada gallega',
    morningActivities: 'Glitch after y cowork',
    afternoonActivities: 'Catarata'
  },
  'miercoles': {
    id: 'miercoles',
    name: 'Miércoles',
    date: '7',
    lunch: 'Choripán y milanesa vegetariana',
    dinner: 'Pizzas caseras',
    morningActivities: '3D AI',
    afternoonActivities: 'Cowork glitch'
  },
  'jueves': {
    id: 'jueves',
    name: 'Jueves',
    date: '8',
    lunch: 'Almuerzo Empanadas',
    dinner: 'Burgol c/ salteo',
    morningActivities: 'Cerámica',
    afternoonActivities: 'Minteo y revision y pensar en el evento cierre'
  },
  'viernes': {
    id: 'viernes',
    name: 'Viernes',
    date: '9',
    lunch: 'Tortillas',
    dinner: 'Milanesas en Sandwichito',
    morningActivities: 'Cowork',
    afternoonActivities: 'Cowork'
  },
  'sabado': {
    id: 'sabado',
    name: 'Sábado',
    date: '10',
    lunch: 'Por verse',
    dinner: 'Pizzas caseras',
    morningActivities: 'Cowork',
    afternoonActivities: 'Evento cierre fiesta audiovisual'
  },
  'domingo': {
    id: 'domingo',
    name: 'Domingo',
    date: '11',
    lunch: 'Tartas individuales',
    dinner: 'Pastas caseras con salsa',
    morningActivities: 'Descanso',
    afternoonActivities: 'Cierre de semana'
  }
};

export const INITIAL_PRODUCTION_DATA: ProductionSchedule = {
  'martes': { 
    id: 'martes', name: 'Martes', date: '6', 
    morning: { assignee: 'Mariano', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Rocío', description: 'Cocinar Almuerzo', completed: false },
    afternoon: { assignee: 'Nicolás', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Mariano', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Nicolás', description: 'Mesa, platos y barrido (Mariano cocinó)', completed: false } 
  },
  'miercoles': { 
    id: 'miercoles', name: 'Miércoles', date: '7', 
    morning: { assignee: 'Rocío', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Rocío', description: 'Cocinar Almuerzo', completed: false },
    afternoon: { assignee: 'Mariano', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Nicolás', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Mariano', description: 'Mesa, platos y barrido final', completed: false } 
  },
  'jueves': { 
    id: 'jueves', name: 'Jueves', date: '8', 
    morning: { assignee: 'Rocío', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Nicolás', description: 'Cocinar Almuerzo (Duo M/A)', completed: false },
    afternoon: { assignee: 'Rocío', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Mariano', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Nicolás', description: 'Mesa, platos y barrido (Mariano cocinó)', completed: false } 
  },
  'viernes': { 
    id: 'viernes', name: 'Viernes', date: '9', 
    morning: { assignee: 'Nicolás', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Rocío', description: 'Cocinar Almuerzo', completed: false },
    afternoon: { assignee: 'Mariano', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Mariano', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Nicolás', description: 'Mesa, platos y barrido (Mariano cocinó)', completed: false } 
  },
  'sabado': { 
    id: 'sabado', name: 'Sábado', date: '10', 
    morning: { assignee: 'Mariano', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Nicolás', description: 'Cocinar Almuerzo', completed: false },
    afternoon: { assignee: 'Rocío', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Nicolás', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Rocío', description: 'Mesa, platos y barrido final', completed: false } 
  },
  'domingo': { 
    id: 'domingo', name: 'Domingo', date: '11', 
    morning: { assignee: 'Nicolás', description: 'Desayuno, barrer, trapo y baño', completed: false }, 
    lunchCook: { assignee: 'Mariano', description: 'Cocinar Almuerzo', completed: false },
    afternoon: { assignee: 'Rocío', description: 'Post-almuerzo, platos y merienda', completed: false }, 
    dinnerCook: { assignee: 'Rocío', description: 'Cocinar Cena', completed: false },
    night: { assignee: 'Nicolás', description: 'Mesa, platos y barrido (Rocío cocinó)', completed: false } 
  },
};
