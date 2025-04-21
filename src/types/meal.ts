export interface Meal {
  id: string;
  userId: string;
  date: Date;
  mealType: MealType;
  carbAmount: number; // gram cinsinden
  insulinAmount: number; // ünite cinsinden
  bloodSugar: number; // mg/dL cinsinden
  notes?: string;
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
} 