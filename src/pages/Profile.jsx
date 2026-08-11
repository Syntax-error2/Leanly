import { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, ChevronRight, Info, Heart, Award, ChevronLeft, Edit2, Camera, X, Moon, Sun, Mail } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export default function Profile() {
  const fileInputRef = useRef(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const userProfile = useLiveQuery(() => db.userProfile.toCollection().first());
  const favorites = useLiveQuery(() => db.favorites.toArray()) || [];
  const achievements = useLiveQuery(() => db.achievements.toArray()) || [];

  useEffect(() => {
    // Seed achievements if empty or if duplicates exist
    const seedAchievements = async () => {
      const existing = await db.achievements.toArray();
      const firstMealCount = existing.filter(a => a.title === "First Meal Logged!").length;
      
      if (existing.length === 0 || firstMealCount > 1) { 
        await db.achievements.clear();
        await db.achievements.bulkAdd([
          { title: "First Meal Logged!", icon: "🍽️", dateUnlocked: new Date().toLocaleDateString() },
          { title: "Set a Goal", icon: "🎯", dateUnlocked: new Date().toLocaleDateString() },
          { title: "Profile Completed", icon: "👤", dateUnlocked: new Date().toLocaleDateString() }
        ]);
      }
    };
    seedAchievements();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSignOut = async () => {
    await db.userProfile.clear();
    await db.meals.clear();
    await db.progress.clear();
    await db.prepTasks.clear();
    window.location.href = "/onboarding";
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await db.userProfile.update(userProfile.id, { avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditName = async () => {
    const newName = window.prompt("Enter your new name:", userProfile.name);
    if (newName && newName.trim() !== "") {
      await db.userProfile.update(userProfile.id, { name: newName.trim() });
    }
  };

  const menuItems = [
    { icon: <Heart size={20} />, label: 'Favorites', badge: favorites.length > 0 ? favorites.length.toString() : null },
    { icon: <Award size={20} />, label: 'Achievements', badge: achievements.length > 0 ? achievements.length.toString() : null },
    { icon: <Settings size={20} />, label: 'Settings', badge: null },
    { icon: <Info size={20} />, label: 'Help & Support', badge: null },
  ];

  if (!userProfile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-leanly-background">
      <header className="flex justify-between items-center p-6 pt-10">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <button onClick={handleEditName} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95">
          <Edit2 size={20} />
        </button>
      </header>

      <div className="px-6 flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-soft overflow-hidden bg-leanly-100">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-leanly-primary text-3xl font-bold">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 bg-leanly-primary rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={14} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <h1 className="text-2xl font-bold text-leanly-text-primary mb-1">{userProfile.name}</h1>
        <p className="text-sm font-semibold text-leanly-primary px-3 py-1 bg-leanly-primary/10 rounded-full">
          {userProfile.goal}
        </p>
      </div>

      <div className="px-6 flex gap-4 mb-8">
        <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center">
          <p className="text-sm text-leanly-text-secondary font-medium mb-1">Target</p>
          <p className="text-xl font-bold text-leanly-text-primary">{userProfile.targetWeight || 60} <span className="text-sm font-semibold text-gray-400">kg</span></p>
        </div>
        <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center">
          <p className="text-sm text-leanly-text-secondary font-medium mb-1">Current</p>
          <p className="text-xl font-bold text-leanly-text-primary">{userProfile.weight} <span className="text-sm font-semibold text-gray-400">kg</span></p>
        </div>
        <div className="flex-1 bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center">
          <p className="text-sm text-leanly-text-secondary font-medium mb-1">Age</p>
          <p className="text-xl font-bold text-leanly-text-primary">{userProfile.age}</p>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-white rounded-3xl p-2 shadow-sm">
          {menuItems.map((item, idx) => (
            <div 
              key={idx}
              className={`flex items-center p-4 active:bg-gray-50 cursor-pointer transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
              onClick={() => setModalTitle(item.label)}
            >
              <div className="w-10 h-10 rounded-2xl bg-leanly-background flex items-center justify-center text-leanly-primary mr-4">
                {item.icon}
              </div>
              <span className="font-semibold text-leanly-text-primary flex-1">{item.label}</span>
              
              {item.badge && (
                <span className="px-2 py-1 bg-leanly-primary text-white text-xs font-bold rounded-lg mr-3">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6">
        <button onClick={handleSignOut} className="w-full bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center gap-2 text-red-500 font-bold active:scale-95 transition-transform">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
      
      {/* Coming Soon Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full rounded-t-[2rem] p-6 pb-12 animate-slide-up shadow-2xl relative">
            <button 
              onClick={() => setModalTitle(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-leanly-100 rounded-2xl flex items-center justify-center text-leanly-primary mb-4 mt-2">
              <Info size={24} />
            </div>
            {modalTitle === 'Favorites' && (
              <div className="mt-4 flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
                {favorites.length === 0 ? (
                   <p className="text-center text-leanly-text-secondary">No favorites yet. Add them from the Meals tab!</p>
                ) : (
                  favorites.map(fav => (
                    <div key={fav.id} className="bg-leanly-background p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-leanly-text-primary">{fav.title}</h4>
                        <p className="text-xs text-leanly-text-secondary">{fav.calories} kcal • {fav.category}</p>
                      </div>
                      <Heart size={20} className="text-red-500 fill-red-500" />
                    </div>
                  ))
                )}
              </div>
            )}
            {modalTitle === 'Achievements' && (
              <div className="mt-4 flex flex-col gap-3">
                {achievements.map(a => (
                  <div key={a.id} className="bg-[#FFF8E7] p-4 rounded-2xl flex items-center gap-4">
                     <span className="text-3xl">{a.icon}</span>
                     <div>
                       <h4 className="font-bold text-leanly-text-primary">{a.title}</h4>
                       <p className="text-xs text-gray-500">Unlocked: {a.dateUnlocked}</p>
                     </div>
                  </div>
                ))}
              </div>
            )}
            {modalTitle === 'Settings' && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="bg-leanly-background p-4 rounded-2xl flex justify-between items-center cursor-pointer" onClick={toggleDarkMode}>
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={20} className="text-leanly-primary" /> : <Sun size={20} className="text-leanly-primary" />}
                    <span className="font-bold text-leanly-text-primary">Dark Mode</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-leanly-primary' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
              </div>
            )}
            {modalTitle === 'Help & Support' && (
              <div className="mt-4 text-center">
                <p className="text-leanly-text-secondary mb-4">Need help? We're here for you.</p>
                <button className="bg-leanly-primary text-white font-bold py-3 px-6 rounded-full w-full flex justify-center items-center gap-2">
                  <Mail size={18} /> Contact Us
                </button>
              </div>
            )}


            <button 
              onClick={() => setModalTitle(null)}
              className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft active:scale-95 transition-transform mt-8"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
