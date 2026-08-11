import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Activity, Target } from 'lucide-react';
import { db } from '../db/db';

export default function SetupProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: location.state?.name || '', 
    gender: 'Female',
    age: '',
    weight: '',
    height: '',
    targetWeight: '',
    goal: 'Maintain' // Lose Weight, Maintain, Build Muscle
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleComplete = async () => {
    // Basic BMR Calculation (Mifflin-St Jeor)
    const weight = Number(formData.weight) || 65; // kg
    const height = Number(formData.height) || 165; // cm
    const age = Number(formData.age) || 25;
    
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = formData.gender === 'Male' ? bmr + 5 : bmr - 161;

    // TDEE estimate (Light activity multiplier 1.375)
    let tdee = bmr * 1.375;

    // Adjust for goals
    if (formData.goal === 'Lose Weight') tdee -= 500;
    if (formData.goal === 'Build Muscle') tdee += 300;

    const targetCalories = Math.round(tdee);
    
    // Macro split based on goal
    let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
    if (formData.goal === 'Lose Weight') { pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; }
    if (formData.goal === 'Build Muscle') { pRatio = 0.3; cRatio = 0.5; fRatio = 0.2; }

    const targetProtein = Math.round((targetCalories * pRatio) / 4);
    const targetCarbs = Math.round((targetCalories * cRatio) / 4);
    const targetFat = Math.round((targetCalories * fRatio) / 9);

    await db.userProfile.clear(); // Ensure only 1 active profile
    await db.userProfile.add({
      ...formData,
      targetWeight: Number(formData.targetWeight) || weight, // fallback to current weight if empty
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat
    });

    // Record initial weight in progress
    await db.progress.clear();
    await db.progress.add({
      weight: weight,
      date: new Date().toISOString()
    });

    navigate('/app');
  };

  return (
    <div className="flex flex-col min-h-screen bg-leanly-background p-6">
      <header className="flex justify-between items-center mb-8 mt-4">
        <button 
          onClick={handleBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-leanly-primary' : 'w-2 bg-leanly-200'}`} />
          ))}
        </div>
      </header>

      <div className="flex-1 animate-fade-in">
        {step === 1 && (
          <div className="flex flex-col h-full animate-fade-in">
            <h1 className="text-[32px] font-bold text-leanly-text-primary leading-tight mb-2">Let's get to<br/>know you</h1>
            <p className="text-leanly-text-secondary mb-10">This helps us calculate your daily nutritional needs.</p>

            <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">What should we call you?</label>
            <input 
              type="text" 
              placeholder="Your Name"
              className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary text-lg mb-6"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />

            <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">Biological Gender</label>
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setFormData({...formData, gender: 'Male'})}
                className={`flex-1 py-4 rounded-2xl font-bold transition-colors ${formData.gender === 'Male' ? 'bg-leanly-primary text-white shadow-soft' : 'bg-white text-leanly-text-secondary border border-transparent'}`}
              >Male</button>
              <button 
                onClick={() => setFormData({...formData, gender: 'Female'})}
                className={`flex-1 py-4 rounded-2xl font-bold transition-colors ${formData.gender === 'Female' ? 'bg-leanly-primary text-white shadow-soft' : 'bg-white text-leanly-text-secondary border border-transparent'}`}
              >Female</button>
            </div>

            <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">Age (Years)</label>
            <input 
              type="number" 
              placeholder="25"
              className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary text-lg mb-4"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full animate-fade-in">
            <h1 className="text-[32px] font-bold text-leanly-text-primary leading-tight mb-2">Your Body<br/>Metrics</h1>
            <p className="text-leanly-text-secondary mb-10">Accurate metrics give you the best meal recommendations.</p>

            <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">Weight (kg)</label>
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Activity size={20} className="text-leanly-text-muted" />
              </div>
              <input 
                type="number" 
                placeholder="65"
                className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary text-lg"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">Height (cm)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Target size={20} className="text-leanly-text-muted" />
              </div>
              <input 
                type="number" 
                placeholder="165"
                className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary text-lg"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full animate-fade-in">
            <h1 className="text-[32px] font-bold text-leanly-text-primary leading-tight mb-2">What is your<br/>main goal?</h1>
            <p className="text-leanly-text-secondary mb-10">We'll adjust your macros to achieve this.</p>

            <div className="flex flex-col gap-4">
              {['Lose Weight', 'Maintain', 'Build Muscle'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setFormData({...formData, goal})}
                  className={`w-full flex items-center p-5 rounded-[2rem] transition-all duration-300 ${
                    formData.goal === goal 
                      ? 'bg-leanly-primary text-white shadow-soft scale-[1.02]' 
                      : 'bg-white text-leanly-text-primary border border-transparent'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${formData.goal === goal ? 'bg-white/20' : 'bg-leanly-background text-leanly-primary'}`}>
                    {goal === 'Lose Weight' ? <Activity size={24} /> : <Target size={24} />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{goal}</h3>
                    <p className={`text-sm ${formData.goal === goal ? 'text-white/80' : 'text-leanly-text-secondary'}`}>
                      {goal === 'Lose Weight' ? 'Reduce body fat and lean out.' : goal === 'Maintain' ? 'Keep current weight and stay healthy.' : 'Increase muscle mass and strength.'}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {formData.goal !== 'Maintain' && (
              <div className="mt-6 animate-fade-in">
                <label className="block text-sm font-semibold text-leanly-text-primary mb-2 px-1">Target Weight (kg)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Target size={20} className="text-leanly-text-muted" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="e.g. 60"
                    className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary text-lg"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({...formData, targetWeight: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        disabled={step === 1 && (!formData.gender || !formData.age || !formData.name) || step === 2 && (!formData.weight || !formData.height)}
        className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft transition-transform active:scale-95 mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
      >
        {step === 3 ? 'Generate My Plan' : 'Continue'} <ArrowRight size={20} />
      </button>
    </div>
  );
}
