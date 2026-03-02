import { useState, useEffect } from "react";

// ─── Translations ─────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "PM Internship Scheme",
    appSubtitle: "Find internships made for you",
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to your account",
    signupTitle: "Create Account",
    signupSubtitle: "Join thousands of students",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginBtn: "Sign In →",
    signupBtn: "Create Account →",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signupLink: "Sign Up",
    loginLink: "Sign In",
    logout: "Logout",
    step1: "What are you studying?",
    step2: "Which year are you in?",
    step3: "Where are you from?",
    step4: "What kind of work interests you?",
    step5: "Can you travel for work?",
    yes_travel: "Yes, I can travel",
    no_travel: "Stay near home",
    findBtn: "Find My Internships →",
    resultsTitle: "Your Top Matches",
    monthlyStipend: "/month",
    months: "months",
    remote: "Remote",
    whyThis: "Why this?",
    applyNow: "Apply Now",
    save: "Save",
    startOver: "← New Search",
    selectState: "Select your state",
    year: "Year",
    loading: "AI is finding the best matches for you...",
    loadingStep1: "Analyzing your profile...",
    loadingStep2: "Scanning internship listings...",
    loadingStep3: "Ranking by relevance...",
    noResults: "No matches found. Try changing your preferences.",
    interests_prompt: "Choose all that apply",
    namePlaceholder: "Enter your name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Min. 6 characters",
    errorEmail: "Please enter a valid email",
    errorPassword: "Password must be at least 6 characters",
    errorMatch: "Passwords do not match",
    errorLogin: "Invalid email or password",
    errorExist: "Account already exists. Please sign in.",
    available: "internships found",
  },
  hi: {
    appTitle: "पीएम इंटर्नशिप योजना",
    appSubtitle: "अपने लिए सही इंटर्नशिप खोजें",
    loginTitle: "वापस स्वागत है",
    loginSubtitle: "अपने खाते में साइन इन करें",
    signupTitle: "खाता बनाएं",
    signupSubtitle: "हजारों छात्रों से जुड़ें",
    email: "ईमेल पता",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    loginBtn: "साइन इन करें →",
    signupBtn: "खाता बनाएं →",
    noAccount: "खाता नहीं है?",
    hasAccount: "पहले से खाता है?",
    signupLink: "साइन अप करें",
    loginLink: "साइन इन करें",
    logout: "लॉग आउट",
    step1: "आप क्या पढ़ रहे हैं?",
    step2: "आप किस वर्ष में हैं?",
    step3: "आप कहाँ से हैं?",
    step4: "आपको किस काम में रुचि है?",
    step5: "क्या आप काम के लिए यात्रा कर सकते हैं?",
    yes_travel: "हाँ, यात्रा कर सकता/सकती हूँ",
    no_travel: "घर के पास रहना चाहता/चाहती हूँ",
    findBtn: "इंटर्नशिप खोजें →",
    resultsTitle: "आपके लिए बेस्ट मैच",
    monthlyStipend: "/महीना",
    months: "महीने",
    remote: "घर से काम",
    whyThis: "यह क्यों?",
    applyNow: "आवेदन करें",
    save: "सेव",
    startOver: "← नई खोज",
    selectState: "अपना राज्य चुनें",
    year: "वर्ष",
    loading: "AI आपके लिए सबसे अच्छे विकल्प खोज रहा है...",
    loadingStep1: "आपकी प्रोफ़ाइल का विश्लेषण...",
    loadingStep2: "इंटर्नशिप सूची स्कैन करना...",
    loadingStep3: "प्रासंगिकता के अनुसार रैंकिंग...",
    noResults: "कोई मैच नहीं मिला। अपनी प्राथमिकताएं बदलें।",
    interests_prompt: "जो भी लागू हो चुनें",
    namePlaceholder: "अपना नाम लिखें",
    emailPlaceholder: "आपका@ईमेल.com",
    passwordPlaceholder: "कम से कम 6 अक्षर",
    errorEmail: "सही ईमेल दर्ज करें",
    errorPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    errorMatch: "पासवर्ड मेल नहीं खाते",
    errorLogin: "गलत ईमेल या पासवर्ड",
    errorExist: "खाता पहले से मौजूद है। साइन इन करें।",
    available: "इंटर्नशिप मिले",
  },
};

