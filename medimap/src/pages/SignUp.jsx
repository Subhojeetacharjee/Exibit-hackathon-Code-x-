import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check, Calendar, Heart } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    healthHistory: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      const userData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        healthHistory: formData.healthHistory,
        avatar: null,
        profileComplete: false,
      };
      // Save to registered users list
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingIndex = registeredUsers.findIndex(u => u.email === formData.email);
      if (existingIndex >= 0) {
        registeredUsers[existingIndex] = userData;
      } else {
        registeredUsers.push(userData);
      }
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      navigate('/profile');
    }, 1500);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const { strength, label, color } = passwordStrength();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

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
          <p className="mt-4 text-gray-400 text-sm">Create your account to get started</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-[#050505]/90 backdrop-blur-xl rounded-3xl shadow-card p-8 border border-white/[0.06]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 border ${errors.fullName ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 border ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={`w-full pl-11 pr-4 py-3 border ${errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Age Field */}
              <div>
                <label htmlFor="age" className="block text-sm font-bold text-gray-300 mb-1.5">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="1"
                    max="120"
                    className={`w-full pl-11 pr-4 py-3 border ${errors.age ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                  />
                </div>
                {errors.age && <p className="text-red-500 text-xs mt-1 font-medium">{errors.age}</p>}
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="block text-sm font-bold text-gray-300 mb-1.5">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200`}
                >
                  <option value="" disabled className="bg-[#050505]">Select</option>
                  <option value="Male" className="bg-[#050505]">Male</option>
                  <option value="Female" className="bg-[#050505]">Female</option>
                  <option value="Other" className="bg-[#050505]">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gender}</p>}
              </div>
            </div>

            {/* Health History Field */}
            <div>
              <label htmlFor="healthHistory" className="block text-sm font-bold text-gray-300 mb-1.5">
                <Heart className="inline h-4 w-4 mr-1.5 text-gray-500" />
                Current / Past Health Conditions
                <span className="text-gray-600 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                id="healthHistory"
                name="healthHistory"
                value={formData.healthHistory}
                onChange={handleChange}
                placeholder="e.g. Diabetes, Asthma, Allergies, Recent surgery..."
                rows={3}
                className="w-full px-4 py-3 border border-white/[0.08] bg-white/[0.03] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600 resize-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-12 py-3 border ${errors.password ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= strength ? color : 'bg-[#0a0a0a]'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Strength: <span className="text-gray-300">{label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] bg-white/[0.03]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-200 placeholder-gray-600`}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300 font-bold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-400 hover:text-primary-300 font-bold">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1 font-medium">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-400 disabled:from-gray-600 disabled:to-gray-600 text-black py-3.5 rounded-2xl font-bold text-sm transition-all disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-7 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
