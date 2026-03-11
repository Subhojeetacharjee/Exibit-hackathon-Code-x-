import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      // Look up registered user by email
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const matchedUser = registeredUsers.find(u => u.email === formData.email);
      
      localStorage.setItem('user', JSON.stringify({
        name: matchedUser ? matchedUser.name : formData.email.split('@')[0],
        email: formData.email,
        phone: matchedUser ? matchedUser.phone : '',
        avatar: matchedUser ? matchedUser.avatar : null,
      }));
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="bg-primary-500 p-3 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
              <Activity className="h-7 w-7 text-black" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold text-white tracking-tight block">MediMap</span>
              <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-widest">Health Navigator</span>
            </div>
          </Link>
          <p className="mt-4 text-gray-400 text-sm">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#050505]/90 backdrop-blur-xl rounded-3xl shadow-card p-8 border border-white/[0.06]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-white/[0.08] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-white/[0.03] text-gray-200 placeholder-gray-600 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-white/[0.08] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-white/[0.03] text-gray-200 placeholder-gray-600 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-bold">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-400 disabled:from-gray-600 disabled:to-gray-600 text-black py-3.5 rounded-2xl font-bold text-sm transition-all disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#050505] text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border border-white/[0.06] rounded-2xl hover:bg-[#0a0a0a] transition-colors hover:shadow-soft">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              <span className="text-sm font-bold text-gray-300">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-white/[0.06] rounded-2xl hover:bg-[#0a0a0a] transition-colors hover:shadow-soft">
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4" />
              <span className="text-sm font-bold text-gray-300">Facebook</span>
            </button>
          </div>
        </div>

        {/* Skip for now */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-5 py-3 text-gray-500 hover:text-gray-300 text-sm font-semibold transition-colors rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06]"
        >
          Skip for now →
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-4 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-bold">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
