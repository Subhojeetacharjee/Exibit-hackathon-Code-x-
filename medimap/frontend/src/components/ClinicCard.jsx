import { useState } from 'react';
import { MapPin, Star, IndianRupee, Navigation, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const ClinicCard = ({ clinic }) => {
  const [showDetails, setShowDetails] = useState(false);
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-600" />
        );
      }
    }
    return stars;
  };

  const isOpen = clinic.open_now;

  return (
    <div className="bg-[#050505] rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden border border-white/[0.06] group card-hover hover:border-primary-500/15">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
            {clinic.name}
          </h3>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
            isOpen === false
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {isOpen === false ? 'Closed' : 'Open'}
          </span>
        </div>
        
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-gray-400 text-sm">
            <div className="bg-primary-500/10 p-1 rounded-lg"><MapPin className="h-3.5 w-3.5 text-primary-400" /></div>
            <span>{clinic.distance}{clinic.address ? ` — ${clinic.address}` : ''}</span>
          </div>
          
          {clinic.fee != null && (
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <div className="bg-primary-500/10 p-1 rounded-lg"><IndianRupee className="h-3.5 w-3.5 text-primary-400" /></div>
              <span>Fee: <span className="font-bold text-white">₹{clinic.fee}</span></span>
            </div>
          )}
          
          {clinic.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(clinic.rating)}
              </div>
              <span className="text-xs text-gray-500 font-medium">({clinic.reviews})</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.position[0]},${clinic.position[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary-500 hover:bg-primary-400 text-black py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </a>
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors border border-white/[0.06] flex items-center gap-1.5"
          >
            Details
            {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Details Panel */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 animate-fade-in">
            {clinic.phone ? (
              <div className="flex items-center gap-2.5 text-sm">
                <div className="bg-primary-500/10 p-1 rounded-lg"><Phone className="h-3.5 w-3.5 text-primary-400" /></div>
                <a href={`tel:${clinic.phone}`} className="text-primary-400 hover:underline font-medium">{clinic.phone}</a>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <div className="bg-white/[0.04] p-1 rounded-lg"><Phone className="h-3.5 w-3.5 text-gray-600" /></div>
                <span>Phone not available</span>
              </div>
            )}

            {clinic.weekday_hours ? (
              <div className="flex gap-2.5 text-sm">
                <div className="bg-primary-500/10 p-1 rounded-lg mt-0.5 shrink-0"><Clock className="h-3.5 w-3.5 text-primary-400" /></div>
                <ul className="space-y-1 text-gray-400">
                  {clinic.weekday_hours.map((line, i) => (
                    <li key={i} className="leading-snug">{line}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <div className="bg-white/[0.04] p-1 rounded-lg"><Clock className="h-3.5 w-3.5 text-gray-600" /></div>
                <span>Hours not available</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicCard;
