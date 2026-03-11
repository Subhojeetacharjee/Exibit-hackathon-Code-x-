import { MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ClinicMap = ({ clinics }) => {
  const center = [28.6139, 77.2090]; // Default to Delhi coordinates

  return (
    <section id="clinics" className="py-12 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-5 py-2 rounded-full mb-4 border border-primary-500/15 font-semibold text-xs uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-mono">// location_based</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Nearby Clinics</h2>
          <p className="text-gray-400 max-w-md mx-auto">Find affordable healthcare options near you</p>
        </div>

        <div className="bg-[#050505] rounded-3xl shadow-card overflow-hidden border border-white/[0.06]">
          <div className="h-[420px] relative">
            <MapContainer
              center={center}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {clinics.map((clinic) => (
                <Marker key={clinic.id} position={clinic.position}>
                  <Popup>
                    <div className="text-center p-1">
                      <h4 className="font-bold text-sm">{clinic.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{clinic.distance}</p>
                      <p className="text-sm font-bold text-primary-600 mt-1">₹{clinic.fee}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            <button className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md shadow-elevated px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-[#0a0a0a] transition-all z-[1000] border border-primary-500/15 group">
              <Navigation className="h-4 w-4 text-primary-400 group-hover:text-primary-300 transition-colors" />
              <span className="text-sm font-bold text-gray-400">Use My Location</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicMap;
