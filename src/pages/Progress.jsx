import { useState, useEffect, useMemo } from 'react';
import { Target, TrendingDown, ArrowLeft, Activity, Flame, Weight, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import AddActivityModal from '../components/AddActivityModal';

export default function Progress() {
  const [activeTab, setActiveTab] = useState('Week');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const userProfile = useLiveQuery(() => db.userProfile.toCollection().first());
  const progressLogs = useLiveQuery(() => db.progress.orderBy('date').toArray()) || [];
  const mealsLogs = useLiveQuery(() => db.meals.toArray()) || [];
  const exerciseLogs = useLiveQuery(() => db.exercise.toArray()) || [];
  
  const targetWeight = userProfile?.targetWeight || 60;
  const currentWeight = userProfile?.weight || 65;
  const startingWeight = progressLogs.length > 0 ? progressLogs[0].weight : currentWeight;
  
  // Calculate percentage
  const totalToLose = Math.abs(startingWeight - targetWeight) || 1; // avoid div/0
  const lostSoFar = Math.abs(startingWeight - currentWeight);
  let progressPercent = Math.min(Math.round((lostSoFar / totalToLose) * 100), 100);
  if (currentWeight === targetWeight) progressPercent = 100;
  
  // Dynamic Weekly Data calculation
  const weeklyData = useMemo(() => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date();
    const result = [];
    
    // Go back 7 days
    let maxCal = 1; // avoid div/0
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toDateString();
      
      const calsConsumed = mealsLogs
        .filter(m => new Date(m.date).toDateString() === dateString)
        .reduce((acc, m) => acc + (m.calories || 0), 0);
        
      const calsBurned = exerciseLogs
        .filter(e => new Date(e.date).toDateString() === dateString)
        .reduce((acc, e) => acc + (e.calories || 0), 0);
        
      const netCals = Math.max(0, calsConsumed - calsBurned);
        
      if (netCals > maxCal) maxCal = netCals;
      
      result.push({
        day: days[d.getDay()],
        raw: netCals,
        active: i === 0, // today is active
        label: `${netCals} kcal`
      });
    }
    
    // Map to percentage height based on max calories in the week, or target calories
    const targetCal = userProfile?.targetCalories || 2000;
    const denominator = Math.max(maxCal, targetCal);
    
    return result.map(r => ({
      ...r,
      val: Math.max(5, Math.min((r.raw / denominator) * 100, 100)) // at least 5% height for visibility
    }));
    
  }, [mealsLogs, exerciseLogs, userProfile]);

  if (!userProfile) return <div className="p-6">Loading progress...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-leanly-background">
      <header className="p-6 pt-10">
        <h1 className="text-[28px] font-bold text-leanly-text-primary">Your progress</h1>
      </header>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-leanly-text-secondary mb-1">Current Weight</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-leanly-text-primary tracking-tight">{currentWeight}</span>
              <span className="text-lg font-bold text-gray-400">kg</span>
            </div>
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#3a9d23" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                strokeLinecap="round" 
              />
            </svg>
            <span className="absolute text-sm font-bold text-leanly-text-primary">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="px-6 flex gap-4 mb-6">
        <div className="flex-1 bg-leanly-100 rounded-3xl p-5">
          <div className="flex items-center gap-1.5 mb-2 text-leanly-primary">
            <TrendingDown size={18} strokeWidth={2.5} />
            <span className="font-bold text-sm">Lost</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-leanly-text-primary">{lostSoFar}</span>
            <span className="text-sm font-bold text-gray-500">kg</span>
          </div>
        </div>
        
        <div className="flex-1 bg-red-50 rounded-3xl p-5">
          <div className="flex items-center gap-1.5 mb-2 text-red-400">
            <Target size={18} strokeWidth={2.5} />
            <span className="font-bold text-sm">Goal</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-leanly-text-primary">{targetWeight}</span>
            <span className="text-sm font-bold text-gray-500">kg</span>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-leanly-text-primary">Recent Activity</h2>
            <button 
              onClick={() => setIsActivityModalOpen(true)} 
              className="text-sm font-bold text-leanly-primary bg-leanly-100 px-4 py-2 rounded-full active:scale-95 transition-transform"
            >
              Log Activity
            </button>
          </div>
          
          <div className="flex bg-gray-50 rounded-2xl p-1 mb-8">
            {['Week', 'Month', 'Year'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-leanly-primary text-white shadow-sm' : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Line Chart */}
          <div className="relative w-full h-40 mt-6 mb-2">
            <svg viewBox="0 -10 300 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3A9900" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3A9900" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {(() => {
                const points = weeklyData.map((d, i) => [i * 50, 100 - d.val]);
                let pathD = `M ${points[0][0]} ${points[0][1]}`;
                for (let i = 0; i < points.length - 1; i++) {
                  const p0 = points[i];
                  const p1 = points[i+1];
                  const cp1x = p0[0] + 25;
                  const cp2x = p1[0] - 25;
                  pathD += ` C ${cp1x} ${p0[1]}, ${cp2x} ${p1[1]}, ${p1[0]} ${p1[1]}`;
                }
                const fillD = `${pathD} L 300 100 L 0 100 Z`;

                return (
                  <>
                    <path d={fillD} fill="url(#lineGradient)" />
                    <path d={pathD} fill="none" stroke="#3A9900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (
                      <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke="#3A9900" strokeWidth="2" />
                    ))}
                  </>
                );
              })()}
            </svg>
            
            {/* Tooltip for active day */}
            {weeklyData.map((d, i) => d.active && (
              <div 
                key={i} 
                className="absolute bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md z-10 animate-fade-in -translate-x-1/2"
                style={{ left: `${(i / 6) * 100}%`, top: `${(100 - d.val)}%`, marginTop: '-35px' }}
              >
                {d.label}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 px-1">
            {weeklyData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>
      </div>

      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)} 
        onSave={async (activityData) => {
          await db.exercise.add(activityData);
        }}
      />
    </div>
  );
}
