import { useState } from 'react';
import Navbar from '../components/Navbar';
import SymptomInput from '../components/SymptomInput';
import SpecialistCard from '../components/SpecialistCard';
import HealthTips from '../components/HealthTips';
import Footer from '../components/Footer';
import { predictSpecialist } from '../lib/api';

// Health tips mapping (display data)
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

const FindSpecialist = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

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

      // Save to localStorage search history
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history.unshift({
        symptom: data.detected_symptoms[0],
        specialist: data.specialty,
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#001a1f] via-black to-black text-white pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,229,255,0.05),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block font-mono text-xs text-primary-500/60 mb-3">// find_specialist</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-primary-400 to-white bg-clip-text text-transparent">Find Your Specialist</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Describe your symptoms and let our AI recommend the right medical specialist for you
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

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

      <Footer />
    </div>
  );
};

export default FindSpecialist;
