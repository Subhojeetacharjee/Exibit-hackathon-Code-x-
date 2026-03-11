import { useState } from 'react';
import Navbar from '../components/Navbar';
import SymptomInput from '../components/SymptomInput';
import SpecialistCard from '../components/SpecialistCard';
import HealthTips from '../components/HealthTips';
import Footer from '../components/Footer';

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

const FindSpecialist = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeSymptoms = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const input = symptoms.toLowerCase();
      const detectedSymptoms = [];
      let specialist = 'General Physician';
      let urgency = 'low';
      const tips = [];

      Object.keys(symptomMapping).forEach((symptom) => {
        if (input.includes(symptom)) {
          detectedSymptoms.push(symptom.charAt(0).toUpperCase() + symptom.slice(1));
          const mapping = symptomMapping[symptom];
          
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

      // Save to search history
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history.unshift({
        symptom: detectedSymptoms[0],
        specialist,
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));

      setIsLoading(false);
    }, 1500);
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
