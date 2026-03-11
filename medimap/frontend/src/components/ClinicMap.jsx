import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function waitForGoogle() {
  return new Promise((resolve) => {
    if (window.google?.maps) return resolve(window.google.maps);
    const id = setInterval(() => {
      if (window.google?.maps) { clearInterval(id); resolve(window.google.maps); }
    }, 100);
  });
}

const ClinicMap = ({ clinics, center: centerProp }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [ready, setReady] = useState(false);

  const center = centerProp || [28.6139, 77.2090];

  // Initialize map once
  useEffect(() => {
    let cancelled = false;
    waitForGoogle().then((maps) => {
      if (cancelled || !mapRef.current) return;
      const map = new maps.Map(mapRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a9a' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a3e' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapInstanceRef.current = map;
      infoWindowRef.current = new maps.InfoWindow();
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Update user-location marker & re-center when center prop changes
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const maps = window.google.maps;
    const map = mapInstanceRef.current;
    map.panTo({ lat: center[0], lng: center[1] });

    // Remove old user marker
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);

    // Red pulsing marker for current location
    userMarkerRef.current = new maps.Marker({
      position: { lat: center[0], lng: center[1] },
      map,
      title: 'Your Location',
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#ff1744',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 999,
    });

    const iw = infoWindowRef.current;
    userMarkerRef.current.addListener('click', () => {
      iw.setContent('<div style="padding:4px;font-family:Inter,sans-serif;font-weight:700;font-size:13px;">📍 You are here</div>');
      iw.open(map, userMarkerRef.current);
    });
  }, [ready, center[0], center[1]]);

  // Update markers when clinics change
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const maps = window.google.maps;
    const map = mapInstanceRef.current;
    const iw = infoWindowRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Fit bounds — include user location + clinics
    const bounds = new maps.LatLngBounds();
    bounds.extend({ lat: center[0], lng: center[1] });
    let hasBounds = true;

    clinics.forEach((clinic) => {
      const pos = { lat: clinic.position[0], lng: clinic.position[1] };
      const marker = new maps.Marker({
        position: pos,
        map,
        title: clinic.name,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#00e5ff',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const content = `
        <div style="padding:6px;min-width:140px;font-family:Inter,sans-serif;">
          <h4 style="margin:0 0 4px;font-weight:700;font-size:14px;">${clinic.name}</h4>
          <p style="margin:0;color:#666;font-size:12px;">${clinic.distance}</p>
          ${clinic.rating > 0 ? `<p style="margin:2px 0 0;font-size:12px;">⭐ ${clinic.rating}</p>` : ''}
          ${clinic.fee != null ? `<p style="margin:2px 0 0;font-weight:700;color:#0097a7;font-size:13px;">₹${clinic.fee}</p>` : ''}
        </div>`;

      marker.addListener('click', () => {
        iw.setContent(content);
        iw.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(pos);
      hasBounds = true;
    });

    if (hasBounds) {
      map.fitBounds(bounds);
      // Don't zoom in too far for a single marker
      const listener = maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        maps.event.removeListener(listener);
      });
    }
  }, [ready, clinics]);

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
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div ref={mapRef} className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicMap;
