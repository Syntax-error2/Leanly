import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/setup-profile', { state: { name } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-leanly-background p-6">
      <header className="flex justify-between items-center mb-6 mt-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="flex flex-col items-start mb-8">
        <h1 className="text-[32px] font-bold text-leanly-text-primary leading-tight mb-2">Create Account</h1>
        <p className="text-leanly-text-secondary">Start your journey to a healthier you.</p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-5 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User size={20} className="text-leanly-text-muted" />
          </div>
          <input 
            type="text" 
            placeholder="Full Name"
            className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary placeholder:text-leanly-text-muted"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail size={20} className="text-leanly-text-muted" />
          </div>
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary placeholder:text-leanly-text-muted"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock size={20} className="text-leanly-text-muted" />
          </div>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="••••••••"
            className="w-full bg-white rounded-2xl pl-12 pr-12 py-4 shadow-sm border border-transparent focus:border-leanly-primary outline-none text-leanly-text-primary placeholder:text-leanly-text-muted"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-leanly-text-muted hover:text-leanly-text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button 
          type="submit"
          className="w-full bg-leanly-primary text-white py-4 rounded-[2rem] font-bold text-lg shadow-soft transition-transform active:scale-95 mt-4"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-auto text-center pb-8 safe-area-pb">
        <p className="text-leanly-text-secondary">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-leanly-primary font-bold">Sign In</button>
        </p>
      </div>
    </div>
  );
}
