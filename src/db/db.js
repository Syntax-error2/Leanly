import Dexie from 'dexie';

export const db = new Dexie('LeanlyDatabase');

db.version(3).stores({
  userProfile: '++id, name, gender, age, weight, height, goal, targetCalories, targetProtein, targetCarbs, targetFat, avatar',
  prepTasks: '++id, text, completed, category, timeEstimate',
  progress: '++id, weight, date',
  meals: '++id, name, calories, protein, carbs, fat, date, type',
  exercise: '++id, type, duration, calories, date',
  favorites: '++id, mealId, title, calories, protein, carbs, fat, category',
  achievements: '++id, title, icon, dateUnlocked'
});
