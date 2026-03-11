import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { History as HistoryIcon, ArrowRight, Trash2, Search, Calendar, Clock } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      // Default history for demo
      setHistory([
        { symptom: 'Headache', specialist: 'Neurologist', timestamp: '2026-03-11 09:30:00' },
        { symptom: 'Skin rash', specialist: 'Dermatologist', timestamp: '2026-03-10 14:15:00' },
        { symptom: 'Ear pain', specialist: 'ENT Specialist', timestamp: '2026-03-09 11:45:00' },
        { symptom: 'Chest pain', specialist: 'Cardiologist', timestamp: '2026-03-08 16:20:00' },
        { symptom: 'Fever', specialist: 'General Physician', timestamp: '2026-03-07 08:00:00' },
      ]);
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const deleteItem = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const filteredHistory = history.filter(item =>
    item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.specialist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#001a1f] via-black to-black text-white pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,229,255,0.05),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-primary-500/20 font-semibold text-xs uppercase tracking-wider text-primary-400">
            <HistoryIcon className="h-3.5 w-3.5" />
            <span>Your Activity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-primary-400 to-white bg-clip-text text-transparent">Search History</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            View and manage your recent symptom searches
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in-up">
        {/* Search and Actions */}
        <div className="bg-[#050505]/90 backdrop-blur-sm rounded-3xl shadow-card p-5 mb-7 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-11 pr-4 py-3 border border-white/[0.08] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm bg-white/[0.03] text-gray-200 placeholder-gray-600"
              />
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center justify-center gap-2 px-5 py-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-2xl transition-colors font-bold text-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className="bg-[#050505] rounded-2xl shadow-soft border border-white/[0.06] p-5 hover:shadow-card transition-all group card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-500/10 p-3 rounded-2xl border border-primary-500/20">
                      <HistoryIcon className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">{item.symptom}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-primary-400 font-bold text-sm">{item.specialist}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/find-specialist"
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all text-sm font-bold"
                    >
                      Search Again
                    </Link>
                    <button
                      onClick={() => deleteItem(index)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06] p-12 text-center">
            <div className="bg-[#0a0a0a] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2 tracking-tight">No Search History</h3>
            <p className="text-gray-500 mb-6 text-sm">
              {searchTerm ? 'No results match your search' : 'Your symptom searches will appear here'}
            </p>
            <Link
              to="/find-specialist"
              className="inline-flex items-center gap-2 bg-primary-500 text-black px-6 py-3 rounded-2xl hover:bg-primary-400 transition-all font-bold text-sm shadow-lg shadow-primary-500/30"
            >
              Find a Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#050505] rounded-2xl shadow-soft border border-white/[0.06] p-5 text-center card-hover">
              <p className="text-3xl font-extrabold text-primary-400">{history.length}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Total Searches</p>
            </div>
            <div className="bg-[#050505] rounded-2xl shadow-soft border border-white/[0.06] p-5 text-center card-hover">
              <p className="text-3xl font-extrabold text-emerald-400">
                {new Set(history.map(h => h.specialist)).size}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Specialists</p>
            </div>
            <div className="bg-[#050505] rounded-2xl shadow-soft border border-white/[0.06] p-5 text-center card-hover">
              <p className="text-3xl font-extrabold text-amber-400">
                {new Set(history.map(h => h.symptom)).size}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Unique Symptoms</p>
            </div>
            <div className="bg-[#050505] rounded-2xl shadow-soft border border-white/[0.06] p-5 text-center card-hover">
              <p className="text-3xl font-extrabold text-violet-400">
                {history.length > 0 ? Math.ceil(history.length / 7) : 0}
              </p>
              <p className="text-sm text-gray-500">Active Days</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