const STREAMS = [
  { value: "engineering", label: "Engineering", label_hi: "इंजीनियरिंग", icon: "⚙️" },
  { value: "arts",        label: "Arts",        label_hi: "कला",          icon: "🎨" },
  { value: "commerce",    label: "Commerce",    label_hi: "वाणिज्य",      icon: "💰" },
  { value: "science",     label: "Science",     label_hi: "विज्ञान",      icon: "🔬" },
  { value: "medical",     label: "Medical",     label_hi: "चिकित्सा",     icon: "🏥" },
  { value: "law",         label: "Law",         label_hi: "कानून",        icon: "⚖️" },
  { value: "other",       label: "Other",       label_hi: "अन्य",         icon: "📚" },
];

const INTERESTS = [
  { value: "computers",     label: "Computers & Tech",    label_hi: "कंप्यूटर",    icon: "💻" },
  { value: "outdoor",       label: "Working Outdoors",    label_hi: "बाहर काम",    icon: "🌳" },
  { value: "people",        label: "Helping People",      label_hi: "लोगों की मदद",icon: "🤝" },
  { value: "manufacturing", label: "Making Things",       label_hi: "निर्माण",     icon: "🏭" },
  { value: "data",          label: "Numbers & Data",      label_hi: "डेटा",        icon: "📊" },
  { value: "teaching",      label: "Teaching & Training", label_hi: "शिक्षण",      icon: "📚" },
  { value: "healthcare",    label: "Healthcare",          label_hi: "स्वास्थ्य",   icon: "❤️" },
  { value: "agriculture",   label: "Agriculture",         label_hi: "कृषि",        icon: "🌾" },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
  "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"
];

const SECTOR_COLORS = {
  technology:     { bg: "#EEF2FF", accent: "#4F46E5", emoji: "💻" },
  manufacturing:  { bg: "#FFF7ED", accent: "#EA580C", emoji: "🏭" },
  finance:        { bg: "#F0FDF4", accent: "#16A34A", emoji: "💰" },
  agriculture:    { bg: "#FEFCE8", accent: "#CA8A04", emoji: "🌾" },
  healthcare:     { bg: "#FFF1F2", accent: "#E11D48", emoji: "❤️" },
  ngo:            { bg: "#F0FDF4", accent: "#15803D", emoji: "🤝" },
  automotive:     { bg: "#F0F9FF", accent: "#0369A1", emoji: "🚗" },
  media:          { bg: "#FDF4FF", accent: "#9333EA", emoji: "📺" },
  government:     { bg: "#FFF7ED", accent: "#B45309", emoji: "🏛️" },
  pharma:         { bg: "#FFF1F2", accent: "#BE123C", emoji: "💊" },
  energy:         { bg: "#FFFBEB", accent: "#D97706", emoji: "⚡" },
  education:      { bg: "#EFF6FF", accent: "#1D4ED8", emoji: "📚" },
  logistics:      { bg: "#F8FAFC", accent: "#475569", emoji: "📦" },
  fmcg:           { bg: "#F0FDF4", accent: "#059669", emoji: "🛒" },
  infrastructure: { bg: "#F1F5F9", accent: "#334155", emoji: "🏗️" },
  environment:    { bg: "#ECFDF5", accent: "#047857", emoji: "🌍" },
  banking:        { bg: "#F0F9FF", accent: "#0284C7", emoji: "🏦" },
  retail:         { bg: "#FDF4FF", accent: "#7C3AED", emoji: "🛍️" },
  research:       { bg: "#EEF2FF", accent: "#4338CA", emoji: "🔬" },
};

const getSectorStyle = (sector) =>
  SECTOR_COLORS[sector?.toLowerCase()] || { bg: "#F8FAFC", accent: "#64748B", emoji: "💼" };

