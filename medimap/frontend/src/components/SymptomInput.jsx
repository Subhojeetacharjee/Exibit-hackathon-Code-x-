import { Search, Mic, Sparkles } from 'lucide-react';

const SymptomInput = ({ symptoms, setSymptoms, onSearch, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section id="symptoms" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-mono text-xs tracking-wider">// symptom_checker</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Describe Your Symptoms
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Enter your symptoms in natural language and we'll recommend the right specialist
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative animate-fade-in-up delay-200">
            <div className="bg-[#0a0a0a] rounded-2xl shadow-card p-2.5 flex items-center gap-2 border border-white/[0.06] focus-within:shadow-neon focus-within:border-primary-500/40 transition-all duration-300">
            <div className="flex-1 flex items-center">
              <Search className="h-5 w-5 text-gray-500 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., I have headache and dizziness..."
                className="w-full px-4 py-3.5 bg-transparent text-white placeholder-gray-600 focus:outline-none text-base md:text-lg font-medium"
              />
            </div>
            
            <button
              type="button"
              className="p-3 text-gray-600 hover:text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all duration-200 flex-shrink-0"
              title="Voice input (UI only)"
            >
              <Mic className="h-5 w-5" />
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !symptoms.trim()}
              className="bg-primary-500 hover:bg-primary-400 disabled:bg-gray-800 disabled:text-gray-600 text-black px-6 md:px-8 py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.03] disabled:hover:scale-100 shadow-lg shadow-primary-500/25 disabled:shadow-none flex-shrink-0 text-sm md:text-base"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Find Specialist'
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2 justify-center animate-fade-in-up delay-300">
          <span className="text-sm text-gray-600 font-medium">Try:</span>
          {['headache and fever', 'skin rash', 'chest pain', 'ear pain'].map((example) => (
            <button
              key={example}
              onClick={() => setSymptoms(example)}
              className="text-sm bg-white/[0.03] text-gray-500 px-4 py-1.5 rounded-full hover:bg-primary-500/10 hover:text-primary-400 transition-all duration-200 font-medium border border-white/[0.06] hover:border-primary-500/20 font-mono"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SymptomInput;
