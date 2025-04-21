import { Meal, MealType } from '../types/meal';

// Mock veritabanı
const mockMeals: Meal[] = [];

// Benzersiz ID oluşturmak için yardımcı fonksiyon
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const addMeal = async (
  userId: string,
  mealData: Omit<Meal, 'id' | 'userId'>
): Promise<Meal> => {
  try {
    const newMeal: Meal = {
      id: generateId(),
      userId,
      ...mealData,
    };

    mockMeals.push(newMeal);
    return newMeal;
  } catch (error) {
    throw error;
  }
};

export const getUserMeals = async (userId: string): Promise<Meal[]> => {
  try {
    return mockMeals.filter(meal => meal.userId === userId);
  } catch (error) {
    throw error;
  }
};

export const getMealsByDate = async (userId: string, date: Date): Promise<Meal[]> => {
  try {
    return mockMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return meal.userId === userId &&
        mealDate.getFullYear() === date.getFullYear() &&
        mealDate.getMonth() === date.getMonth() &&
        mealDate.getDate() === date.getDate();
    });
  } catch (error) {
    throw error;
  }
};

export const deleteMeal = async (userId: string, mealId: string): Promise<boolean> => {
  try {
    const index = mockMeals.findIndex(meal => meal.id === mealId && meal.userId === userId);
    if (index === -1) {
      throw new Error('Öğün bulunamadı');
    }
    mockMeals.splice(index, 1);
    return true;
  } catch (error) {
    throw error;
  }
}; 