import { useState, useEffect } from 'react';
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

// Dummy data for clinics
const clinicsData = [
  {
    id: 1,
    name: 'City Care Clinic',
    distance: '1.2 km',
    distanceValue: 1.2,
    fee: 200,
    rating: 4.5,
    reviews: 128,
    position: [28.6239, 77.2090],
  },
  {
    id: 2,
    name: 'HealthFirst Medical Center',
    distance: '1.8 km',
    distanceValue: 1.8,
    fee: 350,
    rating: 4.8,
    reviews: 256,
    position: [28.6139, 77.2190],
  },
  {
    id: 3,
    name: 'MedPlus Clinic',
    distance: '2.5 km',
    distanceValue: 2.5,
    fee: 150,
    rating: 4.2,
    reviews: 89,
    position: [28.6039, 77.1990],
  },
  {
    id: 4,
    name: 'Apollo Spectra',
    distance: '3.1 km',
    distanceValue: 3.1,
    fee: 500,
    rating: 4.9,
    reviews: 512,
    position: [28.6339, 77.2290],
  },
  {
    id: 5,
    name: 'Family Health Clinic',
    distance: '0.8 km',
    distanceValue: 0.8,
    fee: 180,
    rating: 4.3,
    reviews: 67,
    position: [28.6189, 77.2040],
  },
  {
    id: 6,
    name: 'Sunrise Medical',
    distance: '4.2 km',
    distanceValue: 4.2,
    fee: 120,
    rating: 4.0,
    reviews: 45,
    position: [28.5939, 77.2190],
  },
];

// Symptom to specialist mapping
const symptomMapping = {
  headache: { specialist: 'Neurologist', urgency: 'medium' },
  dizziness: { specialist: 'Neurologist', urgency: 'medium' },
  fever: { specialist: 'General Physician', urgency: 'medium' },
  'skin rash': { specialist: 'Dermatologist', urgency: 'low' },
  rash: { specialist: 'Dermatologist', urgency: 'low' },
  'chest pain': { specialist: 'Cardiologist', urgency: 'high' },
  'ear pain': { specialist: 'ENT Specialist', urgency: 'low' },
  cough: { specialist: 'Pulmonologist', urgency: 'low' },
  'stomach pain': { specialist: 'Gastroenterologist', urgency: 'medium' },
  'back pain': { specialist: 'Orthopedist', urgency: 'low' },
  anxiety: { specialist: 'Psychiatrist', urgency: 'medium' },
  depression: { specialist: 'Psychiatrist', urgency: 'medium' },
  'eye pain': { specialist: 'Ophthalmologist', urgency: 'medium' },
  'tooth pain': { specialist: 'Dentist', urgency: 'medium' },
};

// Health tips mapping
const healthTipsMapping = {
  headache: ['Drink plenty of water', 'Rest your eyes', 'Avoid screen exposure', 'Take a short nap'],
  dizziness: ['Sit or lie down immediately', 'Drink water', 'Avoid sudden movements', 'Get fresh air'],
  fever: ['Stay hydrated', 'Rest adequately', 'Use a cool compress', 'Monitor temperature'],
  'skin rash': ['Avoid scratching', 'Keep area clean', 'Apply calamine lotion', 'Wear loose clothing'],
  'chest pain': ['Stop all activity', 'Call emergency services', 'Chew aspirin if available', 'Stay calm'],
  'ear pain': ['Apply warm compress', 'Keep ear dry', 'Avoid inserting objects', 'Rest head elevated'],
  cough: ['Drink warm fluids', 'Use honey', 'Avoid cold drinks', 'Steam inhalation'],
};

const Home = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState('closest');
  const [clinics, setClinics] = useState(clinicsData);
  const [showSOS, setShowSOS] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    { symptom: 'Headache', specialist: 'Neurologist', timestamp: '2 hours ago' },
    { symptom: 'Skin rash', specialist: 'Dermatologist', timestamp: 'Yesterday' },
    { symptom: 'Ear pain', specialist: 'ENT Specialist', timestamp: '2 days ago' },
  ]);

  // Sort clinics based on active filter
  useEffect(() => {
    const sorted = [...clinicsData];
    switch (activeFilter) {
      case 'closest':
        sorted.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case 'cheapest':
        sorted.sort((a, b) => a.fee - b.fee);
        break;
      case 'rated':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setClinics(sorted);
  }, [activeFilter]);

  const analyzeSymptoms = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const input = symptoms.toLowerCase();
      const detectedSymptoms = [];
      let specialist = 'General Physician';
      let urgency = 'low';
      const tips = [];

      // Find matching symptoms
      Object.keys(symptomMapping).forEach((symptom) => {
        if (input.includes(symptom)) {
          detectedSymptoms.push(symptom.charAt(0).toUpperCase() + symptom.slice(1));
          const mapping = symptomMapping[symptom];
          
          // Take the highest urgency
          if (mapping.urgency === 'high' || urgency !== 'high') {
            if (mapping.urgency === 'high') {
              urgency = 'high';
              specialist = mapping.specialist;
            } else if (mapping.urgency === 'medium' && urgency !== 'high') {
              urgency = 'medium';
              specialist = mapping.specialist;
            } else if (urgency === 'low') {
              specialist = mapping.specialist;
            }
          }

          // Collect tips
          if (healthTipsMapping[symptom]) {
            tips.push({
              symptom: symptom.charAt(0).toUpperCase() + symptom.slice(1),
              tips: healthTipsMapping[symptom],
            });
          }
        }
      });

      if (detectedSymptoms.length === 0) {
        detectedSymptoms.push('General symptoms');
      }

      setResult({
        specialist,
        urgency,
        description: `Based on your symptoms, we recommend consulting a ${specialist}. ${
          urgency === 'high' ? 'Please seek immediate medical attention.' : 
          urgency === 'medium' ? 'Schedule an appointment soon.' : 
          'You can schedule a routine checkup.'
        }`,
        symptoms: detectedSymptoms,
        tips: tips.length > 0 ? tips : [{ 
          symptom: 'General Care', 
          tips: ['Stay hydrated', 'Get adequate rest', 'Monitor your symptoms', 'Consult a doctor if symptoms persist'] 
        }],
      });

      // Add to search history
      setSearchHistory(prev => [
        { symptom: detectedSymptoms[0], specialist, timestamp: 'Just now' },
        ...prev.slice(0, 5),
      ]);

      setIsLoading(false);
    }, 1500);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

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
      
      <ClinicMap clinics={clinics} />
      
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      </section>
      
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
