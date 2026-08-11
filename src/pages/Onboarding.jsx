import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: "Meet Leanly",
    description: "Your personal nutrition companion.",
  },
  {
    title: "Eat With Purpose",
    description: "Personalized meals designed around your goals, preferences, and lifestyle.",
  },
  {
    title: "Prepare Smarter",
    description: "Plan your meals, organize your groceries, and make meal prep easier.",
  },
  {
    title: "Track Your Progress",
    description: "Build healthier habits and understand your progress over time.",
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentSlide(slides.length - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-leanly-background p-6 pt-12">
      <div className="flex justify-end mb-8 h-10">
        {currentSlide < slides.length - 1 && (
          <button onClick={handleSkip} className="text-leanly-text-secondary font-medium px-4 py-2 active:opacity-70">
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center mt-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft">
            <img src="/logo.png" alt="Leanly Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-leanly-text-primary">
            Leanly
          </h1>
          <p className="text-xl text-leanly-text-secondary font-medium tracking-wide">
            Eat Smart. Feel Light. Live Better.
          </p>
        </div>
        
        <div key={currentSlide} className="animate-fade-in flex flex-col items-center w-full mt-10">
          <h2 className="text-3xl font-bold text-center text-leanly-text-primary mb-4 tracking-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-center text-leanly-text-secondary text-lg px-4 mb-12 h-20 max-w-sm">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-leanly-primary' : 'w-2 bg-leanly-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pb-12 px-4 w-full">
        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={handleNext}
            className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft transition-transform active:scale-95"
          >
            Next
          </button>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft transition-transform active:scale-95"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-white text-leanly-text-primary py-4 rounded-[2rem] font-bold text-lg shadow-soft border border-transparent transition-transform active:scale-95"
            >
              I Already Have an Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
