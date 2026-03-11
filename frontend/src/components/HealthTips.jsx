import { Lightbulb, CheckCircle, ShieldCheck } from 'lucide-react';

const HealthTips = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="relative bg-gradient-to-br from-[#001a00] via-[#001200] to-[#000a00] rounded-3xl p-7 border border-emerald-500/15 shadow-card overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative">
            <div className="flex items-center gap-3.5 mb-7">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg shadow-emerald-500/40">
                <Lightbulb className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">First Aid Tips</h3>
                <p className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1 font-mono">
                  <ShieldCheck className="h-3 w-3" /> // evidence_based
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tips.map((tipGroup, index) => (
                <div
                  key={index}
                  className="bg-[#050505] backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-white/[0.06] card-hover"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2.5 text-sm">
                    <span className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-sm shadow-emerald-500/50" />
                    {tipGroup.symptom}
                  </h4>
                  <ul className="space-y-2.5">
                    {tipGroup.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2.5 text-gray-400 group">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthTips;
