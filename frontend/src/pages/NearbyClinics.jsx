import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClinicMap from '../components/ClinicMap';
import ClinicCard from '../components/ClinicCard';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';
import { MapPin, Search } from 'lucide-react';

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
    specialty: 'Multi-specialty',
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
    specialty: 'General Physician',
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
    specialty: 'Family Medicine',
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
    specialty: 'Multi-specialty',
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
    specialty: 'General Physician',
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
    specialty: 'General Medicine',
  },
  {
    id: 7,
    name: 'Care Plus Hospital',
    distance: '2.0 km',
    distanceValue: 2.0,
    fee: 400,
    rating: 4.6,
    reviews: 234,
    position: [28.6089, 77.2140],
    specialty: 'Multi-specialty',
  },
  {
    id: 8,
    name: 'LifeLine Clinic',
    distance: '1.5 km',
    distanceValue: 1.5,
    fee: 250,
    rating: 4.4,
    reviews: 156,
    position: [28.6209, 77.2020],
    specialty: 'Cardiology',
  },
];

const NearbyClinics = () => {
  const [activeFilter, setActiveFilter] = useState('closest');
  const [clinics, setClinics] = useState(clinicsData);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = [...clinicsData];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by active filter
    switch (activeFilter) {
      case 'closest':
        filtered.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case 'cheapest':
        filtered.sort((a, b) => a.fee - b.fee);
        break;
      case 'rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setClinics(filtered);
  }, [activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#001a1f] via-black to-black text-white pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,229,255,0.05),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-primary-500/20 font-semibold text-xs uppercase tracking-wider text-primary-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>Location Based Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-primary-400 to-white bg-clip-text text-transparent">Nearby Clinics</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Find affordable healthcare options near you
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-[#050505]/95 backdrop-blur-md rounded-3xl shadow-card p-5 border border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clinics by name or specialty..."
                className="w-full pl-11 pr-4 py-3.5 border border-white/[0.08] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm bg-white/[0.03] text-gray-200 placeholder-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <ClinicMap clinics={clinics} />

      {/* Clinic List */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {clinics.length} Clinics Found
            </h2>
          </div>
          
          <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
          
          {clinics.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-[#050505] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No clinics found matching your search</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NearbyClinics;
