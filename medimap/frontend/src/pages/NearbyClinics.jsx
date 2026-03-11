import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ClinicMap from '../components/ClinicMap';
import ClinicCard from '../components/ClinicCard';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { getNearbyClinics, getUserLocation, transformClinic } from '../lib/api';

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 };

const NearbyClinics = () => {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('closest');
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('specialty') || '');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
      .then(setUserLocation)
      .catch(() => setUserLocation(DEFAULT_LOCATION));
  }, []);

  // Fetch clinics when location is available or search changes
  useEffect(() => {
    if (!userLocation) return;
    const query = searchTerm.trim() || 'hospital clinic';
    setLoading(true);
    getNearbyClinics(userLocation.lat, userLocation.lng, query)
      .then((raw) => {
        const transformed = raw.map((c) => transformClinic(c, userLocation.lat, userLocation.lng));
        setClinics(transformed);
      })
      .catch((err) => console.error('Failed to fetch clinics:', err))
      .finally(() => setLoading(false));
  }, [userLocation, searchTerm]);

  // Derive sorted clinics from current filter — always stays in sync
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

  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];

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
                defaultValue={searchTerm}
                onChange={(e) => {
                  clearTimeout(window._clinicSearchTimer);
                  window._clinicSearchTimer = setTimeout(() => setSearchTerm(e.target.value), 600);
                }}
                placeholder="Search by specialty (e.g. cardiologist, dentist)..."
                className="w-full pl-11 pr-4 py-3.5 border border-white/[0.08] rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm bg-white/[0.03] text-gray-200 placeholder-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <ClinicMap clinics={sortedClinics} center={mapCenter} />

      {/* Clinic List */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {loading ? 'Searching...' : `${sortedClinics.length} Clinics Found`}
            </h2>
            {loading && <Loader2 className="h-5 w-5 text-primary-400 animate-spin" />}
          </div>
          
          <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedClinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
          
          {sortedClinics.length === 0 && (
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
