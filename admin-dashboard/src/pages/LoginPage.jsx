import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, Zap, BarChart3, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  // To handle the 1.5s forced delay required
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      if (validateEmail(e.target.value)) {
        setEmailError('');
      }
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400); // match animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) {
      triggerShake();
      return;
    }

    setIsSubmitLoading(true);
    
    try {
      // Create artificial delay for 1.5s total (Zustand takes 800ms)
      const start = Date.now();
      await login(email, password);
      const elapsed = Date.now() - start;
      const remainingTime = Math.max(0, 1500 - elapsed);
      
      setTimeout(() => {
        setIsSubmitLoading(false);
        navigate('/dashboard');
      }, remainingTime);

    } catch (err) {
      setTimeout(() => {
        setIsSubmitLoading(false);
        setError(err.message || 'Invalid credentials');
        triggerShake();
      }, 700); // Add remaining time to make it ~1.5s total if failed early
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col lg:flex-row font-sans text-slate-100 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Animated Gradient Mesh Background */}
        <div 
          className="absolute inset-0 opacity-20 bg-[linear-gradient(-45deg,#4f46e5,#10b981,#020617,#f43f5e)] bg-[length:400%_400%] animate-gradient mix-blend-screen pointer-events-none"
        />
        
        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Nexus<span className="text-primary">.io</span></span>
        </div>

        {/* Middle: Tagline & Features */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight text-white mb-6">
            Intelligent operations, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              simplified.
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Experience our next-generation admin dashboard designed for extreme performance and pixel-perfect aesthetics.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Real-time Analytics</h3>
                <p className="text-sm text-slate-400">Lightning fast data processing.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Enterprise Security</h3>
                <p className="text-sm text-slate-400">Bank-grade encryption standard.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Advanced Reporting</h3>
                <p className="text-sm text-slate-400">Customized visual insights.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10 text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Nexus Corporation. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Mobile Animated Background (only visible on small screens) */}
        <div 
          className="absolute inset-0 opacity-10 bg-[linear-gradient(-45deg,#4f46e5,#10b981,#020617,#f43f5e)] bg-[length:400%_400%] animate-gradient lg:hidden pointer-events-none"
        />

        {/* Form Card */}
        <div className={cn(
          "w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 opacity-0 animate-fade-up",
          isShaking && "animate-shake"
        )}>
          
          {/* Mobile Logo Header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nexus<span className="text-primary">.io</span></span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Please sign in to continue to your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Global Error Toast */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-medium animate-fade-up" style={{ animationDuration: '0.3s' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={cn(
                    "block w-full pl-11 pr-4 py-3 bg-[#111118] border rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300",
                    emailError ? "border-rose-500/50 focus:border-rose-500" : "border-white/5 focus:border-primary"
                  )}
                  placeholder="admin@nexus.io"
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-rose-400 ml-1 font-medium">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-[#111118] border border-white/5 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-white/10 bg-[#111118] text-primary focus:ring-primary/50 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-indigo-400 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitLoading}
              className={cn(
                "w-full h-12 mt-2 flex justify-center items-center rounded-xl text-sm font-semibold text-white transition-all duration-300",
                "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-primary",
                "shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-[1.02]",
                isSubmitLoading ? "opacity-80 cursor-not-allowed transform-none" : ""
              )}
            >
              {isSubmitLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <p className="text-xs text-slate-400 font-medium">
              Demo: <span className="text-slate-200">admin@nexus.io</span> / <span className="text-slate-200">nexus2024</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
