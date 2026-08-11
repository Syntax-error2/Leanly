import { useState } from 'react';
import { Search, Heart, Clock, Flame, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { mealDictionary } from '../data/mealDictionary';
import LogMealModal from '../components/LogMealModal';

export default function Meals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [filterMode, setFilterMode] = useState('All'); // All, Protein, Calorie
  
  const userProfile = useLiveQuery(() => db.userProfile.toCollection().first());
  const goal = userProfile?.goal || 'Maintain Weight';

  const mealCategories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  // All valid meals
  const allMeals = mealDictionary;

  // Filter based on search and category
  const filteredMeals = allMeals.filter(meal => {
    const matchesCategory = activeCategory === 'All' || meal.category === activeCategory;
    const mealTitle = meal.title || meal.name || '';
    const matchesSearch = mealTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterMode === 'High Protein') matchesFilter = meal.protein > 20;
    if (filterMode === 'Low Calorie') matchesFilter = meal.calories < 400;

    return matchesCategory && matchesSearch && matchesFilter;
  });

  // Recommended meals (based on goal)
  const recommendedMeals = [...allMeals].sort((a, b) => {
    if (goal === 'Lose Weight') return a.calories - b.calories;
    if (goal === 'Build Muscle') return b.protein - a.protein;
    return 0;
  }).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6 bg-leanly-background">
      <header className="mb-6 mt-4">
        <h1 className="text-[32px] leading-tight font-bold text-leanly-text-primary mb-2 animate-fade-in">
          Discover<br />Healthy Meals
        </h1>
        <p className="text-leanly-text-secondary animate-fade-in" style={{animationDelay: '100ms'}}>
          {allMeals.length} curated meals for you.
        </p>
      </header>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-transparent focus-within:border-leanly-primary transition-colors animate-fade-in" style={{animationDelay: '150ms'}}>
          <Search size={20} className="text-leanly-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search for recipes, ingredients..." 
            className="flex-1 bg-transparent border-none outline-none text-leanly-text-primary placeholder:text-leanly-text-muted text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            let nextMode = 'All';
            if (filterMode === 'All') nextMode = 'High Protein';
            else if (filterMode === 'High Protein') nextMode = 'Low Calorie';
            setFilterMode(nextMode);
            window.alert(`Filter applied: ${nextMode}`);
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft shrink-0 transition-colors ${filterMode !== 'All' ? 'bg-leanly-primary text-white' : 'bg-white text-leanly-text-primary'}`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Recommended Section (Goal Based) - Only show if not searching */}
      {searchQuery === '' && (
        <div className="mb-8 animate-fade-in" style={{animationDelay: '180ms'}}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-leanly-primary" />
            <h2 className="font-bold text-lg text-leanly-text-primary">Recommended for {goal}</h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 -mx-6 px-6 pb-4">
            {recommendedMeals.map((meal) => (
              <div key={`rec-${meal.id}`} className="bg-white rounded-3xl p-3 shadow-soft w-[160px] shrink-0 relative flex flex-col cursor-pointer active:scale-95 transition-transform" onClick={() => setSelectedMeal(meal)}>
                <div className="w-full h-24 bg-leanly-50 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center">
                  <img src="/logo.svg" alt="Leanly" className="w-16 h-16 object-contain opacity-70 hover:opacity-100 transition-all" />
                </div>
                <h3 className="font-bold text-leanly-text-primary text-sm leading-tight mb-1 truncate">{meal.title}</h3>
                <p className="text-xs font-bold text-leanly-primary">{meal.calories} kcal</p>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-leanly-primary text-white rounded-full flex items-center justify-center shadow-soft">
                  <Plus size={16} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Horizontal Scroll */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 -mx-6 px-6 pb-2 animate-fade-in" style={{animationDelay: '200ms'}}>
        {mealCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all active:scale-95 ${
              activeCategory === category 
                ? 'bg-leanly-primary text-white shadow-soft' 
                : 'bg-white text-leanly-text-secondary border border-leanly-border hover:bg-leanly-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Meals Grid/List */}
      <div className="flex flex-col gap-5 pb-6">
        {filteredMeals.map((meal, idx) => (
          <div 
            key={meal.id} 
            className="bg-white rounded-3xl p-4 shadow-sm relative animate-fade-in cursor-pointer active:scale-[0.98] transition-transform"
            style={{animationDelay: `${200 + (idx * 50)}ms`}}
            onClick={() => setSelectedMeal(meal)}
          >
            <div className="relative w-full h-36 bg-leanly-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
              <img src="/logo.svg" alt="Leanly" className="w-24 h-24 object-contain opacity-30 grayscale hover:grayscale-0 transition-all absolute" />
              
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                <Heart size={16} className="text-leanly-text-muted" />
              </button>
              
              {/* Macros pills floating */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-leanly-text-primary shadow-sm">
                  P:{meal.protein}
                </span>
                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-leanly-text-primary shadow-sm">
                  C:{meal.carbs}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="pr-10">
                <h3 className="font-bold text-lg text-leanly-text-primary leading-tight mb-1">{meal.title}</h3>
                <div className="flex gap-1 flex-wrap mb-2">
                  {meal.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-leanly-primary bg-leanly-primary/10 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button 
                  onClick={() => db.favorites.add({ mealId: meal.id, title: meal.title, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat, category: meal.category })}
                  className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-400 active:scale-95 shadow-sm"
                >
                  <Heart size={18} strokeWidth={2.5} />
                </button>
                <button 
                  className="w-10 h-10 bg-leanly-background rounded-full flex items-center justify-center text-leanly-primary shadow-inner"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-leanly-text-secondary mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-leanly-primary" />
                <span className="text-leanly-primary">{meal.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-500">{meal.time}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredMeals.length === 0 && (
          <p className="text-center text-leanly-text-muted mt-8 font-medium">No meals found.</p>
        )}
      </div>

      {selectedMeal && (
        <LogMealModal 
          isOpen={true} 
          onClose={() => setSelectedMeal(null)} 
          initialData={selectedMeal} 
        />
      )}
    </div>
  );
}
