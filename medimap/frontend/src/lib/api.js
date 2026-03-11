const API_BASE = 'http://localhost:8000';

export async function predictSpecialist(symptoms) {
  const res = await fetch(`${API_BASE}/api/predict-specialist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms }),
  });
  if (!res.ok) throw new Error('Failed to predict specialist');
  return res.json();
}

export async function getNearbyClinics(lat, lng, specialty, radius = 5000) {
  const res = await fetch(`${API_BASE}/api/nearby-clinics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, specialty, radius }),
  });
  if (!res.ok) throw new Error('Failed to fetch clinics');
  return res.json();
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function transformClinic(clinic, userLat, userLng) {
  const dist = haversineM(userLat, userLng, clinic.lat, clinic.lng);
  return {
    id: clinic.name,
    name: clinic.name,
    address: clinic.address,
    distance: dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`,
    distanceValue: dist / 1000,
    fee: clinic.price_level != null ? (clinic.price_level + 1) * 150 : null,
    rating: clinic.rating || 0,
    reviews: clinic.user_ratings_total || 0,
    position: [clinic.lat, clinic.lng],
    open_now: clinic.open_now,
    phone: clinic.phone || null,
    weekday_hours: clinic.weekday_hours || null,
  };
}
