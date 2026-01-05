
export interface DayData {
  id: string;
  name: string;
  date: string;
  lunch: string;
  dinner: string;
  morningActivities: string;
  afternoonActivities: string;
}

export interface WeeklySchedule {
  [key: string]: DayData;
}

export type Producer = 'Rocío' | 'Nicolás' | 'Mariano' | '';

export interface ProductionTask {
  assignee: Producer;
  description: string;
  completed?: boolean;
}

export interface DayProduction {
  id: string;
  name: string;
  date: string;
  morning: ProductionTask;
  lunchCook: ProductionTask;
  afternoon: ProductionTask;
  dinnerCook: ProductionTask;
  night: ProductionTask;
}

export interface ProductionSchedule {
  [key: string]: DayProduction;
}

export interface UserStats {
  tasksCompleted: number;
  badges: string[];
}
