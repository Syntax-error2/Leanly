import { useState } from 'react';
import { X, Activity, Flame, Clock } from 'lucide-react';

export default function AddActivityModal({ isOpen, onClose, onSave }) {
  const [activity, setActivity] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!activity || !calories) return;
    onSave({
      type: activity,
      duration: Number(duration) || 0,
      calories: Number(calories),
      date: new Date().toISOString()
    });
    setActivity('');
    setCalories('');
    setDuration('');
    onClose();
  };

  const quickActivities = [
    { name: 'Running', cals: 300, icon: '🏃‍♂️' },
    { name: 'Cycling', cals: 250, icon: '🚴‍♀️' },
    { name: 'Weightlifting', cals: 200, icon: '🏋️‍♂️' },
    { name: 'Yoga', cals: 150, icon: '🧘‍♀️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full rounded-t-[2rem] p-6 pb-12 shadow-2xl relative animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-leanly-text-primary flex items-center gap-2">
            <Activity className="text-leanly-primary" /> Log Activity
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Select */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4 -mx-2 px-2">
          {quickActivities.map((qa, i) => (
            <button
              key={i}
              onClick={() => { setActivity(qa.name); setCalories(qa.cals.toString()); setDuration('30'); }}
              className="flex-shrink-0 bg-leanly-background border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-w-[100px] active:scale-95 transition-transform"
            >
              <span className="text-2xl">{qa.icon}</span>
              <span className="text-xs font-semibold text-leanly-text-primary">{qa.name}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-leanly-text-secondary mb-1 uppercase tracking-wider">Activity Name</label>
            <input 
              type="text" 
              placeholder="e.g. 5km Run"
              className="w-full bg-leanly-background rounded-2xl px-5 py-4 text-leanly-text-primary font-medium outline-none border border-transparent focus:border-leanly-primary"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-leanly-text-secondary mb-1 uppercase tracking-wider flex items-center gap-1"><Flame size={14}/> Calories</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-leanly-background rounded-2xl px-5 py-4 text-leanly-text-primary font-medium outline-none border border-transparent focus:border-leanly-primary"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-leanly-text-secondary mb-1 uppercase tracking-wider flex items-center gap-1"><Clock size={14}/> Mins</label>
              <input 
                type="number" 
                placeholder="30"
                className="w-full bg-leanly-background rounded-2xl px-5 py-4 text-leanly-text-primary font-medium outline-none border border-transparent focus:border-leanly-primary"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button 
          onClick={handleSubmit}
          disabled={!activity || !calories}
          className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft active:scale-95 transition-transform mt-8 disabled:opacity-50"
        >
          Save Activity
        </button>

      </div>
    </div>
  );
}
