# Symptom-to-Specialist Mapper

A small MVP web app that maps user-described symptoms to the right medical specialist and shows nearby clinics on a map.

## Stack

- **Backend:** Python FastAPI + Uvicorn, SQLite with SQLModel
- **Frontend:** React + Tailwind CSS (Vite)
- **Maps:** Google Maps JavaScript API + Google Places Nearby Search (v1)

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

## Usage

1. Fill in a health profile (name, age, gender, health status).
2. Describe your symptoms in the text area and submit.
3. If the symptoms indicate an emergency, an overlay appears with an ambulance call button.
4. Otherwise, nearby clinics for the matched specialty are shown on the map and in a card list.
