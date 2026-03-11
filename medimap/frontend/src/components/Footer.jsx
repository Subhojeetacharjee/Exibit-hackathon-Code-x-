import { Activity, Heart, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-black text-white pt-16 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-5 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                <Activity className="h-5 w-5 text-black" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">MediMap</span>
                <p className="text-[10px] text-primary-500/60 font-semibold uppercase tracking-widest">Health Navigator</p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your trusted companion for finding the right medical specialist and affordable healthcare.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/find-specialist" className="hover:text-primary-400 transition-colors">Find Specialist</Link></li>
              <li><Link to="/clinics" className="hover:text-primary-400 transition-colors">Nearby Clinics</Link></li>
              <li><Link to="/history" className="hover:text-primary-400 transition-colors">Search History</Link></li>
              <li><Link to="/profile" className="hover:text-primary-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="flex items-center gap-2.5">
                <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.06]"><Mail className="h-3.5 w-3.5" /></div>
                support@medimap.com
              </li>
              <li className="flex items-center gap-2.5">
                <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.06]"><Phone className="h-3.5 w-3.5" /></div>
                +91 1800-123-4567
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-white">Emergency</h4>
            <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
              <p className="text-xs text-red-400/70 mb-2 font-semibold uppercase tracking-wider font-mono">// emergency</p>
              <p className="text-3xl font-extrabold text-red-400">102</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2026 MediMap. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for better healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
