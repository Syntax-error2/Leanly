import { useState } from 'react';
import { Search, SlidersHorizontal, Bell, Plus, Heart, Flame } from 'lucide-react';
import LogMealModal from '../components/LogMealModal';
import AddActivityModal from '../components/AddActivityModal';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  // Fetch today's meals from Dexie
  const loggedMeals = useLiveQuery(() => 
    db.meals
      .filter(m => new Date(m.date).toDateString() === new Date().toDateString())
      .toArray()
  ) || [];

  const exercises = useLiveQuery(() => 
    db.exercise
      .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
      .toArray()
  ) || [];

  // Fetch User Profile goals from Dexie
  const profiles = useLiveQuery(() => db.userProfile.toArray()) || [];
  const profile = profiles[0] || {};
  
  const goals = {
    calories: profile.targetCalories || 2000,
    protein: profile.targetProtein || 120,
    carbs: profile.targetCarbs || 200,
    fat: profile.targetFat || 60,
    water: 8
  };

  // Calculate totals
  const totals = loggedMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const exerciseCalories = exercises.reduce((acc, e) => acc + (e.calories || 0), 0);
  const netCalories = Math.max(0, totals.calories - exerciseCalories);

  const handleSaveMeal = async (meal) => {
    await db.meals.add(meal);
  };

  const getProgressWidth = (current, goal) => {
    return Math.min((current / goal) * 100, 100) + '%';
  };

  const handleAddExercise = async (activityData) => {
    await db.exercise.add(activityData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-leanly-background p-6 relative pb-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 mt-2 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm border border-leanly-border flex-shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-leanly-200 flex items-center justify-center text-leanly-primary font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'L'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm text-leanly-text-secondary font-medium">Hi, {profile.name || 'Friend'}</h2>
            <p className="text-lg text-leanly-text-primary font-semibold tracking-tight">Welcome Back</p>
          </div>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-leanly-border text-leanly-text-secondary active:scale-95 transition-transform">
          <Bell size={20} />
        </button>
      </header>

      {/* Main Heading */}
      <h1 className="text-[32px] leading-tight font-bold text-leanly-text-primary mb-6 animate-fade-in" style={{animationDelay: '100ms'}}>
        Today's Nutritious<br />Meal Ideas
      </h1>

      {/* Search */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in" style={{animationDelay: '150ms'}}>
        <div className="flex-1 bg-white rounded-full flex items-center px-4 py-3 shadow-sm border border-transparent focus-within:border-leanly-primary transition-colors">
          <Search size={20} className="text-leanly-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search Recipes..." 
            className="flex-1 bg-transparent border-none outline-none text-leanly-text-primary placeholder:text-leanly-text-muted text-base"
          />
        </div>
        <button className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-sm border border-leanly-border text-leanly-text-primary active:scale-95 transition-transform shrink-0">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Nutrition Dashboard */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5 animate-fade-in" style={{animationDelay: '200ms'}}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-leanly-text-primary leading-tight">Daily Intake<br/>Ratio</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsActivityModalOpen(true)} className="flex flex-col items-center justify-center bg-[#E8F5E3] text-[#3A9900] font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-transform">
              <span className="text-xs">+ Activity</span>
            </button>
            <div className="text-right flex items-baseline gap-1">
              <span className="font-bold text-[#3A9900] text-lg leading-tight whitespace-nowrap">{netCalories} / {goals.calories} kcal</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5 mt-2">
          {/* Protein */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-0.5">
              <span>Protein</span>
              <span className="text-gray-700">{totals.protein}g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{width: getProgressWidth(totals.protein, goals.protein)}}></div>
            </div>
          </div>
          
          {/* Carbs */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-0.5">
              <span>Carbs</span>
              <span className="text-gray-700">{totals.carbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{width: getProgressWidth(totals.carbs, goals.carbs)}}></div>
            </div>
          </div>

          {/* Fat */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-0.5">
              <span>Fat</span>
              <span className="text-gray-700">{totals.fat}g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-700" style={{width: getProgressWidth(totals.fat, goals.fat)}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Activity */}
      <div className="bg-[#121212] rounded-3xl p-5 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border border-[#1e1e1e] mt-4 mb-2" onClick={() => setIsActivityModalOpen(true)}>
        <div className="flex justify-between items-center bg-black text-white px-3 py-1.5 rounded-full w-max mb-3 shadow-sm border border-[#333]">
          <Flame size={14} className="text-orange-500 mr-2" />
          <span className="text-xs font-medium">Suggested Activity</span>
        </div>
        <div className="relative z-10 pr-12">
          <h3 className="font-bold text-white text-lg leading-tight mb-1">30-Min Brisk Walk</h3>
          <p className="text-sm text-gray-400 font-medium">Burns ~150 kcal • Perfect after a meal</p>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 bg-leanly-primary rounded-full flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-110">
          <Plus size={20} strokeWidth={3} />
        </div>
      </div>

      {/* Logged Meals / Featured Meal Card */}
      {loggedMeals.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <h2 className="font-bold text-leanly-text-primary text-xl mb-4">Logged Today</h2>
          <div className="flex flex-col gap-3">
            {loggedMeals.map(meal => (
              <div key={meal.id} className="bg-[#E8F5E3] rounded-3xl p-4 shadow-soft">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-leanly-primary uppercase tracking-wider">{meal.type}</span>
                  <span className="font-bold text-leanly-text-primary">{meal.calories} kcal</span>
                </div>
                <h3 className="font-bold text-leanly-text-primary text-lg mb-1">{meal.name}</h3>
                <p className="text-xs text-leanly-text-secondary">P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loggedMeals.length === 0 && (
        <div className="bg-[#E8F5E3] rounded-3xl p-5 mb-8 shadow-soft relative overflow-hidden animate-fade-in" style={{animationDelay: '250ms'}}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full pr-4 pl-1 py-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-lg">🍳</span>
              </div>
              <span className="font-semibold text-leanly-text-primary text-sm">Breakfast Suggestion</span>
            </div>
            <span className="font-bold text-leanly-text-primary">945 <span className="text-xs font-normal text-leanly-text-secondary">kcal</span></span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-bold text-leanly-text-primary text-lg mb-1">Hard-Boiled Egg & Oatmeal</h3>
              <p className="text-sm text-leanly-text-secondary">280 kcal • 1 egg • 1 bowl</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95 transition-transform shrink-0 hover:bg-leanly-50"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-leanly-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40 hover:bg-green-600"
      >
        <Plus size={28} />
      </button>

      <LogMealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMeal}
      />

      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleAddExercise}
      />
    </div>
  )
}
