import { Sparkles, Shield, Clock, MapPin, ArrowRight, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-[#001a1f] to-black text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 229, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-primary-500/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-primary-500/20">
            <Zap className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-semibold tracking-wide text-primary-300">AI-Powered Healthcare Assistant</span>
          </div>
          
          {/* Main heading */}
          <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Find the Right
            <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-accent-green bg-clip-text text-transparent text-glow">
              Medical Specialist
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Simply describe your symptoms and let MediMap recommend the perfect specialist 
            along with nearby affordable clinics.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/find-specialist"
              className="group inline-flex items-center justify-center gap-2.5 bg-primary-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-primary-400 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-primary-500/30"
            >
              Find Specialist Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/clinics"
              className="group inline-flex items-center justify-center gap-2.5 bg-white/[0.04] backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/[0.08] transition-all duration-300 border border-white/10 hover:border-primary-500/30"
            >
              <MapPin className="h-5 w-5" />
              Nearby Clinics
            </Link>
          </div>
          
          {/* Feature cards */}
          <div className="animate-fade-in-up delay-400 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
            {[
              { icon: Shield, label: 'Accurate Results', desc: '95% Precision', color: 'from-emerald-500/10 to-green-500/10' },
              { icon: Clock, label: 'Instant Analysis', desc: '< 2 Seconds', color: 'from-primary-500/10 to-primary-700/10' },
              { icon: MapPin, label: 'Local Clinics', desc: '500+ Partners', color: 'from-violet-500/10 to-purple-500/10' },
              { icon: Heart, label: 'Smart Tips', desc: 'First Aid Guide', color: 'from-rose-500/10 to-pink-500/10' },
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-2xl p-5 hover:scale-105 transition-all duration-300 border border-white/[0.06] group cursor-default hover:border-primary-500/20`}
              >
                <feature.icon className="h-7 w-7 mx-auto mb-3 group-hover:scale-110 transition-transform text-primary-400" />
                <p className="font-bold text-sm">{feature.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="currentColor" className="text-[var(--color-wave-fill)]"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
