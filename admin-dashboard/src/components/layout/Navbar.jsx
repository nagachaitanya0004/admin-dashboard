import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Navbar({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    return theme !== 'light';
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.substring(1).split('/')[0];
    if (!path || path === 'dashboard') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };


  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    // Note: DOM manipulation for light mode omitted since default is pure dark
  };

  return (
    <header className="h-16 shrink-0 bg-[#0c0c11]/80 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white tracking-tight">{getPageTitle()}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg text-slate-400 transition-colors w-48 lg:w-64">
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-sm">Search...</span>
            <span className="ml-auto text-xs font-mono bg-white/10 px-1.5 rounded text-slate-300">⌘K</span>
          </button>

          <button className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0c0c11]" />
          </button>

          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative ml-2">
            <button 
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-white/[0.04] rounded-full border border-transparent hover:border-white/[0.06] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[#111118] border border-white/[0.08] rounded-xl shadow-glass-glow shadow-glass-edge py-1 z-50 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                  <div className="px-4 py-3 border-b border-white/[0.04]">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
