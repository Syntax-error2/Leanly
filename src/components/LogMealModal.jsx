import { useState, useEffect } from 'react';
import { X, Flame, Drumstick, Wheat, Droplets, Search } from 'lucide-react';
import { mealDictionary } from '../data/mealDictionary';

export default function LogMealModal({ isOpen, onClose, onSave, initialData }) {
  const [mealData, setMealData] = useState({
    name: '',
    type: 'Breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '1'
  });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Effect to handle pre-filled data if passed
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setMealData({
          name: initialData.title || initialData.name || '',
          type: initialData.category || 'Breakfast',
          calories: initialData.calories || '',
          protein: initialData.protein || '',
          carbs: initialData.carbs || '',
          fat: initialData.fat || '',
          quantity: '1'
        });
      } else {
        setMealData({ name: '', type: 'Breakfast', calories: '', protein: '', carbs: '', fat: '', quantity: '1' });
      }
      setSuggestions(mealDictionary.slice(0, 5)); // Load default suggestions
    }
  }, [isOpen, initialData]);

  // Smart Auto-fill Matching
  const handleNameChange = (e) => {
    const val = e.target.value;
    setMealData(prev => ({ ...prev, name: val }));
    
    if (val.length > 0) {
      const matches = mealDictionary.filter(m => (m.title || m.name || '').toLowerCase().includes(val.toLowerCase()));
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions(mealDictionary.slice(0, 5));
    }
    setShowSuggestions(true);
  };

  const applySuggestion = (meal) => {
    const q = Number(mealData.quantity) || 1;
    setMealData(prev => ({
      ...prev,
      name: meal.name || meal.title,
      protein: Math.round((meal.protein || 0) * q).toString(),
      carbs: Math.round((meal.carbs || 0) * q).toString(),
      fat: Math.round((meal.fat || 0) * q).toString(),
      category: meal.category || 'Breakfast'
    }));
    setShowSuggestions(false);
  };

  // Auto-calculate calories based on macros (4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat)
  useEffect(() => {
    const p = Number(mealData.protein) || 0;
    const c = Number(mealData.carbs) || 0;
    const f = Number(mealData.fat) || 0;
    
    if (p > 0 || c > 0 || f > 0) {
      const calculatedCalories = (p * 4) + (c * 4) + (f * 9);
      setMealData(prev => ({ ...prev, calories: calculatedCalories.toString() }));
    }
  }, [mealData.protein, mealData.carbs, mealData.fat, mealData.quantity]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: mealData.name,
      type: mealData.type,
      calories: Number(mealData.calories),
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fat: Number(mealData.fat) || 0,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-4 safe-area-pb transition-opacity animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative transform transition-transform duration-300 translate-y-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-leanly-background rounded-full flex items-center justify-center text-leanly-text-secondary active:scale-95 transition-transform"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-leanly-text-primary mb-6">Log Meal</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-leanly-text-primary mb-1 px-1">Meal Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Pork Adobo"
              className="w-full bg-leanly-background rounded-2xl px-5 py-4 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
              value={mealData.name}
              onChange={handleNameChange}
              onFocus={() => {if(mealData.name.length > 1) setShowSuggestions(true)}}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-leanly-border z-10 overflow-hidden max-h-40 overflow-y-auto">
                {suggestions.map((m, i) => (
                  <div key={i} className="px-5 py-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 cursor-pointer" onClick={() => applySuggestion(m)}>
                    <span className="font-semibold text-leanly-text-primary">{m.title || m.name}</span>
                    <span className="text-xs font-semibold text-leanly-text-secondary bg-gray-100 px-2 py-1 rounded-lg">P:{m.protein || m.p} C:{m.carbs || m.c} F:{m.fat || m.f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-leanly-text-primary mb-1 px-1">Meal Type</label>
              <select 
                className="w-full bg-leanly-background rounded-2xl px-5 py-4 outline-none text-leanly-text-primary appearance-none focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.type}
                onChange={(e) => setMealData({...mealData, type: e.target.value})}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snacks</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-leanly-text-primary mb-1 px-1">Quantity/Serving</label>
              <input 
                type="number"
                step="0.1" 
                min="0.1"
                placeholder="1"
                className="w-full bg-leanly-background rounded-2xl px-5 py-4 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.quantity}
                onChange={(e) => {
                  const newQ = e.target.value;
                  setMealData(prev => {
                    const oldQ = Number(prev.quantity) || 1;
                    const multiplier = (Number(newQ) || 1) / oldQ;
                    return {
                      ...prev, 
                      quantity: newQ,
                      protein: Math.round((Number(prev.protein) || 0) * multiplier).toString(),
                      carbs: Math.round((Number(prev.carbs) || 0) * multiplier).toString(),
                      fat: Math.round((Number(prev.fat) || 0) * multiplier).toString()
                    };
                  });
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-leanly-text-primary mb-1 px-1">
                <Flame size={14} className="text-orange-500" /> Calories
              </label>
              <input 
                type="number" 
                required
                placeholder="0"
                className="w-full bg-leanly-background rounded-2xl px-5 py-3 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.calories}
                onChange={(e) => setMealData({...mealData, calories: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-leanly-text-primary mb-1 px-1">
                <Drumstick size={14} className="text-blue-500" /> Protein (g)
              </label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-leanly-background rounded-2xl px-5 py-3 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.protein}
                onChange={(e) => setMealData({...mealData, protein: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-leanly-text-primary mb-1 px-1">
                <Wheat size={14} className="text-yellow-600" /> Carbs (g)
              </label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-leanly-background rounded-2xl px-5 py-3 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.carbs}
                onChange={(e) => setMealData({...mealData, carbs: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-leanly-text-primary mb-1 px-1">
                <Droplets size={14} className="text-yellow-400" /> Fat (g)
              </label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-leanly-background rounded-2xl px-5 py-3 outline-none text-leanly-text-primary placeholder:text-leanly-text-muted focus:ring-2 focus:ring-leanly-primary/50 transition-all font-medium"
                value={mealData.fat}
                onChange={(e) => setMealData({...mealData, fat: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#3A9900] text-white py-4 rounded-full font-bold text-lg shadow-soft transition-transform active:scale-95 mt-4"
          >
            Save Meal
          </button>
        </form>
      </div>
    </div>
  );
}