// ─── Anthropic AI Call ─────────────────────────────────────────────────────
async function fetchAIRecommendations(profile) {
  const prompt = `You are an internship matching engine for India's PM Internship Scheme. Return exactly 5 highly relevant, personalized internship recommendations for this specific student.

STUDENT PROFILE:
- Stream/Education: ${profile.stream}
- Year of Study: Year ${profile.year}
- Home State: ${profile.state}
- Interests: ${profile.interests.join(", ")}
- Willing to travel: ${profile.willing_to_travel ? "Yes, open to other states" : "No, prefers home state or remote"}

STRICT RULES:
1. Companies must be REAL Indian companies with actual India operations (Tata, Infosys, ISRO, NTPC, Apollo Hospitals, Amul, ITC, SBI, Flipkart, ONGC, Wipro, HUL, Mahindra, DRDO, Reliance, Bajaj, HDFC, Maruti, Coal India, BHEL, L&T, Nestle India, Dabur, etc.)
2. Each role must genuinely match the student's STREAM (${profile.stream}) AND INTERESTS (${profile.interests.join(", ")})
3. Locations must favor ${profile.state}${profile.willing_to_travel ? " and nearby states" : " — only show this state or remote roles"}
4. No more than 2 internships from the same sector
5. Match score (60-95) must reflect actual relevance — not all 90+
6. Stipend: ₹4000–₹15000/month
7. Duration: 2–6 months
8. why_this must be ONE specific sentence referencing THIS student's stream+interest+location combo

Return ONLY a valid JSON array with no markdown fences or extra text:
[
  {
    "internship_id": "PMI-AI-001",
    "company": "Real Company Name",
    "title": "Specific Role Title",
    "location_city": "City",
    "location_state": "Indian State",
    "stipend": 6000,
    "duration_months": 3,
    "sector": "technology",
    "is_remote": false,
    "match_score": 87,
    "match_reasons": ["Specific reason tied to profile", "Another specific reason"],
    "why_this": "One sentence why this specific student should apply."
  }
]

Valid sector values: technology, manufacturing, finance, agriculture, healthcare, ngo, automotive, media, government, pharma, energy, education, logistics, fmcg, infrastructure, environment, banking, retail, research`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content.map(b => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Persistent Storage helpers ────────────────────────────────────────────
async function getUsers() {
  try {
    const res = await window.storage.get("pmi_users");
    return res ? JSON.parse(res.value) : {};
  } catch { return {}; }
}

async function saveUsers(users) {
  try { await window.storage.set("pmi_users", JSON.stringify(users)); }
  catch (e) { console.error(e); }
}

async function getCurrentUser() {
  try {
    const res = await window.storage.get("pmi_current_user");
    return res ? JSON.parse(res.value) : null;
  } catch { return null; }
}

async function setCurrentUser(user) {
  try {
    if (user) await window.storage.set("pmi_current_user", JSON.stringify(user));
    else await window.storage.delete("pmi_current_user");
  } catch (e) { console.error(e); }
}

// ─── Shared UI ─────────────────────────────────────────────────────────────
const HEADER_STYLES = `
  @keyframes slideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; }
`;

function AppHeader({ lang, setLang, user, onLogout }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #F97316, #EA580C)",
      padding: "16px 20px 22px",
      boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {user
          ? <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>👤 {user.name}</div>
          : <div />
        }
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["en", "hi"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "3px 12px", borderRadius: 20, border: "none",
              background: lang === l ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
              color: lang === l ? "#EA580C" : "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
            }}>{l === "en" ? "EN" : "हि"}</button>
          ))}
          {onLogout && (
            <button onClick={onLogout} style={{
              padding: "3px 12px", borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.5)", background: "transparent",
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{T[lang].logout}</button>
          )}
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>
        🇮🇳 {T[lang].appTitle}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>{T[lang].appSubtitle}</div>
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i < step ? "#F97316" : "#E2E8F0",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

function MatchRing({ score }) {
  const color = score >= 80 ? "#16A34A" : score >= 60 ? "#F97316" : "#64748B";
  return (
    <div style={{
      width: 54, height: 54, borderRadius: "50%",
      border: `3px solid ${color}`, background: color + "18",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 900, color, lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: 8, color, fontWeight: 700, letterSpacing: "0.04em" }}>MATCH</span>
    </div>
  );
}

function InternshipCard({ data, lang, index }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = T[lang];
  const s = getSectorStyle(data.sector);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 16,
      border: `1px solid ${s.accent}25`,
      animation: `slideUp 0.4s ease ${index * 0.08}s both`,
    }}>
      <div style={{ background: s.bg, padding: "14px 16px 10px", borderBottom: `1px solid ${s.accent}20` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                color: s.accent, background: s.accent + "18", padding: "2px 8px", borderRadius: 20,
              }}>{data.sector}</span>
              {data.is_remote && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0369A1", background: "#E0F2FE", padding: "2px 8px", borderRadius: 20 }}>
                  🏠 {t.remote}
                </span>
              )}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 3 }}>{data.title}</div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>{data.company}</div>
          </div>
          <MatchRing score={data.match_score} />
        </div>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
            📍 {data.is_remote ? "Remote" : `${data.location_city}, ${data.location_state}`}
          </span>
          <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 700 }}>
            💰 ₹{Number(data.stipend).toLocaleString("en-IN")}{t.monthlyStipend}
          </span>
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
            📅 {data.duration_months} {t.months}
          </span>
        </div>

        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#B45309", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ✨ {t.whyThis}
          </div>
          <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.5 }}>{data.why_this}</div>
        </div>

        {data.match_reasons?.length > 0 && (
          <button onClick={() => setExpanded(!expanded)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: "#6366F1", fontWeight: 700,
            padding: "2px 0", marginBottom: expanded ? 8 : 12,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {expanded ? "▲" : "▼"} {data.match_reasons.length} reasons matched
          </button>
        )}

        {expanded && (
          <div style={{ marginBottom: 12 }}>
            {data.match_reasons.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#374151", marginBottom: 4 }}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span>{r}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => window.open("https://pminternship.mca.gov.in", "_blank")}
            style={{
              flex: 1, padding: "12px 0", background: s.accent, color: "#fff",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer",
            }}
          >{t.applyNow}</button>
          <button
            onClick={() => setSaved(!saved)}
            style={{
              width: 46, padding: "12px 0",
              background: saved ? "#F0FDF4" : "#F8FAFC",
              color: saved ? "#16A34A" : "#64748B",
              border: `1px solid ${saved ? "#86EFAC" : "#E2E8F0"}`,
              borderRadius: 10, fontSize: 18, cursor: "pointer",
            }}
          >{saved ? "✓" : "🔖"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────
function AuthScreen({ lang, setLang, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const t = T[lang];

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async () => {
    if (!form.email.includes("@"))                            { setError(t.errorEmail); return; }
    if (form.password.length < 6)                            { setError(t.errorPassword); return; }
    if (mode === "signup" && form.password !== form.confirm)  { setError(t.errorMatch); return; }
    setBusy(true);

    const users = await getUsers();

    if (mode === "login") {
      const u = users[form.email];
      if (!u || u.password !== form.password) { setError(t.errorLogin); setBusy(false); return; }
      const obj = { email: form.email, name: u.name };
      await setCurrentUser(obj);
      onAuth(obj);
    } else {
      if (users[form.email]) { setError(t.errorExist); setBusy(false); return; }
      const name = form.name.trim() || form.email.split("@")[0];
      users[form.email] = { password: form.password, name };
      await saveUsers(users);
      const obj = { email: form.email, name };
      await setCurrentUser(obj);
      onAuth(obj);
    }
    setBusy(false);
  };

  const inp = {
    width: "100%", padding: "13px 16px", fontSize: 15,
    borderRadius: 12, border: "2px solid #E2E8F0",
    outline: "none", fontFamily: "inherit",
    background: "#FAFAFA", marginBottom: 12,
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF7F0, #FEF3C7, #ECFDF5)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{HEADER_STYLES}</style>
      <AppHeader lang={lang} setLang={setLang} />

      <div style={{ display: "flex", justifyContent: "center", padding: "28px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "#fff", borderRadius: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          padding: "28px 24px",
          animation: "slideUp 0.4s ease",
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 4 }}>
            {mode === "login" ? t.loginTitle : t.signupTitle}
          </div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
            {mode === "login" ? t.loginSubtitle : t.signupSubtitle}
          </div>

          {mode === "signup" && (
            <input placeholder={t.namePlaceholder} value={form.name}
              onChange={e => update("name", e.target.value)} style={inp} />
          )}
          <input type="email" placeholder={t.emailPlaceholder} value={form.email}
            onChange={e => update("email", e.target.value)} style={inp} />
          <input type="password" placeholder={t.passwordPlaceholder} value={form.password}
            onChange={e => update("password", e.target.value)} style={inp} />
          {mode === "signup" && (
            <input type="password" placeholder={t.confirmPassword} value={form.confirm}
              onChange={e => update("confirm", e.target.value)} style={inp} />
          )}

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={busy} style={{
            width: "100%", padding: "14px 0",
            background: "linear-gradient(135deg, #F97316, #EA580C)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 800, cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.8 : 1,
            boxShadow: "0 4px 12px rgba(249,115,22,0.35)", marginBottom: 16,
          }}>
            {busy
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  {lang === "hi" ? "कृपया प्रतीक्षा करें..." : "Please wait..."}
                </span>
              : (mode === "login" ? t.loginBtn : t.signupBtn)
            }
          </button>

          <div style={{ textAlign: "center", fontSize: 14, color: "#64748B" }}>
            {mode === "login" ? t.noAccount : t.hasAccount}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setForm({ name:"",email:"",password:"",confirm:"" }); }}
              style={{ background: "none", border: "none", color: "#F97316", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              {mode === "login" ? t.signupLink : t.loginLink}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────
function LoadingScreen({ lang }) {
  const t = T[lang];
  const [phase, setPhase] = useState(0);
  const phases = [t.loadingStep1, t.loadingStep2, t.loadingStep3];
  useEffect(() => {
    const id = setInterval(() => setPhase(p => Math.min(p + 1, 2)), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #FFF7F0, #FEF3C7, #ECFDF5)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 28, padding: 32,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "5px solid #FED7AA", borderTop: "5px solid #F97316", animation: "spin 0.9s linear infinite" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>{t.loading}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phases.map((ph, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= phase ? 1 : 0.3, transition: "opacity 0.5s", fontSize: 13, color: "#475569" }}>
              <span>{i < phase ? "✅" : i === phase ? "⏳" : "○"}</span>{ph}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Results Screen ────────────────────────────────────────────────────────
function ResultsScreen({ results, lang, profile, user, onBack }) {
  const t = T[lang];
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{HEADER_STYLES}</style>
      <div style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", padding: "16px 20px 20px", boxShadow: "0 4px 20px rgba(249,115,22,0.25)" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          {t.startOver}
        </button>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{t.resultsTitle}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>
          {lang === "hi" ? `नमस्ते ${user.name}` : `Hi ${user.name}`} · {results.length} {t.available}
        </div>
      </div>

      <div style={{ padding: "16px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", border: "1px solid #E2E8F0", fontSize: 13, color: "#475569", marginBottom: 16 }}>
          <span style={{ color: "#F97316", fontWeight: 700 }}>🤖 AI matched: </span>
          Year {profile.year} {profile.stream} from {profile.state} · interested in {profile.interests.join(", ")}
        </div>

        {results.length === 0
          ? <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>{t.noResults}</div>
          : results.map((rec, i) => <InternshipCard key={rec.internship_id || i} data={rec} lang={lang} index={i} />)
        }
      </div>
    </div>
  );
}

// ─── Profile Form ──────────────────────────────────────────────────────────
function ProfileForm({ lang, setLang, user, onLogout, onResults }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ stream: "", year: null, state: "", interests: [], willing_to_travel: false });
  const [busy, setBusy] = useState(false);
  const t = T[lang];
  const TOTAL = 5;

  const canProceed = () => {
    if (step === 0) return !!profile.stream;
    if (step === 1) return !!profile.year;
    if (step === 2) return !!profile.state;
    if (step === 3) return profile.interests.length > 0;
    return true;
  };

  const toggleInterest = (v) => setProfile(p => ({
    ...p,
    interests: p.interests.includes(v) ? p.interests.filter(x => x !== v) : [...p.interests, v],
  }));

  const handleSubmit = async () => {
    setBusy(true);
    try {
      const recs = await fetchAIRecommendations({ ...profile, name: user.name, language: lang });
      onResults(recs, profile);
    } catch (e) {
      console.error("AI error:", e);
      onResults([], profile);
    }
    setBusy(false);
  };

  if (busy) return <LoadingScreen lang={lang} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF7F0, #FEF3C7, #ECFDF5)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{HEADER_STYLES}</style>
      <AppHeader lang={lang} setLang={v => setLang(v)} user={user} onLogout={onLogout} />

      <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
        <ProgressBar step={step + 1} total={TOTAL} />

        {/* Step 0 — Stream */}
        {step === 0 && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>{t.step1}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {STREAMS.map(s => (
                <button key={s.value} onClick={() => setProfile(p => ({ ...p, stream: s.value }))} style={{
                  padding: "16px 12px", borderRadius: 14,
                  border: `2px solid ${profile.stream === s.value ? "#F97316" : "#E2E8F0"}`,
                  background: profile.stream === s.value ? "#FFF7ED" : "#fff",
                  cursor: "pointer", textAlign: "center",
                  transform: profile.stream === s.value ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: profile.stream === s.value ? "#EA580C" : "#334155" }}>
                    {lang === "hi" ? s.label_hi : s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Year */}
        {step === 1 && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>{t.step2}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1,2,3,4,5].map(y => (
                <button key={y} onClick={() => setProfile(p => ({ ...p, year: y }))} style={{
                  padding: "15px 20px", borderRadius: 12,
                  border: `2px solid ${profile.year === y ? "#F97316" : "#E2E8F0"}`,
                  background: profile.year === y ? "#FFF7ED" : "#fff",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: profile.year === y ? "#F97316" : "#F1F5F9",
                    color: profile.year === y ? "#fff" : "#64748B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 800, flexShrink: 0,
                  }}>{y}</div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: profile.year === y ? "#EA580C" : "#334155" }}>
                    {y === 5 ? (lang === "hi" ? "स्नातक / अंतिम वर्ष" : "Graduate / Final Year") : `${t.year} ${y}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — State */}
        {step === 2 && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>{t.step3}</div>
            <select
              value={profile.state}
              onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
              style={{
                width: "100%", padding: "14px 16px", fontSize: 16,
                borderRadius: 12, border: "2px solid #E2E8F0",
                background: "#fff", outline: "none", fontFamily: "inherit",
                color: profile.state ? "#0F172A" : "#94A3B8", appearance: "none",
              }}
            >
              <option value="">{t.selectState}</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Step 3 — Interests */}
        {step === 3 && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{t.step4}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 18 }}>{t.interests_prompt}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {INTERESTS.map(i => {
                const sel = profile.interests.includes(i.value);
                return (
                  <button key={i.value} onClick={() => toggleInterest(i.value)} style={{
                    padding: "14px 10px", borderRadius: 12,
                    border: `2px solid ${sel ? "#F97316" : "#E2E8F0"}`,
                    background: sel ? "#FFF7ED" : "#fff",
                    cursor: "pointer", textAlign: "center",
                    position: "relative", transition: "all 0.2s",
                  }}>
                    {sel && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 11, fontWeight: 800, color: "#F97316" }}>✓</div>}
                    <div style={{ fontSize: 26, marginBottom: 5 }}>{i.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: sel ? "#EA580C" : "#475569", lineHeight: 1.3 }}>
                      {lang === "hi" ? i.label_hi : i.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Travel */}
        {step === 4 && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>{t.step5}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { val: false, label: t.no_travel, icon: "🏡", desc: lang === "hi" ? "अपने जिले/राज्य के पास" : "Within your district or state" },
                { val: true,  label: t.yes_travel, icon: "✈️", desc: lang === "hi" ? "पूरे भारत में अवसर" : "Opportunities across India" },
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => setProfile(p => ({ ...p, willing_to_travel: opt.val }))} style={{
                  padding: "18px 20px", borderRadius: 14,
                  border: `2px solid ${profile.willing_to_travel === opt.val ? "#F97316" : "#E2E8F0"}`,
                  background: profile.willing_to_travel === opt.val ? "#FFF7ED" : "#fff",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 32 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: profile.willing_to_travel === opt.val ? "#EA580C" : "#0F172A", marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              padding: "14px 20px", borderRadius: 12, border: "2px solid #E2E8F0",
              background: "#fff", fontSize: 14, fontWeight: 700, color: "#64748B", cursor: "pointer",
            }}>← Back</button>
          )}
          <button
            disabled={!canProceed()}
            onClick={() => step < TOTAL - 1 ? setStep(s => s + 1) : handleSubmit()}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
              background: canProceed() ? "linear-gradient(135deg, #F97316, #EA580C)" : "#E2E8F0",
              color: canProceed() ? "#fff" : "#94A3B8",
              fontSize: 15, fontWeight: 800,
              cursor: canProceed() ? "pointer" : "not-allowed",
              boxShadow: canProceed() ? "0 4px 12px rgba(249,115,22,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {step === TOTAL - 1 ? t.findBtn : "Continue →"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#CBD5E1" }}>
          {step + 1} / {TOTAL}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState(null);
  const [lastProfile, setLastProfile] = useState(null);

  useEffect(() => {
    getCurrentUser().then(u => { if (u) setUser(u); setChecked(true); });
  }, []);

  const handleLogout = async () => {
    await setCurrentUser(null);
    setUser(null);
    setResults(null);
  };

  if (!checked) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #FFF7F0, #FEF3C7, #ECFDF5)" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #FED7AA", borderTop: "4px solid #F97316", animation: "spin 0.9s linear infinite" }} />
    </div>
  );

  if (!user) return <AuthScreen lang={lang} setLang={setLang} onAuth={u => setUser(u)} />;

  if (results) return (
    <ResultsScreen
      results={results} lang={lang}
      profile={lastProfile} user={user}
      onBack={() => setResults(null)}
    />
  );

  return (
    <ProfileForm
      lang={lang} setLang={setLang}
      user={user} onLogout={handleLogout}
      onResults={(recs, prof) => { setResults(recs); setLastProfile(prof); }}
    />
  );
}
