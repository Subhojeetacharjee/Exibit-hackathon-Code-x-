import { Activity, User, LogOut, ChevronDown, Sparkles, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/find-specialist', label: 'Find Specialist' },
    { path: '/clinics', label: 'Nearby Clinics' },
    { path: '/history', label: 'History' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-black/90 backdrop-blur-xl shadow-soft border-b border-primary-500/10'
        : 'bg-black/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2.5 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/40">
              <Activity className="h-5 w-5 text-black" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-white tracking-tight leading-none">MediMap</span>
              <span className="text-[10px] font-semibold text-primary-500 tracking-widest uppercase text-glow">Health Navigator</span>
            </div>
          </Link>
          
          {/* Desktop Navigation — hidden behind toggle */}
          <div className="flex items-center gap-3">
            {/* Auth / User Menu (always visible) */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-primary-500/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black font-bold text-sm ring-2 ring-black shadow-sm shadow-primary-500/20">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-sm text-gray-300">{user.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#0a0a0a] rounded-2xl shadow-elevated border border-primary-500/10 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <p className="text-xs text-primary-500/60 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-primary-500/5 hover:text-primary-400 rounded-xl transition-colors text-sm"
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/5 rounded-xl transition-colors text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-500 hover:text-primary-400 font-semibold transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.04] transition-all duration-300 group border border-white/[0.06]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              <Sun className={`h-4.5 w-4.5 text-amber-400 absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <Moon className={`h-4.5 w-4.5 text-primary-400 absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </button>

            {/* Hamburger Menu Button — always visible */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.04] transition-colors group border border-white/[0.06]"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center w-5 h-5">
                <span className={`block h-0.5 w-5 rounded-full bg-gray-400 group-hover:bg-primary-400 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`block h-0.5 w-5 rounded-full bg-gray-400 group-hover:bg-primary-400 transition-all duration-300 mt-[5px] ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 w-5 rounded-full bg-gray-400 group-hover:bg-primary-400 transition-all duration-300 mt-[5px] ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Panel — slides down on toggle */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-5 pt-3 border-t border-white/[0.06]">
            {/* Nav Links */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2 sm:bg-white/[0.03] sm:rounded-full sm:p-1 sm:border sm:border-white/[0.06] sm:mx-auto sm:w-fit mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-gray-500 hover:text-primary-400 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons (shown only if not logged in) */}
            {!user && (
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/[0.06]">
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-black rounded-full text-sm font-bold transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Quick actions for logged-in users */}
            {user && (
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/[0.06]">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:bg-primary-500/5 hover:text-primary-400 rounded-xl text-sm font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/5 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
