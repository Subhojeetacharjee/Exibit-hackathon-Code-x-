import { History, ArrowRight, Trash2 } from 'lucide-react';

const SearchHistory = ({ history, onClear }) => {
  if (!history || history.length === 0) return null;

  return (
    <section id="history" className="py-14 px-4 bg-gradient-to-b from-black/80 to-transparent">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3.5">
            <div className="bg-primary-500/10 p-2.5 rounded-2xl border border-primary-500/15">
              <History className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Recent Searches</h2>
              <p className="text-xs text-gray-600 font-medium mt-0.5 font-mono">{history.length} search{history.length !== 1 ? 'es' : ''} // recorded</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-2 text-gray-600 hover:text-red-400 transition-colors text-sm font-bold bg-[#050505] px-4 py-2 rounded-xl border border-white/[0.06] hover:border-red-500/20 shadow-soft"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-[#050505] rounded-2xl p-4 shadow-soft hover:shadow-card transition-all cursor-pointer group border border-white/[0.06] card-hover hover:border-primary-500/15"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-semibold text-sm">{item.symptom}</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-700 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                <span className="text-primary-400 font-bold text-sm">{item.specialist}</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-2.5 font-medium font-mono">{item.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchHistory;
