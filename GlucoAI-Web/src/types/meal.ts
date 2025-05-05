export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}

export interface Meal {
  id: string;
  userId: string;
  mealType: MealType;
  carbAmount: number;
  insulinAmount: number;
  bloodSugar: number;
  date: Date;
  notes?: string;
} 