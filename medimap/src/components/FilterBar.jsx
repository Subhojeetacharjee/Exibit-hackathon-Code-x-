import { MapPin, IndianRupee, Star } from 'lucide-react';

const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'closest', label: 'Closest', icon: MapPin },
    { id: 'cheapest', label: 'Cheapest', icon: IndianRupee },
    { id: 'rated', label: 'Best Rated', icon: Star },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-gray-500 font-bold text-sm font-mono">// sort_by:</span>
      <div className="flex gap-2 bg-[#050505] p-1 rounded-2xl border border-white/[0.06]">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 shadow-soft border border-primary-500/20'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary-400' : ''}`} />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
