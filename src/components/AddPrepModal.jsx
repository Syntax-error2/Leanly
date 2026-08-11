import { useState } from 'react';
import { X, Search, ChefHat } from 'lucide-react';
import { mealDictionary } from '../data/mealDictionary';
import { db } from '../db/db';

export default function AddPrepModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const handleSelectMeal = async (meal) => {
    const mealName = meal.title || meal.name;
    const timeStr = meal.time || '10 min';
    const totalMins = parseInt(timeStr.replace(/\D/g, '')) || 10;
    
    const newTasks = [];
    
    // Add specific detailed tasks based on tags/category
    const est0 = 2; // Time to gather ingredients
    const est1 = Math.max(2, Math.floor(totalMins * 0.15));
    const est2 = Math.max(3, Math.floor(totalMins * 0.35));
    const est3 = Math.max(3, Math.floor(totalMins * 0.40));
    const est4 = Math.max(2, Math.floor(totalMins * 0.10));

    // Common Step:
    newTasks.push({ text: `Gather ingredients: ${mealName} components, aromatics, and spices`, completed: false, timeEstimate: est0, category: meal.category });

    if (meal.tags?.includes('Fruit')) {
        newTasks.push({ text: `Wash and inspect ${mealName} thoroughly`, completed: false, timeEstimate: est1, category: meal.category });
        newTasks.push({ text: `Peel, core, or destem as needed`, completed: false, timeEstimate: est2, category: meal.category });
        newTasks.push({ text: `Chop into bite-sized uniform portions`, completed: false, timeEstimate: est3, category: meal.category });
        newTasks.push({ text: `Store in airtight container with lemon juice`, completed: false, timeEstimate: est4, category: meal.category });
    } else if (meal.tags?.includes('Veggie')) {
        newTasks.push({ text: `Wash vegetables and pat dry`, completed: false, timeEstimate: est1, category: meal.category });
        newTasks.push({ text: `Chop and prep aromatics (garlic/onions)`, completed: false, timeEstimate: est2, category: meal.category });
        newTasks.push({ text: `Blanch or lightly steam ${mealName}`, completed: false, timeEstimate: est3, category: meal.category });
        newTasks.push({ text: `Ice bath and pack into containers`, completed: false, timeEstimate: est4, category: meal.category });
    } else if (meal.tags?.includes('Protein') || mealName.toLowerCase().match(/chicken|pork|beef|fish|egg|shrimp/)) {
        newTasks.push({ text: `Defrost and clean protein for ${mealName}`, completed: false, timeEstimate: est1, category: meal.category });
        newTasks.push({ text: `Prepare marinade and aromatics`, completed: false, timeEstimate: est2, category: meal.category });
        newTasks.push({ text: `Cook protein thoroughly to temp`, completed: false, timeEstimate: est3, category: meal.category });
        newTasks.push({ text: `Let rest and portion into meal boxes`, completed: false, timeEstimate: est4, category: meal.category });
    } else {
        newTasks.push({ text: `Gather and measure all dry ingredients`, completed: false, timeEstimate: est1, category: meal.category });
        newTasks.push({ text: `Prepare primary base for ${mealName}`, completed: false, timeEstimate: est2, category: meal.category });
        newTasks.push({ text: `Combine and simmer to completion`, completed: false, timeEstimate: est3, category: meal.category });
        newTasks.push({ text: `Cool down and pack into containers`, completed: false, timeEstimate: est4, category: meal.category });
    }
    
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
