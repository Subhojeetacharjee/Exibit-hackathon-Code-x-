import { MapPin, Star, IndianRupee, Navigation } from 'lucide-react';

const ClinicCard = ({ clinic }) => {
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

  return (
    <div className="bg-[#050505] rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden border border-white/[0.06] group card-hover hover:border-primary-500/15">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
            {clinic.name}
          </h3>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/20">
            Open
          </span>
        </div>
        
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-gray-400 text-sm">
            <div className="bg-primary-500/10 p-1 rounded-lg"><MapPin className="h-3.5 w-3.5 text-primary-400" /></div>
            <span>{clinic.distance}</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-gray-400 text-sm">
            <div className="bg-primary-500/10 p-1 rounded-lg"><IndianRupee className="h-3.5 w-3.5 text-primary-400" /></div>
            <span>Fee: <span className="font-bold text-white">₹{clinic.fee}</span></span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(clinic.rating)}
            </div>
            <span className="text-xs text-gray-500 font-medium">({clinic.reviews})</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-primary-500 hover:bg-primary-400 text-black py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
            <Navigation className="h-4 w-4" />
            Visit
          </button>
          <button className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors border border-white/[0.06]">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;
