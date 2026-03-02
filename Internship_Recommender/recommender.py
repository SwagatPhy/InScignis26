"""
Recommendation Engine
Hybrid Rule-Based + TF-IDF scoring — no heavy ML dependencies
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import numpy as np


# Map stream → relevant sectors
STREAM_SECTOR_MAP = {
    "engineering":    ["manufacturing", "infrastructure", "technology", "energy", "automotive"],
    "science":        ["research", "healthcare", "pharma", "environment", "agriculture"],
    "commerce":       ["finance", "banking", "retail", "logistics", "fmcg"],
    "arts":           ["media", "ngo", "education", "government", "hospitality"],
    "medical":        ["healthcare", "pharma", "ngo", "research"],
    "law":            ["government", "ngo", "finance", "media"],
    "other":          [],
}

# Map interest tag → relevant sectors
INTEREST_SECTOR_MAP = {
    "computers":      ["technology", "finance", "media", "research"],
    "outdoor":        ["agriculture", "environment", "infrastructure", "energy"],
    "people":         ["ngo", "healthcare", "education", "hospitality", "government"],
    "manufacturing":  ["manufacturing", "automotive", "energy", "infrastructure"],
    "data":           ["finance", "technology", "research", "fmcg"],
    "teaching":       ["education", "ngo", "government"],
    "healthcare":     ["healthcare", "pharma", "ngo"],
    "agriculture":    ["agriculture", "environment", "fmcg"],
}

# Geographic regions for proximity scoring
STATE_REGIONS = {
    "North":    ["Delhi","Haryana","Punjab","Himachal Pradesh","Uttarakhand","Jammu & Kashmir","Ladakh","Chandigarh"],
    "North_East":["Assam","Arunachal Pradesh","Manipur","Meghalaya","Mizoram","Nagaland","Sikkim","Tripura"],
    "East":     ["West Bengal","Odisha","Bihar","Jharkhand"],
    "West":     ["Maharashtra","Gujarat","Goa","Rajasthan"],
    "South":    ["Tamil Nadu","Kerala","Karnataka","Andhra Pradesh","Telangana","Puducherry"],
    "Central":  ["Madhya Pradesh","Chhattisgarh","Uttar Pradesh"],
}

def get_region(state: str) -> str:
    for region, states in STATE_REGIONS.items():
        if state in states:
            return region
    return "Other"


class RecommendationEngine:

    def recommend(self, profile: Dict, internships: List[Dict], n: int = 5) -> List[Dict]:
        # Stage 1: Hard filters
        filtered = self._hard_filter(profile, internships)
        
        if len(filtered) == 0:
            # Relax travel constraint and retry
            relaxed_profile = {**profile, "willing_to_travel": True}
            filtered = self._hard_filter(relaxed_profile, internships)
        
        # Stage 2: Score each internship
        scored = []
        for internship in filtered:
            score, reasons = self._score(profile, internship)
            scored.append((internship, score, reasons))
        
        # Sort by score descending
        scored.sort(key=lambda x: x[1], reverse=True)
        
        # Stage 3: Ensure diversity
        diverse = self._diversify(scored, n)
        
        # Stage 4: Build response cards
        cards = []
        for internship, score, reasons in diverse:
            card = self._build_card(internship, score, reasons, profile)
            cards.append(card)
        
        return cards

    def _hard_filter(self, profile: Dict, internships: List[Dict]) -> List[Dict]:
        filtered = []
        user_year = profile.get("year", 1)
        
        for i in internships:
            # Year eligibility
            if user_year < i.get("min_year", 1):
                continue
            if user_year > i.get("max_year", 5):
                continue
            
            # Travel preference
            if not profile.get("willing_to_travel", False):
                same_state = i["location_state"] == profile["state"]
                is_remote  = i.get("is_remote", False)
                nearby     = get_region(i["location_state"]) == get_region(profile["state"])
                if not (same_state or is_remote or nearby):
                    continue
            
            filtered.append(i)
        
        return filtered

    def _score(self, profile: Dict, internship: Dict):
        weights = {
            "interest_match": 0.35,
            "location_score": 0.25,
            "stream_fit":     0.20,
            "stipend_rank":   0.10,
            "duration_fit":   0.10,
        }

        reasons = []

        # ── Interest match (TF-IDF cosine similarity) ────────────────────────
        interest_tags = profile.get("interests", [])
        profile_text  = " ".join(interest_tags)
        intern_text   = (internship.get("title", "") + " " +
                         internship.get("description", "") + " " +
                         internship.get("sector", "") + " " +
                         " ".join(internship.get("tags", [])))
        
        if profile_text.strip() and intern_text.strip():
            try:
                tfidf = TfidfVectorizer()
                matrix = tfidf.fit_transform([profile_text, intern_text])
                interest_score = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])
            except:
                interest_score = 0.3
        else:
            interest_score = 0.3
        
        # Boost by sector overlap
        relevant_sectors = set()
        for tag in interest_tags:
            relevant_sectors.update(INTEREST_SECTOR_MAP.get(tag, []))
        if internship.get("sector") in relevant_sectors:
            interest_score = min(1.0, interest_score + 0.3)
            reasons.append(f"Matches your interest in {internship['sector']}")

        # ── Location score ────────────────────────────────────────────────────
        if internship.get("is_remote"):
            location_score = 0.85
            reasons.append("Remote internship — work from home")
        elif internship["location_state"] == profile["state"]:
            location_score = 1.0
            reasons.append(f"Located in {profile['state']} — your home state")
        elif get_region(internship["location_state"]) == get_region(profile["state"]):
            location_score = 0.65
            reasons.append(f"Nearby state — {internship['location_state']}")
        else:
            location_score = 0.2

        # ── Stream fit ────────────────────────────────────────────────────────
        user_stream = profile.get("stream", "other")
        preferred   = internship.get("preferred_streams", [])
        
        if user_stream in preferred:
            stream_score = 1.0
            reasons.append(f"Ideal for {user_stream.capitalize()} students")
        elif internship.get("sector") in STREAM_SECTOR_MAP.get(user_stream, []):
            stream_score = 0.7
        else:
            stream_score = 0.4

        # ── Stipend (normalize 0-1 assuming max ₹15,000) ─────────────────────
        stipend_score = min(1.0, internship.get("stipend", 0) / 15000)

        # ── Duration (prefer 2-6 months for students) ────────────────────────
        dur = internship.get("duration_months", 3)
        duration_score = 1.0 if 2 <= dur <= 6 else 0.6

        # ── Final weighted score ──────────────────────────────────────────────
        total = (
            weights["interest_match"] * interest_score +
            weights["location_score"] * location_score +
            weights["stream_fit"]     * stream_score   +
            weights["stipend_rank"]   * stipend_score  +
            weights["duration_fit"]   * duration_score
        )

        return round(total, 4), reasons

    def _diversify(self, scored: List, n: int) -> List:
        final         = []
        sector_counts = {}
        
        for item in scored:
            internship, score, reasons = item
            sector = internship.get("sector", "other")
            
            if sector_counts.get(sector, 0) >= 2:
                continue
            
            final.append(item)
            sector_counts[sector] = sector_counts.get(sector, 0) + 1
            
            if len(final) == n:
                break
        
        # If we couldn't fill n slots with diversity, add remaining top scores
        if len(final) < n:
            added_ids = {i[0]["internship_id"] for i in final}
            for item in scored:
                if item[0]["internship_id"] not in added_ids:
                    final.append(item)
                if len(final) == n:
                    break
        
        return final

    def _build_card(self, internship: Dict, score: float, reasons: List[str], profile: Dict) -> Dict:
        # Generate a human-readable "Why this?" sentence
        why_parts = []
        if reasons:
            why_parts = reasons[:2]
        else:
            why_parts = [f"This role suits {profile.get('stream','your')} background"]
        
        why_this = ". ".join(why_parts) + "."
        
        return {
            "internship_id":  internship["internship_id"],
            "company":        internship["company"],
            "title":          internship["title"],
            "location_city":  internship["location_city"],
            "location_state": internship["location_state"],
            "stipend":        internship["stipend"],
            "duration_months":internship["duration_months"],
            "sector":         internship["sector"],
            "is_remote":      internship.get("is_remote", False),
            "match_score":    round(score * 100),
            "match_reasons":  reasons,
            "why_this":       why_this,
        }

    def build_profile_summary(self, profile: Dict) -> str:
        stream    = profile.get("stream", "").capitalize()
        year      = profile.get("year", "")
        state     = profile.get("state", "")
        interests = ", ".join(profile.get("interests", []))
        return f"Year {year} {stream} student from {state} interested in {interests}"
