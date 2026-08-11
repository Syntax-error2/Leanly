import { useState } from 'react';
import { X, Search, ChefHat } from 'lucide-react';
import { mealDictionary } from '../data/mealDictionary';
import { db } from '../db/db';
import { generateRecipeDetails } from '../utils/recipeGenerator';

export default function AddPrepModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const handleSelectMeal = async (meal) => {
    const mealName = meal.title || meal.name;
    const timeStr = meal.time || '10 min';
    const totalMins = parseInt(timeStr.replace(/\D/g, '')) || 10;
    
    const newTasks = [];
    const { ingredients, steps } = generateRecipeDetails(meal);

    // 1. Gather Ingredients Step
    newTasks.push({ 
        text: `Gather ingredients: ${ingredients.join(', ')}`, 
        completed: false, 
        timeEstimate: Math.max(2, Math.floor(totalMins * 0.10)), 
        category: meal.category 
    });

    // 2. Add individual steps, dynamically dividing the remaining time
    const remainingTime = totalMins - Math.max(2, Math.floor(totalMins * 0.10));
    const timePerStep = Math.max(2, Math.floor(remainingTime / steps.length));

    steps.forEach((step, index) => {
        // Last step takes whatever time is remaining to ensure it adds up
        const isLast = index === steps.length - 1;
        const stepTime = isLast ? remainingTime - (timePerStep * (steps.length - 1)) : timePerStep;

        newTasks.push({ 
            text: step, 
            completed: false, 
            timeEstimate: Math.max(1, stepTime), 
            category: meal.category 
        });
    });
    
    await db.prepTasks.bulkAdd(newTasks);
    onClose();
  };

  const filteredMeals = searchQuery.length > 0 
    ? mealDictionary.filter(m => (m.title || m.name || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full rounded-t-[2rem] p-6 pb-12 shadow-2xl relative animate-slide-up h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-leanly-text-primary flex items-center gap-2">
            <ChefHat className="text-leanly-primary" /> Select Meal to Prep
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-95 transition-transform shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center bg-leanly-background rounded-2xl px-4 py-3 border border-transparent focus-within:border-leanly-primary transition-colors mb-4">
          <Search size={20} className="text-leanly-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search meals..." 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-leanly-text-primary placeholder:text-leanly-text-muted font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {searchQuery.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <ChefHat size={48} className="mb-4 text-leanly-text-muted" />
              <p className="font-medium text-leanly-text-secondary">Search for a recipe to instantly generate prep tasks for it!</p>
            </div>
          ) : filteredMeals.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredMeals.map((meal, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectMeal(meal)}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl active:bg-leanly-50 transition-colors text-left"
                >
                  <div>
                    <h3 className="font-bold text-leanly-text-primary">{meal.title || meal.name}</h3>
                    <p className="text-xs text-leanly-text-secondary">{meal.calories} kcal • {meal.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-leanly-100 flex items-center justify-center text-leanly-primary shrink-0">
                    <span className="font-bold">+</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center mt-10 font-medium text-leanly-text-secondary">No meals found.</div>
          )}
        </div>

      </div>
    </div>
  );
}
