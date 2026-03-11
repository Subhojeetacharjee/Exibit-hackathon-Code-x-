# MediMap — Symptom to Specialist Mapper

A full-stack web app that maps user-described symptoms to the right medical specialist and shows nearby clinics on Google Maps with real-time data.

## Stack

- **Backend:** Python FastAPI + Uvicorn, SQLite with SQLModel, httpx
- **Frontend:** React 19 + Vite 7.3 + Tailwind CSS 3.4 + React Router DOM 7
- **Maps:** Google Maps JavaScript API (dark theme)
- **Clinic Data:** Google Places API (New) — Text Search with phone numbers & opening hours
- **Icons:** Lucide React

## Setup

### 1. Environment variables

Copy `.env.example` to `.env` and fill in your Google Maps API key:

```
GOOGLE_MAPS_API_KEY=your_key_here
```

Also update the Google Maps script tag in `frontend/index.html` with the same key.

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Features

- **Symptom Analysis** — Natural language symptom input mapped to 14+ specialties via keyword rule engine
- **Google Maps** — Dark-themed map with cyan clinic markers and red current-location marker
- **Clinic Cards** — Real data: name, address, distance, rating, open/closed status
- **Details Panel** — Phone number (clickable) and full weekly opening hours
- **Sort** — By distance or best rated
- **Emergency SOS** — Overlay with ambulance call button for critical symptoms
- **Search History** — Persisted in localStorage
- **Health Tips** — Context-aware tips based on detected symptoms
- **User Profiles** — SQLite-backed profile creation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/predict-specialist` | Analyze symptoms → specialist, urgency, tips |
| POST | `/api/nearby-clinics` | Fetch nearby clinics from Google Places |
| POST | `/api/profile` | Create user profile |

## Usage

1. Open `http://localhost:5173` and allow location access.
2. Describe your symptoms and submit.
3. View the matched specialist, health tips, and nearby clinics on the map.
4. Click **Details** on any clinic card for phone and hours.
5. Click **Directions** to open Google Maps navigation.
