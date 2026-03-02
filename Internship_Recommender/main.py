"""
PM Internship Scheme - AI Recommendation Engine
FastAPI Backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from recommender import RecommendationEngine
from database import get_all_internships

app = FastAPI(
    title="PM Internship Recommendation Engine",
    description="Lightweight AI-driven internship recommendation for first-generation learners",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RecommendationEngine()

# ─── Request / Response Models ───────────────────────────────────────────────

class UserProfile(BaseModel):
    name: str
    stream: str                        # engineering, arts, commerce, science, other
    year: int                          # 1-5
    state: str
    district: Optional[str] = None
    interests: List[str]               # list of interest tags
    willing_to_travel: bool = False
    language: str = "en"

class InternshipCard(BaseModel):
    internship_id: str
    company: str
    title: str
    location_city: str
    location_state: str
    stipend: int
    duration_months: int
    sector: str
    is_remote: bool
    match_score: float
    match_reasons: List[str]
    why_this: str

class RecommendationResponse(BaseModel):
    recommendations: List[InternshipCard]
    total_available: int
    profile_summary: str

# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "PM Internship Recommendation Engine is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "internships_loaded": len(get_all_internships())}

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(profile: UserProfile):
    try:
        internships = get_all_internships()
        recommendations = engine.recommend(profile.dict(), internships, n=5)
        profile_summary = engine.build_profile_summary(profile.dict())
        return RecommendationResponse(
            recommendations=recommendations,
            total_available=len(internships),
            profile_summary=profile_summary
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/internships")
def list_internships(sector: Optional[str] = None, state: Optional[str] = None):
    internships = get_all_internships()
    if sector:
        internships = [i for i in internships if i["sector"].lower() == sector.lower()]
    if state:
        internships = [i for i in internships if i["location_state"].lower() == state.lower()]
    return {"internships": internships, "count": len(internships)}

@app.get("/metadata")
def get_metadata():
    """Returns all dropdown options for the frontend form"""
    return {
        "streams": [
            {
                "value": "engineering",
                "label": "Engineering",
                "label_hi": "इंजीनियरिंग",
                "label_as": "ইঞ্জিনিয়াৰিং",
                "icon": "⚙️"
            },
            {
                "value": "arts",
                "label": "Arts",
                "label_hi": "कला",
                "label_as": "কলা",
                "icon": "🎨"
            },
            {
                "value": "commerce",
                "label": "Commerce",
                "label_hi": "वाणिज्य",
                "label_as": "বাণিজ্য",
                "icon": "💰"
            },
            {
                "value": "science",
                "label": "Science",
                "label_hi": "विज्ञान",
                "label_as": "বিজ্ঞান",
                "icon": "🔬"
            },
            {
                "value": "medical",
                "label": "Medical",
                "label_hi": "चिकित्सा",
                "label_as": "চিকিৎসা",
                "icon": "🏥"
            },
            {
                "value": "law",
                "label": "Law",
                "label_hi": "कानून",
                "label_as": "আইন",
                "icon": "⚖️"
            },
            {
                "value": "other",
                "label": "Other",
                "label_hi": "अन्य",
                "label_as": "অন্যান্য",
                "icon": "📚"
            },
        ],
        "interests": [
            {
                "value": "computers",
                "label": "Computers & Tech",
                "label_hi": "कंप्यूटर",
                "label_as": "কম্পিউটাৰ",
                "icon": "💻"
            },
            {
                "value": "outdoor",
                "label": "Working Outdoors",
                "label_hi": "बाहर काम",
                "label_as": "বাহিৰত কাম",
                "icon": "🌳"
            },
            {
                "value": "people",
                "label": "Helping People",
                "label_hi": "लोगों की मदद",
                "label_as": "মানুহক সহায়",
                "icon": "🤝"
            },
            {
                "value": "manufacturing",
                "label": "Making Things",
                "label_hi": "निर्माण",
                "label_as": "নিৰ্মাণ",
                "icon": "🏭"
            },
            {
                "value": "data",
                "label": "Numbers & Data",
                "label_hi": "डेटा",
                "label_as": "তথ্য",
                "icon": "📊"
            },
            {
                "value": "teaching",
                "label": "Teaching & Training",
                "label_hi": "शिक्षण",
                "label_as": "শিক্ষণ",
                "icon": "📚"
            },
            {
                "value": "healthcare",
                "label": "Healthcare",
                "label_hi": "स्वास्थ्य",
                "label_as": "স্বাস্থ্যসেৱা",
                "icon": "❤️"
            },
            {
                "value": "agriculture",
                "label": "Agriculture",
                "label_hi": "कृषि",
                "label_as": "কৃষি",
                "icon": "🌾"
            },
        ],
        "languages": [
            {"value": "en", "label": "English"},
            {"value": "hi", "label": "हिंदी"},
            {"value": "as", "label": "অসমীয়া"},
        ],
        "states": [
            "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
            "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
            "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
            "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
            "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
            "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"
        ]
    }
