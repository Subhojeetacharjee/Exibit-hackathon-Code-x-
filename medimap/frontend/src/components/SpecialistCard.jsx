import { Stethoscope, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import UrgencyBadge from './UrgencyBadge';

const SpecialistCard = ({ specialist, urgency, description, symptoms }) => {
  return (
    <section className="py-8 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="bg-[#050505] rounded-3xl shadow-card overflow-hidden border border-white/[0.06] card-hover">
          {/* Header gradient */}
          <div className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 p-7 text-white overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-primary-200 text-xs font-semibold uppercase tracking-wider mb-1 font-mono">// recommended_specialist</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{specialist}</h3>
                </div>
              </div>
              <UrgencyBadge level={urgency} />
            </div>
          </div>
          
          {/* Body */}
          <div className="p-7 space-y-5">
            <div className="flex items-start gap-4 bg-primary-500/5 rounded-2xl p-4 border border-primary-500/15">
              <div className="bg-primary-500/15 p-2 rounded-xl flex-shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="font-bold text-white mb-1 text-sm">Analysis Result</p>
                <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/[0.04] p-2 rounded-xl flex-shrink-0 mt-0.5 border border-white/[0.06]">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-bold text-white mb-2 text-sm">Detected Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-white/[0.04] text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/[0.08]"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to={`/clinics?specialty=${encodeURIComponent(specialist)}`}
              className="group w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-black py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 mt-2"
            >
              Find Nearby Clinics
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialistCard;
