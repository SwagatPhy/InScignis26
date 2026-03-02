# PM Internship Recommendation Engine

AI-driven, mobile-first internship recommendation system for the PM Internship Scheme.
Designed for first-generation learners with low digital literacy.

---

## Project Structure

```
pm-internship/
├── backend/
│   ├── main.py           # FastAPI app + routes
│   ├── recommender.py    # Recommendation engine (Rule-based + TF-IDF)
│   ├── database.py       # Internship data (30 sample listings)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── App.jsx           # Complete React PWA (single file)
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Option A — Run with Docker (Recommended)
```bash
git clone <your-repo>
cd pm-internship
docker-compose up --build
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Option B — Run Manually

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (paste App.jsx into https://stackblitz.com or run with Vite):
```bash
npm create vite@latest frontend -- --template react
cd frontend
# Replace src/App.jsx with our App.jsx
npm run dev
```

---

## API Reference

### POST /recommend
Returns top 5 personalized internship recommendations.

**Request:**
```json
{
  "name": "Ravi Kumar",
  "stream": "engineering",
  "year": 3,
  "state": "Jharkhand",
  "interests": ["manufacturing", "computers"],
  "willing_to_travel": false,
  "language": "hi"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "internship_id": "PMI-2024-001",
      "company": "Tata Steel",
      "title": "Junior Manufacturing Trainee",
      "location_city": "Jamshedpur",
      "location_state": "Jharkhand",
      "stipend": 5000,
      "duration_months": 3,
      "sector": "manufacturing",
      "is_remote": false,
      "match_score": 87,
      "match_reasons": ["Matches your interest in manufacturing", "Located in Jharkhand"],
      "why_this": "Matches your interest in manufacturing. Located in Jharkhand — your home state."
    }
  ],
  "total_available": 30,
  "profile_summary": "Year 3 Engineering student from Jharkhand interested in manufacturing, computers"
}
```

### GET /metadata
Returns all streams, interests, and states for frontend dropdowns.

### GET /internships?sector=technology&state=Karnataka
Filter internship listings.

### GET /health
Check if server is running.

---

## How the Recommendation Engine Works

### Stage 1 — Hard Filters (Rules)
- Year of study eligibility (min/max year per internship)
- Geographic preference (same state → nearby region → all India)
- Travel willingness

### Stage 2 — Soft Scoring (Weighted)
| Factor           | Weight | Method |
|-----------------|--------|--------|
| Interest match  | 35%    | TF-IDF cosine similarity |
| Location        | 25%    | State → Region → Remote scoring |
| Stream fit      | 20%    | Stream-sector mapping |
| Stipend         | 10%    | Normalized to ₹15,000 max |
| Duration        | 10%    | Prefer 2-6 months |

### Stage 3 — Diversity
No more than 2 internships from the same sector in top 5 results.

---

## Adding More Internships

Edit `backend/database.py` and add entries to the `INTERNSHIPS` list:
```python
{
    "internship_id": "PMI-2024-031",
    "company": "Company Name",
    "title": "Internship Title",
    "location_city": "City",
    "location_state": "State",
    "stipend": 6000,           # monthly in ₹
    "duration_months": 3,
    "sector": "technology",    # see SECTOR_COLORS in App.jsx for options
    "is_remote": False,
    "min_year": 2,
    "max_year": 5,
    "preferred_streams": ["engineering"],
    "description": "Brief description",
    "tags": ["keyword1", "keyword2"]
}
```

---

## Connecting Frontend to Real Backend

In `frontend/App.jsx`, find the `fetchRecommendations` function and replace:
```javascript
// Replace this mock:
await new Promise(r => setTimeout(r, 2000));
return MOCK_RESULTS;

// With this real API call:
const res = await fetch("http://localhost:8000/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(profile)
});
return await res.json();
```

---

## Multilingual Support

Currently supports:
- English (en)
- Hindi (hi)

To add more languages, extend the `T` object in `App.jsx`:
```javascript
const T = {
  en: { ... },
  hi: { ... },
  bn: { appTitle: "...", ... },  // Bengali
  te: { appTitle: "...", ... },  // Telugu
};
```

For backend translations, install IndicTrans2:
```bash
pip install indic-transliteration
```

---

## Deployment (Production)

For a ₹500/month VPS deployment:
```bash
# Install nginx + certbot for HTTPS
sudo apt install nginx certbot python3-certbot-nginx

# Point your domain to the VPS
# Run docker-compose
docker-compose -f docker-compose.yml up -d

# SSL
sudo certbot --nginx -d yourdomain.gov.in
```

The app is a PWA — users can install it from their browser without an app store.
