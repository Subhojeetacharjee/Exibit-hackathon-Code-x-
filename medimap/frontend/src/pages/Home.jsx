import { useState, useEffect, useMemo } from 'react';
import { Phone, X, AlertTriangle, Ambulance } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SymptomInput from '../components/SymptomInput';
import SpecialistCard from '../components/SpecialistCard';
import HealthTips from '../components/HealthTips';
import ClinicMap from '../components/ClinicMap';
import ClinicCard from '../components/ClinicCard';
import FilterBar from '../components/FilterBar';
import SearchHistory from '../components/SearchHistory';
import Footer from '../components/Footer';
import { predictSpecialist, getNearbyClinics, getUserLocation, transformClinic } from '../lib/api';

// Health tips mapping (display data — stays client-side)
const healthTipsMapping = {
  headache: ['Drink plenty of water', 'Rest your eyes', 'Avoid screen exposure', 'Take a short nap'],
  dizziness: ['Sit or lie down immediately', 'Drink water', 'Avoid sudden movements', 'Get fresh air'],
  fever: ['Stay hydrated', 'Rest adequately', 'Use a cool compress', 'Monitor temperature'],
  'skin rash': ['Avoid scratching', 'Keep area clean', 'Apply calamine lotion', 'Wear loose clothing'],
  'chest pain': ['Stop all activity', 'Call emergency services', 'Chew aspirin if available', 'Stay calm'],
  'ear pain': ['Apply warm compress', 'Keep ear dry', 'Avoid inserting objects', 'Rest head elevated'],
  cough: ['Drink warm fluids', 'Use honey', 'Avoid cold drinks', 'Steam inhalation'],
  'stomach pain': ['Avoid spicy food', 'Drink warm water', 'Rest after meals', 'Eat light food'],
  'back pain': ['Apply hot/cold compress', 'Maintain posture', 'Gentle stretching', 'Avoid heavy lifting'],
  anxiety: ['Practice deep breathing', 'Go for a walk', 'Limit caffeine', 'Talk to someone you trust'],
  depression: ['Stay connected with people', 'Maintain a routine', 'Exercise regularly', 'Seek professional help'],
  'eye pain': ['Rest your eyes', 'Reduce screen time', 'Use eye drops', 'Wear sunglasses outdoors'],
  'tooth pain': ['Rinse with warm salt water', 'Avoid hot/cold foods', 'Use clove oil', 'See a dentist soon'],
};

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback

const Home = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState('closest');
  const [clinics, setClinics] = useState([]);
  const [showSOS, setShowSOS] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  });

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
      .then(setUserLocation)
      .catch(() => setUserLocation(DEFAULT_LOCATION));
  }, []);

  // Derive sorted clinics from current filter
  const sortedClinics = useMemo(() => {
    const sorted = [...clinics];
    switch (activeFilter) {
      case 'closest':
        sorted.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case 'cheapest':
        sorted.sort((a, b) => (a.fee ?? 999) - (b.fee ?? 999));
        break;
      case 'rated':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [clinics, activeFilter]);

  const analyzeSymptoms = async () => {
    setIsLoading(true);
    try {
      const data = await predictSpecialist(symptoms);

      // Build health tips from detected symptoms
      const tips = [];
      data.detected_symptoms.forEach((s) => {
        const key = s.toLowerCase();
        if (healthTipsMapping[key]) {
          tips.push({ symptom: s, tips: healthTipsMapping[key] });
        }
      });
      if (tips.length === 0) {
        tips.push({
          symptom: 'General Care',
          tips: ['Stay hydrated', 'Get adequate rest', 'Monitor your symptoms', 'Consult a doctor if symptoms persist'],
        });
      }

      setResult({
        specialist: data.specialty,
        urgency: data.urgency,
        description: data.description,
        symptoms: data.detected_symptoms,
        tips,
      });

      // Save to search history
      const entry = {
        symptom: data.detected_symptoms[0],
        specialist: data.specialty,
        timestamp: new Date().toLocaleString(),
      };
      setSearchHistory((prev) => {
        const updated = [entry, ...prev.slice(0, 9)];
        localStorage.setItem('searchHistory', JSON.stringify(updated));
        return updated;
      });

      // Fetch nearby clinics from backend
      const loc = userLocation || DEFAULT_LOCATION;
      const rawClinics = await getNearbyClinics(loc.lat, loc.lng, data.specialty);
      setClinics(rawClinics.map((c) => transformClinic(c, loc.lat, loc.lng)));
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <SymptomInput
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        onSearch={analyzeSymptoms}
        isLoading={isLoading}
      />
      
      {result && (
        <>
          <SpecialistCard
            specialist={result.specialist}
            urgency={result.urgency}
            description={result.description}
            symptoms={result.symptoms}
          />
          <HealthTips tips={result.tips} />
        </>
      )}
      
      {sortedClinics.length > 0 && (
        <>
          <ClinicMap clinics={sortedClinics} center={mapCenter} />
          <section className="py-10 px-4">
            <div className="max-w-6xl mx-auto animate-fade-in-up">
              <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedClinics.map((clinic) => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      
      <SearchHistory history={searchHistory} onClear={clearHistory} />
      <Footer />

      {/* Floating SOS Button */}
      <button
        onClick={() => setShowSOS(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Emergency SOS"
      >
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
        <span className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg shadow-red-500/40 group-hover:shadow-red-500/60 group-hover:scale-110 transition-all duration-300 border-2 border-red-400/30">
          <span className="text-white font-extrabold text-sm tracking-wider">SOS</span>
        </span>
      </button>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSOS(false)} />
          <div className="relative bg-[#050505] rounded-3xl shadow-elevated border border-red-500/20 p-8 max-w-sm w-full animate-scale-in">
            <button
              onClick={() => setShowSOS(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-5 border border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Emergency SOS</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Call emergency services immediately or reach out to an ambulance near you.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-3 w-full py-3.5 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  <Phone className="h-5 w-5" />
                  Call 112 — Emergency
                </a>
                <a
                  href="tel:102"
                  className="flex items-center justify-center gap-3 w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-2xl font-bold text-sm transition-all border border-white/[0.06] hover:border-red-500/20"
                >
                  <Ambulance className="h-5 w-5 text-red-400" />
                  Call 102 — Ambulance
                </a>
              </div>

              <p className="text-gray-600 text-xs mt-5 font-mono">// stay calm • help is on the way</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
