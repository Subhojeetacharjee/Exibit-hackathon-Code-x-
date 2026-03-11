# Exibit Hackathon - Code X

## MediMap — Symptom to Specialist Mapper

A full-stack web app that maps user-described symptoms to the right medical specialist, shows nearby clinics on Google Maps, and provides clinic details like phone numbers and opening hours.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7.3, Tailwind CSS 3.4, React Router DOM 7 |
| Backend | Python FastAPI, Uvicorn, SQLModel + SQLite |
| Maps | Google Maps JavaScript API |
| Clinic Data | Google Places API (New) — Text Search |
| Icons | Lucide React |
| HTTP Client | httpx (backend), Fetch API (frontend) |

## Features

- **Symptom Analysis** — Enter symptoms in natural language; the app matches them to the appropriate medical specialist using a keyword-based rule engine (41+ rules covering 14 specialties)
- **Nearby Clinics** — Fetches real clinic data from Google Places API with name, address, rating, reviews, phone number, and weekly hours
- **Google Maps** — Dark-themed interactive map with clinic markers (cyan) and a red "You are here" current-location marker
- **Clinic Details** — Expandable panel on each card showing phone number (clickable) and full weekly schedule
- **Sort & Filter** — Sort clinics by distance or rating
- **Emergency Detection** — SOS overlay with ambulance call button for critical symptoms
- **Search History** — Persisted in localStorage
- **Health Tips** — Context-aware tips based on detected symptoms
- **User Profiles** — SQLite-backed profile creation

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Google Maps API key (with Maps JS API + Places API enabled)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Subhojeetacharjee/Exibit-hackathon-Code-x-.git
   cd Exibit-hackathon-Code-x-/medimap
   ```

2. Set up environment variables
   ```sh
   cp .env.example .env
   # Edit .env and add your GOOGLE_MAPS_API_KEY
   ```
   Also update the API key in `frontend/index.html` Google Maps script tag.

3. Start the backend
   ```sh
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   Backend runs at `http://localhost:8000`

4. Start the frontend
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Allow location access for nearby clinic results
3. Describe your symptoms in the search bar and submit
4. View the matched specialist, health tips, and nearby clinics on the map
5. Click **Details** on any clinic card to see phone number and opening hours
6. Click **Directions** to open Google Maps navigation

## Project Structure

```
medimap/
├── backend/
│   ├── main.py              # FastAPI server (endpoints, Google Places integration)
│   ├── symptom_rules.json   # Symptom-to-specialist mapping rules
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # ClinicMap, ClinicCard, FilterBar, Navbar, etc.
│   │   ├── pages/           # Home, FindSpecialist, NearbyClinics, etc.
│   │   ├── lib/api.js       # API utility functions
│   │   └── index.css        # Tailwind + custom styles
│   ├── index.html
│   └── package.json
└── .env.example
```

## Team
- **Subhojeet Acharjee** - [GitHub](https://github.com/Subhojeetacharjee)

## License
This project is licensed under the MIT License.
