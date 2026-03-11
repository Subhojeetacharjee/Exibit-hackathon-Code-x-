import json
import math
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine

# ---------------------------------------------------------------------------
# Load .env from project root (one level up from backend/)
# ---------------------------------------------------------------------------
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
DATABASE_URL = "sqlite:///app.db"
engine = create_engine(DATABASE_URL, echo=False)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    gender: str
    health_status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# ---------------------------------------------------------------------------
# Symptom rules – loaded once at import time
# ---------------------------------------------------------------------------
_rules_path = Path(__file__).resolve().parent / "symptom_rules.json"
with open(_rules_path, "r", encoding="utf-8") as f:
    SYMPTOM_RULES: list[dict] = json.load(f)

def _haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return distance in metres between two lat/lng points."""
    R = 6_371_000  # Earth radius in metres
    rlat1, rlat2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(rlat1) * math.cos(rlat2) * math.sin(dlng / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ---------------------------------------------------------------------------
# Pydantic request / response models
# ---------------------------------------------------------------------------


class ProfileIn(BaseModel):
    name: str
    age: int
    gender: str
    health_status: str


class ProfileOut(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    health_status: str


class SymptomsIn(BaseModel):
    symptoms: str


class SpecialtyOut(BaseModel):
    specialty: str
    is_emergency: bool
    urgency: str
    detected_symptoms: list[str]
    description: str


class NearbyClinicsIn(BaseModel):
    lat: float
    lng: float
    specialty: str
    radius: int = 5000  # metres, max 50000


class ClinicOut(BaseModel):
    name: str
    address: str
    lat: float
    lng: float
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    price_level: Optional[int] = None
    open_now: Optional[bool] = None
    phone: Optional[str] = None
    weekday_hours: Optional[list[str]] = None


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Symptom-to-Specialist Mapper")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running. Open http://localhost:5173 for the UI."}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.post("/api/profile", response_model=ProfileOut)
def create_profile(payload: ProfileIn):
    user = User(**payload.model_dump())
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return ProfileOut(
        id=user.id,
        name=user.name,
        age=user.age,
        gender=user.gender,
        health_status=user.health_status,
    )


# Urgency defaults for non-emergency specialties
_URGENCY_MAP = {
    "general physician": "low",
    "dermatologist": "low",
    "dentist": "low",
    "orthopedic": "low",
    "ent specialist": "low",
}


@app.post("/api/predict-specialist", response_model=SpecialtyOut)
def predict_specialist(payload: SymptomsIn):
    """Match symptom text against keyword rules; collect all matches, highest severity wins."""
    text = payload.symptoms.lower()
    matched_specialty = None
    is_emergency = False
    detected_symptoms: list[str] = []
    seen_rules: set[str] = set()

    for rule in SYMPTOM_RULES:
        rule_key = rule["specialty"] + str(rule["is_emergency"])
        for kw in rule["keywords"]:
            if kw in text:
                detected_symptoms.append(kw.title())
                if rule["is_emergency"] and not is_emergency:
                    is_emergency = True
                    matched_specialty = rule["specialty"]
                elif matched_specialty is None:
                    matched_specialty = rule["specialty"]
                break  # one keyword per rule is enough

    specialty = matched_specialty or "general physician"

    if is_emergency:
        urgency = "high"
    else:
        urgency = _URGENCY_MAP.get(specialty, "medium")

    if not detected_symptoms:
        detected_symptoms = ["General symptoms"]

    desc_suffix = {
        "high": "Please seek immediate medical attention.",
        "medium": "Schedule an appointment soon.",
        "low": "You can schedule a routine checkup.",
    }
    description = (
        f"Based on your symptoms, we recommend consulting a {specialty.title()}. "
        f"{desc_suffix[urgency]}"
    )

    return SpecialtyOut(
        specialty=specialty.title(),
        is_emergency=is_emergency,
        urgency=urgency,
        detected_symptoms=detected_symptoms,
        description=description,
    )


@app.post("/api/nearby-clinics", response_model=list[ClinicOut])
async def nearby_clinics(payload: NearbyClinicsIn):
    """
    Call Google Places API (New) – Text Search endpoint to find clinics
    matching the specialty within the requested radius.
    Uses multiple queries for larger radii to get more results.
    """
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="GOOGLE_MAPS_API_KEY not set")

    url = "https://places.googleapis.com/v1/places:searchText"
    search_radius = float(min(payload.radius, 50000))

    # Multiple queries to get broader results
    queries = [
        f"{payload.specialty} hospital clinic",
        f"{payload.specialty} doctor specialist",
    ]
    # For larger radii, add a government hospital query
    if payload.radius >= 10000:
        queries.append("government hospital public health centre")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.formattedAddress,places.location,"
            "places.rating,places.userRatingCount,places.priceLevel,"
            "places.currentOpeningHours,places.nationalPhoneNumber"
        ),
    }

    seen_names: set[str] = set()
    clinics: list[ClinicOut] = []
    price_map = {
        "PRICE_LEVEL_FREE": 0,
        "PRICE_LEVEL_INEXPENSIVE": 1,
        "PRICE_LEVEL_MODERATE": 2,
        "PRICE_LEVEL_EXPENSIVE": 3,
        "PRICE_LEVEL_VERY_EXPENSIVE": 4,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        for query in queries:
            body = {
                "textQuery": query,
                "locationBias": {
                    "circle": {
                        "center": {"latitude": payload.lat, "longitude": payload.lng},
                        "radius": search_radius,
                    }
                },
                "maxResultCount": 20,
            }
            resp = await client.post(url, json=body, headers=headers)
            if resp.status_code != 200:
                continue  # skip failed queries, try others

            places = resp.json().get("places", [])
            for p in places:
                location = p.get("location", {})
                opening = p.get("currentOpeningHours", {})
                display_name = p.get("displayName", {})
                name = display_name.get("text", "Unknown")

                # Deduplicate by name
                if name in seen_names:
                    continue
                seen_names.add(name)

                weekday_texts = opening.get("weekdayDescriptions", [])

                clinics.append(
                    ClinicOut(
                        name=name,
                        address=p.get("formattedAddress", ""),
                        lat=location.get("latitude", 0),
                        lng=location.get("longitude", 0),
                        rating=p.get("rating"),
                        user_ratings_total=p.get("userRatingCount"),
                        price_level=price_map.get(p.get("priceLevel")),
                        open_now=opening.get("openNow"),
                        phone=p.get("nationalPhoneNumber"),
                        weekday_hours=weekday_texts if weekday_texts else None,
                    )
                )

    # Filter to only clinics within requested radius and sort by distance
    result: list[ClinicOut] = []
    for c in clinics:
        dist = _haversine_m(payload.lat, payload.lng, c.lat, c.lng)
        if dist <= payload.radius:
            result.append(c)

    result.sort(key=lambda c: _haversine_m(payload.lat, payload.lng, c.lat, c.lng))
    return result
