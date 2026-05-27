import { useState, useEffect } from "react";

const AIRTABLE_BASE_ID = "app0CglR4la9Jalnw";
const USERS_TABLE_ID = "tblNMcBKZ8qnY9gRs";
const SESSION_LOGS_TABLE_ID = "tbl5GtDcTbdhN7i0t";
const AIRTABLE_API_KEY = "patvHfCFvJbD0hKUA.08bcff4a70feac08456e9147bd64e4d76deeec47aff9158b316eb44bf6273df9";
const AIRTABLE_MCP = { type: "url", url: "https://mcp.airtable.com/mcp", name: "airtable-mcp" };

async function airtableFetch(path, options = {}) {
  const res = await fetch(`https://api.airtable.com/v0/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res.json();
}

async function loginFromAirtable(email, password) {
  const formula = encodeURIComponent(`AND({Email}="${email.trim().toLowerCase()}",{Password}="${password}",{Status}="Active")`);
  const data = await airtableFetch(`${AIRTABLE_BASE_ID}/${USERS_TABLE_ID}?filterByFormula=${formula}`);
  if (!data.records || data.records.length === 0) return null;
  const r = data.records[0];
  const f = r.fields;
  return {
    id: r.id,
    name: f["Name"] || "",
    email: f["Email"] || "",
    role: f["Role"] || "",
    playerId: f["Linked Player ID"] || "",
    childId: f["Linked Player ID"] || "",
    childName: f["Linked Player Name"] || "",
  };
}

const PLAYERS_DATA = [
  {
    id: "recPaWuQLtussFtna", name: "Aaron", assignmentId: "recfOxJekU8UaVeZX",
    planName: "Upper Body + Full Body Strength", planType: "Performance",
    color: "#E53935", emoji: "💪", duration: 60,
    blocks: [
      { name: "Warm-Up", exercises: [
        { id: "a-wu-1", name: "Jump Rope", prescription: "3×1 min", sets: 3 },
        { id: "a-wu-2", name: "Arm Circles + Shoulder Rolls", prescription: "10 each", sets: 1 },
        { id: "a-wu-3", name: "Push-Up to Downward Dog", prescription: "2×8", sets: 2 },
        { id: "a-wu-4", name: "World's Greatest Stretch", prescription: "5 each side", sets: 1 },
      ]},
      { name: "Upper Body", exercises: [
        { id: "a-ub-1", name: "Flat Bench Press", prescription: "4×8, 90s rest", sets: 4 },
        { id: "a-ub-2", name: "Incline DB Press", prescription: "3×10, 60s rest", sets: 3 },
        { id: "a-ub-3", name: "Cable Tricep Pushdowns", prescription: "4×12, 45s rest", sets: 4 },
        { id: "a-ub-4", name: "Preacher Curls", prescription: "4×10, 60s rest", sets: 4 },
        { id: "a-ub-5", name: "Cable Curls", prescription: "3×12, 45s rest", sets: 3 },
        { id: "a-ub-6", name: "Landmine Press", prescription: "3×10 each arm", sets: 3 },
      ]},
      { name: "Full Body", exercises: [
        { id: "a-fb-1", name: "Trap Bar Deadlift", prescription: "4×6, 90s rest", sets: 4 },
        { id: "a-fb-2", name: "KB Goblet Squat", prescription: "3×15, 60s rest", sets: 3 },
        { id: "a-fb-3", name: "DB Renegade Row", prescription: "3×8 each side", sets: 3 },
        { id: "a-fb-4", name: "Balance Ball Plank + Shoulder Tap", prescription: "3×12 each", sets: 3 },
      ]},
      { name: "Cool Down", exercises: [
        { id: "a-cd-1", name: "Balance Ball Plank Hold", prescription: "3×30s", sets: 3 },
        { id: "a-cd-2", name: "Dead Bug", prescription: "3×8 each side", sets: 3 },
        { id: "a-cd-3", name: "Chest & Shoulder Stretch", prescription: "Hold 60s", sets: 1 },
      ]},
    ],
  },
  {
    id: "rectUtNasT2HwjUwe", name: "Noah", assignmentId: "recBbFWtxi2TKe035",
    planName: "Passing & Shooting Combination", planType: "Technical",
    color: "#1E88E5", emoji: "⚽", duration: 60,
    blocks: [
      { name: "Warm-Up", exercises: [{ id: "n-wu-1", name: "4v2 Rondo", prescription: "10 min", sets: 1 }]},
      { name: "Passing", exercises: [
        { id: "n-p-1", name: "Rebounder Wall Pass Combos", prescription: "3×8 each side", sets: 3 },
        { id: "n-p-2", name: "Cone Gate Circuit — Stationary", prescription: "3 min", sets: 1 },
        { id: "n-p-3", name: "Cone Gate Circuit — Moving Target", prescription: "3 min", sets: 1 },
        { id: "n-p-4", name: "Cone Gate Circuit — Defender Pole", prescription: "Competitive", sets: 1 },
      ]},
      { name: "Shooting", exercises: [
        { id: "n-s-1", name: "Rebounder to Shoot (Left)", prescription: "5 reps", sets: 1 },
        { id: "n-s-2", name: "Rebounder to Shoot (Right)", prescription: "5 reps", sets: 1 },
        { id: "n-s-3", name: "Rebounder to Shoot + Hurdle", prescription: "5 reps each", sets: 2 },
        { id: "n-s-4", name: "Reaction Light Finishing", prescription: "10 reps", sets: 1 },
      ]},
      { name: "Cool Down", exercises: [
        { id: "n-cd-1", name: "Light Passing into Rebounder", prescription: "10 each foot", sets: 1 },
        { id: "n-cd-2", name: "Hip Flexor + Hamstring Stretch", prescription: "30–60s each", sets: 1 },
      ]},
    ],
  },
  {
    id: "rec88HsXp6OYXgzg3", name: "Alexander", assignmentId: "reczaxzAUFmVSGXf3",
    planName: "Passing & Shooting Combination", planType: "Technical",
    color: "#43A047", emoji: "🎯", duration: 60,
    blocks: [
      { name: "Warm-Up", exercises: [{ id: "al-wu-1", name: "4v2 Rondo", prescription: "10 min", sets: 1 }]},
      { name: "Passing", exercises: [
        { id: "al-p-1", name: "Rebounder Wall Pass Combos", prescription: "3×8 each side", sets: 3 },
        { id: "al-p-2", name: "Cone Gate Circuit — Stationary", prescription: "3 min", sets: 1 },
        { id: "al-p-3", name: "Cone Gate Circuit — Moving Target", prescription: "3 min", sets: 1 },
        { id: "al-p-4", name: "Cone Gate Circuit — Defender Pole", prescription: "Competitive", sets: 1 },
      ]},
      { name: "Shooting", exercises: [
        { id: "al-s-1", name: "Rebounder to Shoot (Left)", prescription: "5 reps", sets: 1 },
        { id: "al-s-2", name: "Rebounder to Shoot (Right)", prescription: "5 reps", sets: 1 },
        { id: "al-s-3", name: "Rebounder to Shoot + Hurdle", prescription: "5 reps each", sets: 2 },
        { id: "al-s-4", name: "Reaction Light Finishing", prescription: "10 reps", sets: 1 },
      ]},
      { name: "Cool Down", exercises: [
        { id: "al-cd-1", name: "Light Passing into Rebounder", prescription: "10 each foot", sets: 1 },
        { id: "al-cd-2", name: "Hip Flexor + Hamstring Stretch", prescription: "30–60s each", sets: 1 },
      ]},
    ],
  },
];

const C = {
  dark: "#0A1628", darkCard: "#111E35", darkBorder: "#1C2D4A",
  blue: "#2563EB", blueLight: "#3B82F6", blueFade: "#1E3A5F",
  text: "#F0F4FF", textMuted: "#7A92B8", textDim: "#4A6080",
  success: "#10B981", warning: "#F59E0B", danger: "#EF4444",
};

const inp = (extra = {}) => ({
  width: "100%", boxSizing: "border-box",
  background: C.darkCard, border: `1px solid ${C.darkBorder}`,
  borderRadius: 8, padding: "10px 14px",
  color: C.text, fontSize: 14, outline: "none",
  fontFamily: "'DM Mono', monospace", ...extra,
});

const btn = (bg, extra = {}) => ({
  background: bg, color: "#fff", border: "none",
  borderRadius: 8, padding: "10px 20px",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
  letterSpacing: 0.3, transition: "opacity 0.2s", ...extra,
});

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      mcp_servers: [AIRTABLE_MCP],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin, onRequestAccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true); setError("");
    try {
      const user = await loginFromAirtable(email, password);
      if (user) { onLogin(user); }
      else { setError("Invalid email or password."); }
    } catch { setError("Connection error. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚽</div>
          <div style={{ color: C.text, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Soccer Training DB</div>
          <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Player Portal</div>
        </div>
        <div style={{ background: C.darkCard, borderRadius: 16, padding: 24, border: `1px solid ${C.darkBorder}` }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>EMAIL</div>
            <input style={inp()} type="email" value={email} placeholder="your@email.com"
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>PASSWORD</div>
            <input style={inp()} type="password" value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <button style={btn(C.blue, { width: "100%", padding: 14, fontSize: 15 })}
            onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }}>
              <button onClick={() => onRequestAccess("soccer")}
                style={{ background: "transparent", border: "none", color: C.blueLight, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                ⚽ Soccer Access
              </button>
              <span style={{ color: C.textDim, fontSize: 12 }}>·</span>
              <button onClick={() => onRequestAccess("fitness")}
                style={{ background: "transparent", border: "none", color: "#FF6B35", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                💪 Fitness Access
              </button>
            </div>
            <span style={{ color: C.textDim, fontSize: 11 }}>
              Have an account? Contact your coach.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REQUEST ACCESS ───────────────────────────────────────────────────────────
function RequestAccess({ onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "player", playerName: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const linkedPlayer = form.role !== "coach" ? form.playerName : "";
    const linkedPlayerId = PLAYERS_DATA.find(p => p.name.toLowerCase() === linkedPlayer.toLowerCase())?.id || "";
    try {
      await callClaude(
        `Create a record in Airtable base ${AIRTABLE_BASE_ID}, table ${USERS_TABLE_ID} with these fields: Email: "${form.email.toLowerCase()}", Name: "${form.name}", Password: "${form.password}", Role: "${form.role}", Status: "Pending", Linked Player Name: "${linkedPlayer}", Linked Player ID: "${linkedPlayerId}", Requested At: "${new Date().toISOString()}". Confirm when done.`
      );
      setDone(true);
    } catch { setError("Submission failed. Try again."); }
    setLoading(false);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ color: C.text, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Request Sent!</div>
        <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>Your coach will review and approve your access. You'll be able to log in once approved.</div>
        <button onClick={onBack} style={btn(C.blue, { padding: "12px 32px" })}>Back to Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>⚽</div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>Request Access</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Your coach will approve your request</div>
        </div>
        <div style={{ background: C.darkCard, borderRadius: 16, padding: 24, border: `1px solid ${C.darkBorder}` }}>
          {[
            { label: "FULL NAME", key: "name", type: "text", placeholder: "Your full name" },
            { label: "EMAIL", key: "email", type: "email", placeholder: "your@email.com" },
            { label: "PASSWORD", key: "password", type: "password", placeholder: "Choose a password" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>{f.label}</div>
              <input style={inp()} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>I AM A</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["player", "parent", "coach"].map(r => (
                <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `2px solid ${form.role === r ? C.blue : C.darkBorder}`,
                    background: form.role === r ? C.blueFade : "transparent", color: form.role === r ? C.text : C.textMuted,
                    cursor: "pointer", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {form.role !== "coach" && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>
                {form.role === "parent" ? "MY CHILD'S NAME" : "MY NAME (PLAYER)"}
              </div>
              <select style={{ ...inp(), appearance: "none" }} value={form.playerName}
                onChange={e => setForm(p => ({ ...p, playerName: e.target.value }))}>
                <option value="">Select player...</option>
                {PLAYERS_DATA.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          )}
          {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <button onClick={submit} disabled={loading} style={btn(C.blue, { width: "100%", padding: 14 })}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          <button onClick={onBack} style={{ ...btn(C.darkBorder, { width: "100%", padding: 12, marginTop: 8 }), color: C.textMuted }}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ user, activeTab, setActiveTab, tabs, onLogout }) {
  const roleColors = { coach: C.warning, player: C.blue, parent: C.success };
  return (
    <div style={{ background: C.darkCard, borderBottom: `1px solid ${C.darkBorder}`, padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <span style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>Soccer Training DB</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, background: roleColors[user.role] + "33", color: roleColors[user.role],
            border: `1px solid ${roleColors[user.role]}55`, borderRadius: 20, padding: "2px 8px", fontWeight: 700, textTransform: "uppercase" }}>
            {user.role}
          </span>
          <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.darkBorder}`,
            borderRadius: 6, padding: "4px 10px", color: C.textMuted, fontSize: 11, cursor: "pointer" }}>
            Out
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
              color: activeTab === t.id ? C.blueLight : C.textMuted, fontSize: 12, fontWeight: 700,
              borderBottom: activeTab === t.id ? `2px solid ${C.blueLight}` : "2px solid transparent",
              whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SESSION LOGGER ───────────────────────────────────────────────────────────
function buildExState(player) {
  const s = {};
  player.blocks.forEach(b => b.exercises.forEach(ex => {
    s[ex.id] = { sets: Array.from({ length: ex.sets }, () => ({ reps: "", weight: "", note: "" })), exerciseNote: "" };
  }));
  return s;
}

const setInp = { border: "1px solid #1C2D4A", borderRadius: 5, padding: "4px 6px", fontSize: 11,
  outline: "none", width: "100%", boxSizing: "border-box", background: "#0D1825", color: "#F0F4FF", fontFamily: "monospace" };

function ExCard({ exercise, exData, onChange, color }) {
  const [open, setOpen] = useState(false);
  const any = exData.sets.some(s => s.reps !== "");
  const all = exData.sets.length > 0 && exData.sets.every(s => s.reps !== "");
  return (
    <div style={{ border: `1px solid ${all ? color : any ? color + "55" : C.darkBorder}`, borderRadius: 10, marginBottom: 6, overflow: "hidden", background: all ? color + "15" : C.darkCard }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: all ? color : any ? color + "88" : C.textDim, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{exercise.name}</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{exercise.prescription}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {all && <span style={{ fontSize: 9, background: color, color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>✓</span>}
          <span style={{ color: C.textDim }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 12px 10px", borderTop: `1px solid ${C.darkBorder}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 2fr", gap: 4, margin: "8px 0 4px" }}>
            <span /><span style={{ fontSize: 9, color: C.textDim }}>REPS</span>
            <span style={{ fontSize: 9, color: C.textDim }}>WT</span>
            <span style={{ fontSize: 9, color: C.textDim }}>NOTE</span>
          </div>
          {exData.sets.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 2fr", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: C.textDim, textAlign: "center", lineHeight: "26px" }}>S{i+1}</span>
              <input style={setInp} placeholder="Reps" value={s.reps} onChange={e => { const u=[...exData.sets]; u[i]={...s,reps:e.target.value}; onChange({...exData,sets:u}); }} />
              <input style={setInp} placeholder="Wt" value={s.weight} onChange={e => { const u=[...exData.sets]; u[i]={...s,weight:e.target.value}; onChange({...exData,sets:u}); }} />
              <input style={setInp} placeholder="Note" value={s.note} onChange={e => { const u=[...exData.sets]; u[i]={...s,note:e.target.value}; onChange({...exData,sets:u}); }} />
            </div>
          ))}
          <textarea placeholder="Exercise notes..." value={exData.exerciseNote} rows={2}
            onChange={e => onChange({...exData, exerciseNote: e.target.value})}
            style={{...setInp, marginTop: 6, resize: "none", width: "100%", padding: "6px 8px"}} />
        </div>
      )}
    </div>
  );
}

function SessionLogger({ player }) {
  const [exercises, setExercises] = useState(() => buildExState(player));
  const [activeBlock, setActiveBlock] = useState(player.blocks[0].name);
  const [rating, setRating] = useState(0);
  const [coachNotes, setCoachNotes] = useState("");
  const [areasToImprove, setAreasToImprove] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const allEx = player.blocks.flatMap(b => b.exercises);
  const completed = allEx.filter(ex => exercises[ex.id]?.sets.some(s => s.reps !== "")).length;
  const pct = Math.round((completed / allEx.length) * 100);
  const currentBlock = player.blocks.find(b => b.name === activeBlock);
  const updateEx = (id, data) => setExercises(prev => ({ ...prev, [id]: data }));

  const save = async () => {
    setSaving(true); setError("");
    const today = new Date().toISOString().split("T")[0];
    const title = `${player.name} — ${player.planType} ${today}`;
    let notes = [];
    player.blocks.forEach(b => b.exercises.forEach(ex => {
      const d = exercises[ex.id];
      const lines = d.sets.filter(s => s.reps).map((s, i) => `  Set ${i+1}: ${s.reps} reps${s.weight ? " @ "+s.weight : ""}${s.note ? " — "+s.note : ""}`).join("\n");
      if (lines) notes.push(`${ex.name}\n${lines}`);
      if (d.exerciseNote) notes.push(`  💬 ${d.exerciseNote}`);
    }));
    try {
      await callClaude(`Save session log to Airtable. Base: ${AIRTABLE_BASE_ID}, Table: ${SESSION_LOGS_TABLE_ID}. Session Title: "${title}", Session Date: "${today}", Session Type: "${player.planType}", Duration: ${player.duration}, Coach Notes: ${JSON.stringify(coachNotes || notes.join("\n\n").slice(0,400))}, Areas to Improve: ${JSON.stringify(areasToImprove)}, Progress Notes: ${JSON.stringify(progressNotes || notes.join("\n\n"))}, Plan Assignment: ["${player.assignmentId}"], Player: ["${player.id}"]. Confirm when saved.`);
      setSaved(true);
    } catch { setError("Save failed. Try again."); }
    setSaving(false);
  };

  return (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ background: player.color + "20", border: `1px solid ${player.color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{player.planType.toUpperCase()}</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginTop: 2 }}>{player.emoji} {player.name}</div>
            <div style={{ color: C.textMuted, fontSize: 11 }}>{player.planName}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: player.color, fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{pct}%</div>
            <div style={{ color: C.textDim, fontSize: 10 }}>{completed}/{allEx.length}</div>
          </div>
        </div>
        <div style={{ marginTop: 8, background: C.darkBorder, borderRadius: 4, height: 4 }}>
          <div style={{ height: 4, borderRadius: 4, background: player.color, width: `${pct}%`, transition: "width 0.3s" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto" }}>
        {player.blocks.map(b => (
          <button key={b.name} onClick={() => setActiveBlock(b.name)}
            style={{ padding: "5px 12px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              background: activeBlock === b.name ? player.color : C.darkBorder, color: activeBlock === b.name ? "#fff" : C.textMuted }}>
            {b.name}
          </button>
        ))}
      </div>
      {currentBlock?.exercises.map(ex => (
        <ExCard key={ex.id} exercise={ex} exData={exercises[ex.id]} onChange={d => updateEx(ex.id, d)} color={player.color} />
      ))}
      <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginTop: 8 }}>
        <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>SESSION NOTES</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{ flex: 1, height: 32, borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14, background: rating >= n ? "#FFB300" : C.darkBorder }}>⭐</button>
          ))}
        </div>
        <textarea placeholder="Coach notes..." value={coachNotes} rows={2} onChange={e => setCoachNotes(e.target.value)} style={{...inp(), marginBottom: 8, resize: "none", fontSize: 12}} />
        <textarea placeholder="Areas to improve..." value={areasToImprove} rows={2} onChange={e => setAreasToImprove(e.target.value)} style={{...inp(), marginBottom: 8, resize: "none", fontSize: 12}} />
        <textarea placeholder="Progress notes..." value={progressNotes} rows={2} onChange={e => setProgressNotes(e.target.value)} style={{...inp(), resize: "none", fontSize: 12}} />
      </div>
      <div style={{ marginTop: 12 }}>
        {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 8, textAlign: "center" }}>{error}</div>}
        {saved ? (
          <div style={{ background: C.success + "20", border: `1px solid ${C.success}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>✅</div>
            <div style={{ color: C.success, fontWeight: 700, marginTop: 4 }}>Session saved to Airtable!</div>
          </div>
        ) : (
          <button onClick={save} disabled={saving || completed === 0}
            style={btn(completed === 0 ? C.textDim : player.color, { width: "100%", padding: 14, fontSize: 14, cursor: completed === 0 ? "not-allowed" : "pointer" })}>
            {saving ? "Saving..." : `Save Session${completed > 0 ? ` (${completed}/${allEx.length})` : ""}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MANAGE USERS (Coach) ─────────────────────────────────────────────────────
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "player", playerName: "" });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await callClaude(`List ALL records from Airtable base ${AIRTABLE_BASE_ID}, table ${USERS_TABLE_ID}. Return ONLY a JSON array of objects, each with: id, name (from Name field), email (from Email field), role (from Role field), status (from Status field), playerName (from Linked Player Name field). No extra text.`);
      const match = result.match(/\[[\s\S]*\]/);
      if (match) setUsers(JSON.parse(match[0]));
    } catch {}
    setLoading(false); setLoaded(true);
  };

  const approveUser = async (userId) => {
    await callClaude(`Update record ${userId} in Airtable base ${AIRTABLE_BASE_ID}, table ${USERS_TABLE_ID}. Set Status to "Active". Confirm when done.`);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Active" } : u));
  };

  const denyUser = async (userId) => {
    await callClaude(`Update record ${userId} in Airtable base ${AIRTABLE_BASE_ID}, table ${USERS_TABLE_ID}. Set Status to "Denied". Confirm when done.`);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Denied" } : u));
  };

  const createUser = async () => {
    if (!form.name || !form.email || !form.password) { setMsg("Fill in all fields."); return; }
    setCreating(true); setMsg("");
    const linkedPlayerId = PLAYERS_DATA.find(p => p.name.toLowerCase() === form.playerName.toLowerCase())?.id || "";
    await callClaude(`Create a record in Airtable base ${AIRTABLE_BASE_ID}, table ${USERS_TABLE_ID}. Fields: Email: "${form.email.toLowerCase()}", Name: "${form.name}", Password: "${form.password}", Role: "${form.role}", Status: "Active", Linked Player Name: "${form.playerName}", Linked Player ID: "${linkedPlayerId}", Requested At: "${new Date().toISOString()}". Confirm when done.`);
    setMsg(`✅ Account created for ${form.name}`);
    setForm({ name: "", email: "", password: "", role: "player", playerName: "" });
    setCreating(false); setShowForm(false);
    loadUsers();
  };

  const statusColor = { Active: C.success, Pending: C.warning, Denied: C.danger };
  const pending = users.filter(u => u.status === "Pending");
  const active = users.filter(u => u.status === "Active");

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800 }}>Manage Users</div>
          <div style={{ color: C.textMuted, fontSize: 12 }}>Create accounts & approve requests</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadUsers} style={btn(C.darkBorder, { fontSize: 11, padding: "6px 12px" })}>
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
          <button onClick={() => setShowForm(!showForm)} style={btn(C.blue, { fontSize: 11, padding: "6px 12px" })}>
            + New Account
          </button>
        </div>
      </div>

      {msg && <div style={{ background: C.success + "20", border: `1px solid ${C.success}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: C.success, fontSize: 12 }}>{msg}</div>}

      {/* Create Account Form */}
      {showForm && (
        <div style={{ background: C.darkCard, border: `1px solid ${C.blue}44`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Create New Account</div>
          {[{ label: "NAME", key: "name", type: "text" }, { label: "EMAIL", key: "email", type: "email" }, { label: "PASSWORD", key: "password", type: "text" }].map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{f.label}</div>
              <input style={inp({ fontSize: 12 })} type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>ROLE</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["player", "parent", "coach"].map(r => (
                <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                  style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: `2px solid ${form.role === r ? C.blue : C.darkBorder}`,
                    background: form.role === r ? C.blueFade : "transparent", color: form.role === r ? C.text : C.textMuted,
                    cursor: "pointer", fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {form.role !== "coach" && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>LINKED PLAYER</div>
              <select style={{ ...inp({ fontSize: 12 }), appearance: "none" }} value={form.playerName} onChange={e => setForm(p => ({ ...p, playerName: e.target.value }))}>
                <option value="">Select player...</option>
                {PLAYERS_DATA.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={createUser} disabled={creating} style={btn(C.blue, { flex: 1, padding: 10 })}>{creating ? "Creating..." : "Create Account"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btn(C.darkBorder, { padding: "10px 16px" }), color: C.textMuted }}>Cancel</button>
          </div>
        </div>
      )}

      {!loaded && !loading && (
        <button onClick={loadUsers} style={btn(C.blue, { width: "100%", padding: 14 })}>Load Users</button>
      )}

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.warning, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>
            PENDING REQUESTS ({pending.length})
          </div>
          {pending.map(u => (
            <div key={u.id} style={{ background: C.darkCard, border: `1px solid ${C.warning}44`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                  <div style={{ color: C.textMuted, fontSize: 11 }}>{u.email}</div>
                  <div style={{ color: C.textMuted, fontSize: 11 }}>{u.role}{u.playerName ? ` · ${u.playerName}` : ""}</div>
                </div>
                <span style={{ fontSize: 10, background: C.warning + "30", color: C.warning, borderRadius: 12, padding: "3px 8px", fontWeight: 700 }}>PENDING</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => approveUser(u.id)} style={btn(C.success, { flex: 1, padding: "8px 4px", fontSize: 12 })}>✓ Approve</button>
                <button onClick={() => denyUser(u.id)} style={btn(C.danger, { flex: 1, padding: "8px 4px", fontSize: 12 })}>✗ Deny</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Users */}
      {active.length > 0 && (
        <div>
          <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>
            ACTIVE ACCOUNTS ({active.length})
          </div>
          {active.map(u => (
            <div key={u.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                <div style={{ color: C.textMuted, fontSize: 11 }}>{u.email} · {u.role}{u.playerName ? ` · ${u.playerName}` : ""}</div>
              </div>
              <span style={{ fontSize: 10, background: statusColor[u.status] + "25", color: statusColor[u.status],
                borderRadius: 12, padding: "3px 8px", fontWeight: 700 }}>{u.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COACH DASHBOARD ──────────────────────────────────────────────────────────
function CoachDashboard({ user, onLogout }) {
  const [section, setSection] = useState("soccer"); // soccer | fitness
  const [tab, setTab] = useState("players");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loggerPlayers, setLoggerPlayers] = useState([]);
  const [loggerView, setLoggerView] = useState(null);
  const [playerDetailView, setPlayerDetailView] = useState("session");

  const tabs = [
    { id: "players", label: "Players" },
    { id: "session", label: "Session Logger" },
    { id: "dashboard", label: "Dashboard" },
    { id: "plans", label: "Plans" },
    { id: "pmip", label: "PMIP" },
    { id: "team", label: "Team" },
    { id: "users", label: "Manage Users" },
  ];

  return (
    <div>
      {/* Section toggle */}
      <div style={{ background: "#0A1628", padding: "8px 16px", display: "flex", gap: 6, borderBottom: "1px solid #1C2D4A" }}>
        <button onClick={() => setSection("soccer")}
          style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
            background: section === "soccer" ? C.blue : C.darkBorder,
            color: section === "soccer" ? "#fff" : C.textMuted }}>
          ⚽ Soccer
        </button>
        <button onClick={() => setSection("fitness")}
          style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
            background: section === "fitness" ? "#FF6B35" : C.darkBorder,
            color: section === "fitness" ? "#fff" : C.textMuted }}>
          💪 Fitness
        </button>
      </div>
      {section === "fitness" ? <CoachFitnessSection user={user} onLogout={onLogout} /> : (
      <div>
      <TopNav user={user} activeTab={tab} setActiveTab={t => { setTab(t); setSelectedPlayer(null); }} tabs={tabs} onLogout={onLogout} />
      {tab === "players" && !selectedPlayer && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Players</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1 · 3 active</div>
          {PLAYERS_DATA.map(p => (
            <div key={p.id} onClick={() => setSelectedPlayer(p)}
              style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16, marginBottom: 10, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: p.color + "30", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.emoji}</div>
                  <div>
                    <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{p.planName}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, background: p.color + "25", color: p.color, border: `1px solid ${p.color}44`, borderRadius: 12, padding: "3px 10px", fontWeight: 700 }}>{p.planType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "players" && selectedPlayer && (
        <div>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.darkBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => setSelectedPlayer(null)} style={{ background: C.darkBorder, border: "none", borderRadius: 6, padding: "5px 10px", color: C.text, cursor: "pointer", fontSize: 12 }}>← Back</button>
              <span style={{ color: C.text, fontWeight: 700 }}>{selectedPlayer.emoji} {selectedPlayer.name}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["session", "assess", "profile"].map(v => (
                <button key={v} onClick={() => setPlayerDetailView(v)}
                  style={{ background: playerDetailView === v ? selectedPlayer.color : C.darkBorder, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {v === "session" ? "Session" : v === "assess" ? "Assessment" : "Profile"}
                </button>
              ))}
            </div>
          </div>
          {playerDetailView === "session" ? <SessionLogger player={selectedPlayer} /> : playerDetailView === "assess" ? <AssessmentForm player={selectedPlayer} /> : <PlayerProfile player={selectedPlayer} canEdit={true} />}
        </div>
      )}
      {tab === "session" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Session Logger</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Select players to log</div>
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>SELECT PLAYERS</div>
            <div style={{ display: "flex", gap: 8 }}>
              {PLAYERS_DATA.map(p => {
                const sel = loggerPlayers.includes(p.id);
                return (
                  <button key={p.id} onClick={() => setLoggerPlayers(prev => sel ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                    style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: `2px solid ${sel ? p.color : C.darkBorder}`, background: sel ? p.color + "20" : "transparent", cursor: "pointer" }}>
                    <div style={{ fontSize: 20 }}>{p.emoji}</div>
                    <div style={{ color: sel ? p.color : C.textMuted, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{p.name}</div>
                  </button>
                );
              })}
            </div>
            {loggerPlayers.length > 0 && (
              <button onClick={() => setLoggerView(loggerPlayers[0])} style={btn(C.blue, { width: "100%", marginTop: 12, padding: 12 })}>
                Start Session ({loggerPlayers.length} player{loggerPlayers.length > 1 ? "s" : ""})
              </button>
            )}
          </div>
          {loggerView && loggerPlayers.length > 0 && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {loggerPlayers.length > 1 && <button onClick={() => setLoggerView("split")} style={btn(loggerView === "split" ? C.blue : C.darkBorder, { fontSize: 11, padding: "6px 12px" })}>Split</button>}
                {loggerPlayers.map(pid => { const p = PLAYERS_DATA.find(pl => pl.id === pid); return <button key={pid} onClick={() => setLoggerView(pid)} style={btn(loggerView === pid ? p.color : C.darkBorder, { fontSize: 11, padding: "6px 12px" })}>{p.emoji} {p.name}</button>; })}
              </div>
              {loggerView === "split" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {loggerPlayers.map(pid => { const p = PLAYERS_DATA.find(pl => pl.id === pid); return <div key={pid} style={{ flex: 1, background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, overflow: "hidden" }}><SessionLogger player={p} /></div>; })}
                </div>
              ) : <SessionLogger player={PLAYERS_DATA.find(p => p.id === loggerView)} />}
            </div>
          )}
        </div>
      )}
      {tab === "dashboard" && <PerformanceDashboard />}
      {tab === "plans" && <TrainingPlans />}
      {tab === "pmip" && <PMIPView isCoach={true} />}
      {tab === "team" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Team Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[{ label: "Players", value: "3", color: C.blue }, { label: "Phase", value: "1 of 4", color: C.warning }, { label: "Status", value: "Active", color: C.success }].map(({ label, value, color }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ color, fontSize: 18, fontWeight: 800 }}>{value}</div>
                <div style={{ color: C.textMuted, fontSize: 10, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          {PLAYERS_DATA.map(p => (
            <div key={p.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{p.emoji}</span><span style={{ color: C.text, fontWeight: 700 }}>{p.name}</span></div>
                <span style={{ color: p.color, fontSize: 11, fontWeight: 700 }}>{p.planType}</span>
              </div>
              <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 6 }}>{p.planName}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.blocks.map(b => <span key={b.name} style={{ fontSize: 9, background: p.color + "20", color: p.color, border: `1px solid ${p.color}33`, borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>{b.name} ({b.exercises.length})</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "users" && <ManageUsers />}
    </div>
  );
}


// ─── PLAYER PROFILE ───────────────────────────────────────────────────────────
function PlayerProfile({ player, canEdit = false }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
  const [foot, setFoot] = useState("");
  const [jersey, setJersey] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await airtableFetch(`${AIRTABLE_BASE_ID}/tblpL5SzrgltxfRua/${player.id}`);
      if (data.fields) {
        const f = data.fields;
        if (f["Height (inches)"]) setHeight(String(f["Height (inches)"]));
        if (f["Weight lbs"]) setWeight(String(f["Weight lbs"]));
        if (f["Date of Birth"]) setDob(f["Date of Birth"]);
        if (f["Player Position"]) setPosition(f["Player Position"]);
        if (f["Preferred Foot"]) setFoot(f["Preferred Foot"]);
        if (f["Jersey No"]) setJersey(String(f["Jersey No"]));
      }
    } catch (e) {
      console.error("Profile load error:", e);
    }
    setLoading(false);
  };

  const bmi = height && weight
    ? ((parseFloat(weight) / (parseFloat(height) * parseFloat(height))) * 703).toFixed(1)
    : null;

  const bmiLabel = (b) => {
    const n = parseFloat(b);
    if (n < 18.5) return { label: "Underweight", color: "#64B5F6" };
    if (n < 25) return { label: "Healthy", color: "#10B981" };
    if (n < 30) return { label: "Overweight", color: "#F59E0B" };
    return { label: "High", color: "#EF4444" };
  };

  const heightFt = height ? `${Math.floor(parseFloat(height) / 12)}ft ${Math.round(parseFloat(height) % 12)}in` : "—";

  const save = async () => {
    setStatus("saving"); setMsg("");
    try {
      const fields = {};
      if (height) fields["Height (inches)"] = parseFloat(height);
      if (weight) fields["Weight lbs"] = parseFloat(weight);
      if (position) fields["Player Position"] = position;
      if (foot) fields["Preferred Foot"] = foot;
      if (jersey) fields["Jersey No"] = parseInt(jersey);
      if (dob) fields["Date of Birth"] = dob;
      const res = await airtableFetch(`${AIRTABLE_BASE_ID}/tblpL5SzrgltxfRua`, {
        method: "PATCH",
        body: JSON.stringify({ records: [{ id: player.id, fields }] }),
      });
      if (res.records) { setStatus("saved"); setMsg("Profile saved!"); setEditing(false); loadProfile(); }
      else { setStatus("error"); setMsg("Save failed: " + JSON.stringify(res).slice(0, 100)); }
    } catch (e) {
      setStatus("error"); setMsg("Error: " + e.message);
    }
  };

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ background: player.color + "20", border: `1px solid ${player.color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PLAYER PROFILE</div>
            <div style={{ color: C.text, fontSize: 20, fontWeight: 800, marginTop: 2 }}>{player.emoji} {player.name}</div>
          </div>
          {canEdit && !editing && !loading && (
            <button onClick={() => setEditing(true)}
              style={btn(player.color, { fontSize: 11, padding: "6px 14px" })}>Edit Profile</button>
          )}
          {canEdit && editing && (
            <button onClick={() => setEditing(false)}
              style={btn(C.darkBorder, { fontSize: 11, padding: "6px 14px" })}>Cancel</button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 30, color: C.textMuted }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: 12 }}>Loading profile...</div>
        </div>
      ) : (
      <div>
      {/* Status message */}
      {msg !== "" && (
        <div style={{ background: status === "error" ? C.danger + "20" : C.success + "20",
          border: `1px solid ${status === "error" ? C.danger : C.success}`,
          borderRadius: 8, padding: 10, marginBottom: 12,
          color: status === "error" ? C.danger : C.success, fontSize: 12 }}>
          {msg}
        </div>
      )}

      {!editing ? (
        <div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "Height", value: height ? heightFt : "Not set" },
              { label: "Weight", value: weight ? `${weight} lbs` : "Not set" },
              { label: "Date of Birth", value: dob || "Not set" },
              { label: "Preferred Foot", value: foot || "Not set" },
              { label: "Position", value: position || "Not set" },
              { label: "Jersey No", value: jersey ? `#${jersey}` : "Not set" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{label.toUpperCase()}</div>
                <div style={{ color: value === "Not set" ? C.textDim : C.text, fontSize: 13, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* BMI */}
          {bmi ? (
            <div style={{ background: C.darkCard, border: `1px solid ${bmiLabel(bmi).color}44`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>BODY MASS INDEX (BMI)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ color: bmiLabel(bmi).color, fontSize: 40, fontWeight: 800, fontFamily: "monospace" }}>{bmi}</div>
                <div>
                  <div style={{ background: bmiLabel(bmi).color + "25", color: bmiLabel(bmi).color,
                    border: `1px solid ${bmiLabel(bmi).color}44`, borderRadius: 12,
                    padding: "4px 14px", fontSize: 13, fontWeight: 700, display: "inline-block" }}>
                    {bmiLabel(bmi).label}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Auto-calculated from height & weight</div>
                </div>
              </div>
              <div style={{ marginTop: 12, background: C.darkBorder, borderRadius: 4, height: 6, display: "flex", overflow: "hidden" }}>
                {[{ c: "#64B5F6", w: "25%" }, { c: "#10B981", w: "35%" }, { c: "#F59E0B", w: "25%" }, { c: "#EF4444", w: "15%" }].map((s, i) => (
                  <div key={i} style={{ background: s.c, width: s.w }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {["Under", "Healthy", "Over", "High"].map(l => (
                  <span key={l} style={{ fontSize: 9, color: C.textDim }}>{l}</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ color: C.textMuted, fontSize: 12 }}>
                {canEdit ? "Enter height and weight above to calculate BMI." : "BMI not yet available. Ask your coach to update your profile."}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Edit form */
        <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 14, fontFamily: "monospace" }}>EDIT PROFILE</div>
          {[
            { label: "HEIGHT (inches, e.g. 68)", key: "height", val: height, set: setHeight, type: "number" },
            { label: "WEIGHT (lbs, e.g. 145)", key: "weight", val: weight, set: setWeight, type: "number" },
            { label: "DATE OF BIRTH", key: "dob", val: dob, set: setDob, type: "date" },
            { label: "JERSEY NUMBER", key: "jersey", val: jersey, set: setJersey, type: "number" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>{f.label}</div>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} style={inp({ fontSize: 13 })} />
            </div>
          ))}

          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>POSITION</div>
            <select value={position} onChange={e => setPosition(e.target.value)} style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
              <option value="">Select...</option>
              {["Forward", "Striker", "Winger", "Attacking Mid", "Midfielder", "Defensive Mid", "Defender", "Center Back", "Full Back", "Goalkeeper"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>PREFERRED FOOT</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Right", "Left", "Both"].map(f => (
                <button key={f} onClick={() => setFoot(f)}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 8,
                    border: `2px solid ${foot === f ? player.color : C.darkBorder}`,
                    background: foot === f ? player.color + "25" : "transparent",
                    color: foot === f ? player.color : C.textMuted,
                    cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Live BMI preview */}
          {height && weight && (
            <div style={{ background: C.blueFade, border: `1px solid ${C.blue}44`, borderRadius: 8, padding: 10, marginBottom: 12, textAlign: "center" }}>
              <span style={{ color: C.textMuted, fontSize: 11 }}>BMI Preview: </span>
              <span style={{ color: bmiLabel(bmi).color, fontSize: 16, fontWeight: 800 }}>{bmi}</span>
              <span style={{ color: bmiLabel(bmi).color, fontSize: 11, marginLeft: 8 }}>({bmiLabel(bmi).label})</span>
            </div>
          )}

          <button onClick={save} disabled={status === "saving"}
            style={btn(player.color, { width: "100%", padding: 13, fontSize: 14 })}>
            {status === "saving" ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}
      </div>
      )}
    </div>
  );
}




// ─── PMIP (Performance Metrics Improvement Plan) ─────────────────────────────
const PMIP_TABLE_ID = "tblYjw7DMnY2jaND3";
const EXERCISE_LIBRARY_TABLE_ID = "tbltTfCQ7l6J1elRj";
const ADULT_CLIENTS_TABLE_ID = "tblCZiNHXENidoVE7";
const ADULT_ASSESSMENTS_TABLE_ID = "tblRI0xV53jEjaBAg";
const ADULT_PLANS_TABLE_ID = "tblCWX5p22Z7wDpDj";
const ADULT_EXERCISE_LIBRARY_TABLE_ID = "tblqFlj8oRIjqkfgW";

const FOCUS_COLORS = {
  "Strength": "#EF4444", "Speed": "#1E88E5", "Quickness": "#10B981",
  "Core": "#8E24AA", "Combined": "#F59E0B",
};

function PMIPView({ playerName = null, isCoach = false }) {
  const [sessions, setSessions] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("sessions");
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "", category: "Strength", description: "", sets: "",
    repsOrDuration: "", rest: "", equipment: "", cue: "", targetMetric: "General Fitness",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessRes, libRes] = await Promise.all([
        airtableFetch(`${AIRTABLE_BASE_ID}/${PMIP_TABLE_ID}`),
        airtableFetch(`${AIRTABLE_BASE_ID}/${EXERCISE_LIBRARY_TABLE_ID}`),
      ]);
      if (sessRes.records) {
        const filtered = playerName
          ? sessRes.records.filter(r => (r.fields["Player Name"] || "").toLowerCase() === playerName.toLowerCase())
          : sessRes.records;
        setSessions(filtered);
      }
      if (libRes.records) setLibrary(libRes.records);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveExercise = async () => {
    if (!newExercise.name) { setSaveMsg("Exercise name required."); return; }
    setSaving(true); setSaveMsg("");
    try {
      const res = await airtableFetch(`${AIRTABLE_BASE_ID}/${EXERCISE_LIBRARY_TABLE_ID}`, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields: {
          "Exercise Name": newExercise.name,
          "Category": newExercise.category,
          "Description": newExercise.description,
          "Sets": newExercise.sets ? parseInt(newExercise.sets) : null,
          "Reps or Duration": newExercise.repsOrDuration,
          "Rest (seconds)": newExercise.rest ? parseInt(newExercise.rest) : null,
          "Equipment Needed": newExercise.equipment,
          "Coaching Cue": newExercise.cue,
          "Target Metric": newExercise.targetMetric,
          "Added By": "Coach",
          "Home Equipment Only": true,
        }}]}),
      });
      if (res.records) {
        setSaveMsg("Exercise saved to library!");
        setNewExercise({ name: "", category: "Strength", description: "", sets: "",
          repsOrDuration: "", rest: "", equipment: "", cue: "", targetMetric: "General Fitness" });
        setShowAddExercise(false);
        loadData();
      }
    } catch { setSaveMsg("Save failed. Try again."); }
    setSaving(false);
  };

  const dayOrder = { "Tuesday": 0, "Thursday": 1 };
  const sortedSessions = [...sessions].sort((a, b) =>
    (dayOrder[a.fields["Day"]] || 0) - (dayOrder[b.fields["Day"]] || 0)
  );

  if (selected) {
    const f = selected.fields;
    const focus = f["Focus Area"] || "";
    const color = FOCUS_COLORS[focus] || C.blue;
    return (
      <div style={{ padding: "12px 14px" }}>
        <button onClick={() => setSelected(null)}
          style={{ background: C.darkBorder, border: "none", borderRadius: 8, padding: "6px 14px",
            color: C.text, fontSize: 12, cursor: "pointer", marginBottom: 14 }}>
          Back
        </button>
        <div style={{ background: color + "15", border: `1px solid ${color}44`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ color: color, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
            {f["Day"]?.toUpperCase()} - PMIP - {f["Phase"]?.toUpperCase()}
          </div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>{f["Session Name"]}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {focus && <span style={{ fontSize: 10, background: color + "25", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{focus}</span>}
            {f["Duration (min)"] && <span style={{ fontSize: 10, background: C.darkBorder, color: C.textMuted, borderRadius: 6, padding: "2px 8px" }}>{f["Duration (min)"]} min</span>}
            {f["Status"] && <span style={{ fontSize: 10, background: C.success + "25", color: C.success, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{f["Status"]}</span>}
          </div>
        </div>

        {/* Target Metrics */}
        {f["Target Metrics"] && (
          <div style={{ background: "#FFB30015", border: "1px solid #FFB30044", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ color: "#FFB300", fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>TARGET METRICS</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{f["Target Metrics"]}</pre>
          </div>
        )}

        {/* Warm Up */}
        {f["Warm Up"] && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color: "#FFB300", fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>WARM UP</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{f["Warm Up"]}</pre>
          </div>
        )}

        {/* Main Block */}
        {f["Main Block"] && (
          <div style={{ background: C.darkCard, border: `1px solid ${color}44`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>MAIN BLOCK</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{f["Main Block"]}</pre>
          </div>
        )}

        {/* Finishers */}
        {f["Finishers"] && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color: "#EF4444", fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>FINISHERS</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{f["Finishers"]}</pre>
          </div>
        )}

        {/* Cool Down */}
        {f["Cool Down"] && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color: "#64B5F6", fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>COOL DOWN</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{f["Cool Down"]}</pre>
          </div>
        )}

        {/* Equipment */}
        {f["Equipment"] && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>EQUIPMENT</div>
            <div style={{ color: C.text, fontSize: 12 }}>{f["Equipment"]}</div>
          </div>
        )}

        {/* Coach Notes */}
        {f["Coach Notes"] && (
          <div style={{ background: "#10B98115", border: "1px solid #10B98144", borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ color: "#10B981", fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>COACH NOTES</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{f["Coach Notes"]}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: C.text, fontSize: 18, fontWeight: 800 }}>Performance Metrics</div>
        <div style={{ color: C.textMuted, fontSize: 12 }}>Improvement Plan — Tuesday & Thursday</div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {[
          { id: "sessions", label: "Sessions" },
          { id: "library", label: "Exercise Library" },
          ...(isCoach ? [{ id: "add", label: "+ Add Exercise" }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700,
              background: activeTab === t.id ? C.blue : C.darkBorder,
              color: activeTab === t.id ? "#fff" : C.textMuted }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          <div>Loading from Airtable...</div>
        </div>
      ) : activeTab === "sessions" ? (
        <div>
          {/* Day headers */}
          {["Tuesday", "Thursday"].map(day => {
            const daySessions = sortedSessions.filter(s => s.fields["Day"] === day);
            if (daySessions.length === 0) return null;
            return (
              <div key={day} style={{ marginBottom: 16 }}>
                <div style={{ color: day === "Tuesday" ? C.blueLight : C.success,
                  fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>
                  {day.toUpperCase()}
                </div>
                {daySessions.map(session => {
                  const f = session.fields;
                  const focus = f["Focus Area"] || "";
                  const color = FOCUS_COLORS[focus] || C.blue;
                  return (
                    <div key={session.id} onClick={() => setSelected(session)}
                      style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`,
                        borderRadius: 12, padding: 16, marginBottom: 8, cursor: "pointer",
                        borderLeft: `4px solid ${color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{f["Session Name"]}</div>
                          <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>
                            {f["Phase"]} · {f["Duration (min)"]} min
                          </div>
                        </div>
                        <span style={{ color: "#AAA", fontSize: 18 }}>›</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {focus && <span style={{ fontSize: 10, background: color + "25", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{focus}</span>}
                        {f["Status"] && <span style={{ fontSize: 10, background: C.success + "25", color: C.success, borderRadius: 6, padding: "2px 8px" }}>{f["Status"]}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {sortedSessions.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div>No PMIP sessions found.</div>
            </div>
          )}
        </div>
      ) : activeTab === "library" ? (
        <div>
          <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 12 }}>
            {library.length} exercise{library.length !== 1 ? "s" : ""} in library
          </div>
          {["Strength", "Speed", "Quickness", "Core", "Agility", "Power"].map(cat => {
            const catEx = library.filter(e => e.fields["Category"] === cat);
            if (catEx.length === 0) return null;
            const color = FOCUS_COLORS[cat] || C.blue;
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>
                  {cat.toUpperCase()} ({catEx.length})
                </div>
                {catEx.map(ex => (
                  <div key={ex.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`,
                    borderRadius: 10, padding: 12, marginBottom: 6 }}>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{ex.fields["Exercise Name"]}</div>
                    {ex.fields["Reps or Duration"] && (
                      <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2, fontFamily: "monospace" }}>
                        {ex.fields["Sets"] ? `${ex.fields["Sets"]} sets × ` : ""}{ex.fields["Reps or Duration"]}
                        {ex.fields["Rest (seconds)"] ? ` · ${ex.fields["Rest (seconds)"]}s rest` : ""}
                      </div>
                    )}
                    {ex.fields["Equipment Needed"] && (
                      <div style={{ color: C.textDim, fontSize: 10, marginTop: 2 }}>{ex.fields["Equipment Needed"]}</div>
                    )}
                    {ex.fields["Coaching Cue"] && (
                      <div style={{ color: "#FFB300", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
                        Cue: {ex.fields["Coaching Cue"]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          {library.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏋️</div>
              <div>No exercises in library yet.</div>
              {isCoach && <div style={{ marginTop: 8, fontSize: 12 }}>Use the + Add Exercise tab to get started.</div>}
            </div>
          )}
        </div>
      ) : activeTab === "add" && isCoach ? (
        <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 14, fontFamily: "monospace" }}>ADD EXERCISE TO LIBRARY</div>
          {[
            { label: "EXERCISE NAME *", key: "name", type: "text" },
            { label: "SETS", key: "sets", type: "number" },
            { label: "REPS / DURATION (e.g. 10 reps or 30s)", key: "repsOrDuration", type: "text" },
            { label: "REST (seconds)", key: "rest", type: "number" },
            { label: "EQUIPMENT NEEDED", key: "equipment", type: "text" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>{f.label}</div>
              <input type={f.type} value={newExercise[f.key]}
                onChange={e => setNewExercise(p => ({ ...p, [f.key]: e.target.value }))}
                style={inp({ fontSize: 13 })} />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>CATEGORY</div>
            <select value={newExercise.category} onChange={e => setNewExercise(p => ({ ...p, category: e.target.value }))}
              style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
              {["Strength", "Speed", "Quickness", "Core", "Agility", "Power", "Flexibility"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>TARGET METRIC</div>
            <select value={newExercise.targetMetric} onChange={e => setNewExercise(p => ({ ...p, targetMetric: e.target.value }))}
              style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
              {["Push Ups", "Plank Hold", "10yd Sprint", "40yd Sprint", "5-10-5 Shuttle", "Vertical Jump", "Broad Jump", "General Fitness"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>DESCRIPTION</div>
            <textarea value={newExercise.description} rows={2}
              onChange={e => setNewExercise(p => ({ ...p, description: e.target.value }))}
              style={{ ...inp({ fontSize: 12 }), resize: "none" }} placeholder="How to perform the exercise..." />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>COACHING CUE</div>
            <textarea value={newExercise.cue} rows={2}
              onChange={e => setNewExercise(p => ({ ...p, cue: e.target.value }))}
              style={{ ...inp({ fontSize: 12 }), resize: "none" }} placeholder="Key coaching point for this exercise..." />
          </div>
          {saveMsg && (
            <div style={{ color: saveMsg.includes("saved") ? C.success : C.danger,
              fontSize: 12, marginBottom: 10, textAlign: "center" }}>{saveMsg}</div>
          )}
          <button onClick={saveExercise} disabled={saving}
            style={btn(C.blue, { width: "100%", padding: 13, fontSize: 14 })}>
            {saving ? "Saving..." : "Save to Exercise Library"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ─── TRAINING PLANS (Live from Airtable) ──────────────────────────────────────
const PLANS_TABLE_ID = "tblBeT6yn4hbgtKd9";

function TrainingPlans({ filterPlayerName = null }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await airtableFetch(`${AIRTABLE_BASE_ID}/${PLANS_TABLE_ID}`);
      if (data.records) setPlans(data.records);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const diffColor = { "Advanced": "#EF4444", "Intermediate": "#F59E0B", "Beginner": "#10B981" };

  const filtered = plans.filter(p => {
    const title = p.fields["Plan Name"] || Object.values(p.fields || {})[0] || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesPlayer = filterPlayerName
      ? title.toLowerCase().includes(filterPlayerName.toLowerCase())
      : true;
    return matchesSearch && matchesPlayer;
  });

  if (selected) {
    const f = selected.fields;
    // Try multiple possible field name formats
    const title = f["Plan Name"] || Object.values(f)[0] || "Training Plan";
    const desc = f["Description"] || "";
    const drills = f["Drills & Structure"] || "";
    const duration = f["Duration (min)"] || f["Duration"];
    const diff = f["Difficulty"]?.name || f["Difficulty"] || "";
    const equipment = f["Equipment"] || "";
    const coachNotes = f["Coach Notes"] || "";
    const focus = f["Technical Focus"]?.name || f["Technical Focus"] || "";
    const color = diffColor[diff] || C.blue;

    return (
      <div style={{ padding: "12px 14px" }}>
        {/* Back button */}
        <button onClick={() => setSelected(null)}
          style={{ background: C.darkBorder, border: "none", borderRadius: 8, padding: "6px 14px",
            color: C.text, fontSize: 12, cursor: "pointer", marginBottom: 14 }}>
          Back to Plans
        </button>

        {/* Plan header */}
        <div style={{ background: color + "15", border: `1px solid ${color}44`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: color, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>
                {focus.toUpperCase()} PLAN
              </div>
              <div style={{ color: C.text, fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>{title}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {duration && (
              <span style={{ fontSize: 11, background: C.darkBorder, color: C.textMuted, borderRadius: 8, padding: "3px 10px" }}>
                {duration} min
              </span>
            )}
            {diff && (
              <span style={{ fontSize: 11, background: color + "25", color, border: `1px solid ${color}44`, borderRadius: 8, padding: "3px 10px", fontWeight: 700 }}>
                {diff}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>OVERVIEW</div>
            <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
          </div>
        )}

        {/* Full drills */}
        {drills && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>FULL PLAN</div>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'DM Mono', monospace", margin: 0 }}>
              {drills}
            </pre>
          </div>
        )}

        {/* Equipment */}
        {equipment && (
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>EQUIPMENT NEEDED</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{equipment}</div>
          </div>
        )}

        {/* Coach notes */}
        {coachNotes && (
          <div style={{ background: "#FFB30015", border: "1px solid #FFB30044", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ color: "#FFB300", fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>COACH NOTES</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{coachNotes}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Training Plans</div>
        <div style={{ color: C.textMuted, fontSize: 12 }}>
          {loading ? "Loading from Airtable..." : `${filtered.length} plan${filtered.length !== 1 ? "s" : ""} available`}
        </div>
      </div>

      {/* Search */}
      {!filterPlayerName && (
        <input type="text" placeholder="Search plans..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp({ fontSize: 13, marginBottom: 14 }) }} />
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          <div>Loading plans from Airtable...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
          <div>No plans found.</div>
        </div>
      ) : (
        filtered.map(plan => {
          const f = plan.fields;
          const title = f["Plan Name"] || Object.values(f)[0] || "Untitled Plan";
          const desc = f["Description"] || "";
          const duration = f["Duration (min)"] || f["Duration"];
          const diff = f["Difficulty"]?.name || f["Difficulty"] || "";
          const focus = f["Technical Focus"]?.name || f["Technical Focus"] || "";
          const color = diffColor[diff] || C.blue;

          return (
            <div key={plan.id} onClick={() => setSelected(plan)}
              style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12,
                padding: 16, marginBottom: 10, cursor: "pointer",
                transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
                  {focus && <div style={{ color: color, fontSize: 10, fontWeight: 700, marginTop: 3, letterSpacing: 0.5 }}>{focus.toUpperCase()}</div>}
                </div>
                <span style={{ color: "#AAA", fontSize: 16, flexShrink: 0 }}>›</span>
              </div>
              {desc && (
                <div style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>
                  {desc.slice(0, 100)}{desc.length > 100 ? "..." : ""}
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                {duration && (
                  <span style={{ fontSize: 10, background: C.darkBorder, color: C.textMuted, borderRadius: 6, padding: "2px 8px" }}>
                    {duration} min
                  </span>
                )}
                {diff && (
                  <span style={{ fontSize: 10, background: color + "25", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                    {diff}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── PERFORMANCE DASHBOARD ───────────────────────────────────────────────────
const BENCHMARKS = {
  14: {
    "10yd Sprint":     { player: null, avg: 2.20, elite: 1.90, unit: "s", lowerIsBetter: true },
    "40yd Sprint":     { player: null, avg: 5.50, elite: 5.00, unit: "s", lowerIsBetter: true },
    "5-10-5 Shuttle":  { player: null, avg: 5.50, elite: 5.00, unit: "s", lowerIsBetter: true },
    "Vertical Jump":   { player: null, avg: 18.0, elite: 23.0, unit: "in", lowerIsBetter: false },
    "Broad Jump":      { player: null, avg: 66.0, elite: 78.0, unit: "in", lowerIsBetter: false },
    "Push Ups":        { player: null, avg: 25.0, elite: 35.0, unit: "reps", lowerIsBetter: false },
    "Plank Hold":      { player: null, avg: 52.0, elite: 75.0, unit: "s", lowerIsBetter: false },
  },
  11: {
    "10yd Sprint":     { player: null, avg: 2.65, elite: 2.35, unit: "s", lowerIsBetter: true },
    "40yd Sprint":     { player: null, avg: 6.60, elite: 6.00, unit: "s", lowerIsBetter: true },
    "5-10-5 Shuttle":  { player: null, avg: 6.40, elite: 5.75, unit: "s", lowerIsBetter: true },
    "Vertical Jump":   { player: null, avg: 14.0, elite: 18.0, unit: "in", lowerIsBetter: false },
    "Broad Jump":      { player: null, avg: 54.0, elite: 66.0, unit: "in", lowerIsBetter: false },
    "Push Ups":        { player: null, avg: 12.0, elite: 20.0, unit: "reps", lowerIsBetter: false },
    "Plank Hold":      { player: null, avg: 37.0, elite: 60.0, unit: "s", lowerIsBetter: false },
  },
};

const PLAYER_ASSESSMENTS = {
  "recPaWuQLtussFtna": { age: 14, name: "Aaron", color: "#E53935", emoji: "💪", data: {
    "10yd Sprint": 2.23, "40yd Sprint": 5.52, "5-10-5 Shuttle": 5.53,
    "Vertical Jump": 36, "Broad Jump": 106, "Push Ups": 10, "Plank Hold": 17.03,
  }},
  "rectUtNasT2HwjUwe": { age: 11, name: "Noah", color: "#1E88E5", emoji: "⚽", data: {
    "10yd Sprint": 2.64, "40yd Sprint": 6.52, "5-10-5 Shuttle": 6.43,
    "Vertical Jump": 31, "Broad Jump": 80, "Push Ups": 20, "Plank Hold": 180,
  }},
  "rec88HsXp6OYXgzg3": { age: 11, name: "Alexander", color: "#43A047", emoji: "🎯", data: {
    "10yd Sprint": 2.63, "40yd Sprint": 6.92, "5-10-5 Shuttle": 6.95,
    "Vertical Jump": 30, "Broad Jump": 78, "Push Ups": 34, "Plank Hold": 180,
  }},
};

function getRating(value, benchmark, lowerIsBetter) {
  if (!value) return { label: "N/A", color: "#546E7A" };
  if (lowerIsBetter) {
    if (value <= benchmark.elite) return { label: "Elite", color: "#10B981" };
    if (value <= benchmark.avg) return { label: "Good", color: "#64B5F6" };
    if (value <= benchmark.avg * 1.1) return { label: "Average", color: "#F59E0B" };
    return { label: "Needs Work", color: "#EF4444" };
  } else {
    if (value >= benchmark.elite) return { label: "Elite", color: "#10B981" };
    if (value >= benchmark.avg) return { label: "Good", color: "#64B5F6" };
    if (value >= benchmark.avg * 0.9) return { label: "Average", color: "#F59E0B" };
    return { label: "Needs Work", color: "#EF4444" };
  }
}

function getBarWidth(value, benchmarks, lowerIsBetter) {
  const max = lowerIsBetter
    ? Math.max(value, benchmarks.avg, benchmarks.elite) * 1.2
    : Math.max(value, benchmarks.avg, benchmarks.elite) * 1.2;
  const pct = lowerIsBetter
    ? ((max - value) / max) * 100
    : (value / max) * 100;
  return Math.min(Math.max(pct, 5), 100);
}

function BarChart({ testName, playerValue, benchmark, playerColor, playerName }) {
  const { avg, elite, unit, lowerIsBetter } = benchmark;
  const rating = getRating(playerValue, benchmark, lowerIsBetter);
  const maxVal = lowerIsBetter
    ? Math.max(playerValue || 0, avg, elite) * 1.25
    : Math.max(playerValue || 0, avg, elite) * 1.25;

  const barPct = (val) => lowerIsBetter
    ? Math.max(5, Math.min(100, ((maxVal - val) / maxVal) * 100 + 20))
    : Math.max(5, Math.min(100, (val / maxVal) * 100));

  const bars = [
    { label: playerName, value: playerValue, color: playerColor, pct: barPct(playerValue || 0) },
    { label: "Age Avg", value: avg, color: "#546E7A", pct: barPct(avg) },
    { label: "Elite", value: elite, color: "#FFB300", pct: barPct(elite) },
  ];

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{testName}</div>
        <span style={{ fontSize: 10, background: rating.color + "25", color: rating.color,
          border: `1px solid ${rating.color}44`, borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>
          {rating.label}
        </span>
      </div>
      {bars.map((bar, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{ width: 60, fontSize: 10, color: C.textMuted, textAlign: "right", flexShrink: 0 }}>
            {bar.label}
          </div>
          <div style={{ flex: 1, background: C.darkBorder, borderRadius: 4, height: 20, position: "relative", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              background: i === 0 ? bar.color : i === 1 ? "#37474F" : "#F59E0B33",
              border: i === 2 ? `1px solid #FFB300` : "none",
              width: `${bar.pct}%`,
              transition: "width 0.6s ease",
              display: "flex", alignItems: "center", paddingLeft: 6,
            }}>
              <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {bar.value}{unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RadarScore({ player, assessment }) {
  const benchmarks = BENCHMARKS[assessment.age];
  const tests = Object.keys(benchmarks);
  const scores = tests.map(t => {
    const val = assessment.data[t];
    const b = benchmarks[t];
    if (!val) return 0;
    if (b.lowerIsBetter) {
      if (val <= b.elite) return 100;
      if (val <= b.avg) return 75;
      if (val <= b.avg * 1.1) return 50;
      return 25;
    } else {
      if (val >= b.elite) return 100;
      if (val >= b.avg) return 75;
      if (val >= b.avg * 0.9) return 50;
      return 25;
    }
  });
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const eliteCount = scores.filter(s => s === 100).length;
  const needsWorkCount = scores.filter(s => s === 25).length;

  return (
    <div style={{ background: player.color + "15", border: `1px solid ${player.color}44`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>OVERALL SCORE</div>
          <div style={{ color: C.text, fontSize: 13, marginTop: 2 }}>vs Age {assessment.age} Benchmarks</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: player.color, fontSize: 40, fontWeight: 800, fontFamily: "monospace", lineHeight: 1 }}>{overall}</div>
          <div style={{ color: C.textMuted, fontSize: 10 }}>/ 100</div>
        </div>
      </div>
      {/* Score bar */}
      <div style={{ background: C.darkBorder, borderRadius: 6, height: 10, marginBottom: 12 }}>
        <div style={{ height: 10, borderRadius: 6, width: `${overall}%`,
          background: overall >= 75 ? "#10B981" : overall >= 50 ? "#F59E0B" : "#EF4444",
          transition: "width 0.8s ease" }} />
      </div>
      {/* Badges */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: "#10B98120", border: "1px solid #10B98144", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ color: "#10B981", fontSize: 18, fontWeight: 800 }}>{eliteCount}</div>
          <div style={{ color: C.textMuted, fontSize: 9 }}>ELITE TESTS</div>
        </div>
        <div style={{ flex: 1, background: "#64B5F620", border: "1px solid #64B5F644", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ color: "#64B5F6", fontSize: 18, fontWeight: 800 }}>{scores.filter(s => s === 75).length}</div>
          <div style={{ color: C.textMuted, fontSize: 9 }}>GOOD TESTS</div>
        </div>
        <div style={{ flex: 1, background: "#EF444420", border: "1px solid #EF444444", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ color: "#EF4444", fontSize: 18, fontWeight: 800 }}>{needsWorkCount}</div>
          <div style={{ color: C.textMuted, fontSize: 9 }}>NEEDS WORK</div>
        </div>
      </div>
    </div>
  );
}

function PerformanceDashboard({ playerId = null }) {
  const allPlayers = Object.entries(PLAYER_ASSESSMENTS);
  const [selectedId, setSelectedId] = useState(playerId || allPlayers[0][0]);
  const [section, setSection] = useState("physical");

  const isCoach = !playerId;
  const assessment = PLAYER_ASSESSMENTS[selectedId];
  const player = PLAYERS_DATA.find(p => p.id === selectedId);
  const benchmarks = BENCHMARKS[assessment.age];

  const physicalTests = ["10yd Sprint", "40yd Sprint", "5-10-5 Shuttle", "Vertical Jump", "Broad Jump", "Push Ups", "Plank Hold"];

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: C.text, fontSize: 18, fontWeight: 800 }}>Performance Dashboard</div>
        <div style={{ color: C.textMuted, fontSize: 12 }}>Baseline vs World Age Group Benchmarks</div>
      </div>

      {/* Player selector (coach only) */}
      {isCoach && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {allPlayers.map(([id, a]) => {
            const p = PLAYERS_DATA.find(pl => pl.id === id);
            return (
              <button key={id} onClick={() => setSelectedId(id)}
                style={{ flex: 1, padding: "10px 6px", borderRadius: 10,
                  border: `2px solid ${selectedId === id ? p?.color || "#fff" : C.darkBorder}`,
                  background: selectedId === id ? (p?.color || "#fff") + "20" : "transparent",
                  cursor: "pointer" }}>
                <div style={{ fontSize: 18 }}>{a.emoji}</div>
                <div style={{ color: selectedId === id ? p?.color || C.text : C.textMuted,
                  fontSize: 11, fontWeight: 700, marginTop: 4 }}>{a.name}</div>
                <div style={{ color: C.textDim, fontSize: 9 }}>Age {a.age}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Overall score card */}
      <RadarScore player={player || { color: "#2563EB" }} assessment={assessment} />

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {[{ id: "physical", label: "Physical" }, { id: "soccer", label: "Soccer Skills" }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
              background: section === s.id ? (player?.color || C.blue) : C.darkBorder,
              color: section === s.id ? "#fff" : C.textMuted }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {[
          { color: player?.color || C.blue, label: assessment.name },
          { color: "#546E7A", label: "Age Average" },
          { color: "#FFB300", label: "Elite Level" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }} />
            <span style={{ color: C.textMuted, fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bar charts */}
      <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16 }}>
        {section === "physical" ? (
          physicalTests.map(test => (
            <BarChart key={test} testName={test}
              playerValue={assessment.data[test]}
              benchmark={benchmarks[test]}
              playerColor={player?.color || C.blue}
              playerName={assessment.name} />
          ))
        ) : (
          <div style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
            <div style={{ color: C.text, fontWeight: 700, marginBottom: 6 }}>Soccer Skills Assessment</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>
              Soccer skill benchmarks (passing accuracy, shooting, dribble speed) coming soon.
              Complete a skills assessment to see your comparison.
            </div>
          </div>
        )}
      </div>

      {/* Key insights */}
      <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16, marginTop: 12 }}>
        <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>
          KEY INSIGHTS
        </div>
        {physicalTests.map(test => {
          const val = assessment.data[test];
          const b = benchmarks[test];
          const rating = getRating(val, b, b.lowerIsBetter);
          if (rating.label !== "Elite" && rating.label !== "Needs Work") return null;
          return (
            <div key={test} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
              padding: "8px 10px", background: rating.color + "15",
              border: `1px solid ${rating.color}33`, borderRadius: 8 }}>
              <span style={{ fontSize: 14 }}>{rating.label === "Elite" ? "🔥" : "⚠️"}</span>
              <div>
                <span style={{ color: rating.color, fontSize: 12, fontWeight: 700 }}>{test}: </span>
                <span style={{ color: C.textMuted, fontSize: 11 }}>
                  {rating.label === "Elite"
                    ? `${val}${b.unit} — Elite level for age ${assessment.age}`
                    : `${val}${b.unit} — Priority training area`}
                </span>
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
}

// ─── ASSESSMENT FORM ──────────────────────────────────────────────────────────
const PHYSICAL_TESTS = [
  { key: "sprint10", label: "10 Yard Sprint", unit: "seconds", field: "Sprint 10 Yard CORRECT" },
  { key: "sprint40", label: "40 Yard Sprint", unit: "seconds", field: "Sprint 40 Yard CORRECT" },
  { key: "shuttle", label: "5-10-5 Shuttle", unit: "seconds", field: "Shuttle 5-10-5 CORRECT" },
  { key: "vertJump", label: "Vertical Jump", unit: "inches", field: "Vertical Jump (inches)" },
  { key: "broadJump", label: "Broad Jump", unit: "inches", field: "Broad Jump (inches)" },
  { key: "pushUps", label: "Push Ups", unit: "reps", field: "Push Ups (reps)" },
  { key: "pullUps", label: "Pull Ups", unit: "reps", field: "Pull Ups (reps)" },
  { key: "plank", label: "Plank Hold", unit: "seconds", field: "Plank Hold (seconds)" },
  { key: "beepTest", label: "Beep Test", unit: "level", field: "Beep Test Level" },
];
const SOCCER_TESTS = [
  { key: "passShort", label: "Passing Accuracy (Short)", unit: "%", field: "Passing Accuracy % (short)" },
  { key: "passLong", label: "Passing Accuracy (Long)", unit: "%", field: "Passing Accuracy % (long)" },
  { key: "shootPower", label: "Shooting Power", unit: "mph", field: "Shooting Power (mph)" },
  { key: "shootAcc", label: "Shooting Accuracy", unit: "% (10 shots)", field: "Shooting Accuracy % (10 shots)" },
  { key: "weakFoot", label: "Weak Foot Accuracy", unit: "% (10 shots)", field: "Weak Foot Accuracy % (10 shots)" },
  { key: "dribble", label: "Dribble Speed Test", unit: "seconds", field: "Dribble Speed Test (seconds)" },
  { key: "firstTouch", label: "First Touch Score", unit: "/ 10", field: "First Touch Score (10 attempts)" },
];

function AssessmentForm({ player, readOnly = false }) {
  const [phase, setPhase] = useState("Baseline");
  const [values, setValues] = useState({});
  const [coachNotes, setCoachNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeSection, setActiveSection] = useState("physical");

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const formula = encodeURIComponent(`{Player ID}="${player.id}"`);
      const data = await airtableFetch(`${AIRTABLE_BASE_ID}/tbl4ksfh0hKXmy5gT?filterByFormula=${formula}&sort[0][field]=Assessment Date&sort[0][direction]=desc`);
      if (data.records) setHistory(data.records);
    } catch {}
    setLoadingHistory(false);
  };

  const save = async () => {
    setSaving(true); setError("");
    const today = new Date().toISOString().split("T")[0];
    const fields = {
      "Assessment Title": `${player.name} — ${phase} — ${today}`,
      "Player Name": player.name,
      "Player ID": player.id,
      "Assessment Date": today,
      "Phase": phase,
      "Coach Notes": coachNotes,
    };
    [...PHYSICAL_TESTS, ...SOCCER_TESTS].forEach(t => {
      if (values[t.key] !== undefined && values[t.key] !== "") {
        fields[t.field] = parseFloat(values[t.key]);
      }
    });
    try {
      const res = await airtableFetch(`${AIRTABLE_BASE_ID}/tbl4ksfh0hKXmy5gT`, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields }] }),
      });
      if (res.records) { setSaved(true); loadHistory(); }
      else setError("Save failed. Try again.");
    } catch { setError("Network error."); }
    setSaving(false);
  };

  const allTests = [...PHYSICAL_TESTS, ...SOCCER_TESTS];

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ background: player.color + "20", border: `1px solid ${player.color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PERFORMANCE ASSESSMENT</div>
        <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginTop: 2 }}>{player.emoji} {player.name}</div>
        <div style={{ color: C.textMuted, fontSize: 11 }}>Physical + Soccer Skills · {allTests.length} tests</div>
      </div>

      {/* History button */}
      <button onClick={loadHistory} style={btn(C.darkBorder, { width: "100%", marginBottom: 12, fontSize: 12, padding: "8px 12px" })}>
        {loadingHistory ? "Loading..." : "View Assessment History"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>ASSESSMENT HISTORY</div>
          {history.map((r, i) => (
            <div key={r.id} style={{ borderBottom: i < history.length - 1 ? `1px solid ${C.darkBorder}` : "none", paddingBottom: 10, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{r.fields["Phase"] || "Assessment"}</span>
                <span style={{ color: C.textMuted, fontSize: 11 }}>{r.fields["Assessment Date"]}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {allTests.filter(t => r.fields[t.field] !== undefined).map(t => (
                  <div key={t.key} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>{t.label}</span>
                    <span style={{ color: player.color, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{r.fields[t.field]} {t.unit}</span>
                  </div>
                ))}
              </div>
              {r.fields["Coach Notes"] && <div style={{ color: C.textMuted, fontSize: 11, marginTop: 6, fontStyle: "italic" }}>💬 {r.fields["Coach Notes"]}</div>}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <>
          {/* Phase selector */}
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>ASSESSMENT PHASE</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Baseline", "Phase 1 End", "Phase 2 End", "Phase 3 End", "Phase 4 End"].map(p => (
                <button key={p} onClick={() => setPhase(p)}
                  style={{ padding: "6px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                    background: phase === p ? player.color : C.darkBorder, color: phase === p ? "#fff" : C.textMuted }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {[{ id: "physical", label: "💪 Physical" }, { id: "soccer", label: "⚽ Soccer Skills" }].map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                  background: activeSection === s.id ? player.color : C.darkBorder,
                  color: activeSection === s.id ? "#fff" : C.textMuted }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Test inputs */}
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            {(activeSection === "physical" ? PHYSICAL_TESTS : SOCCER_TESTS).map(t => (
              <div key={t.key} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 10, fontFamily: "monospace" }}>{t.unit}</div>
                </div>
                <input type="number" step="0.01" placeholder="—"
                  value={values[t.key] || ""}
                  onChange={e => setValues(prev => ({ ...prev, [t.key]: e.target.value }))}
                  style={{ ...inp({ fontSize: 14, textAlign: "right", width: 90, fontWeight: 700, color: player.color }) }} />
              </div>
            ))}
          </div>

          {/* Coach notes */}
          <div style={{ marginBottom: 12 }}>
            <textarea placeholder="Coach notes for this assessment..." value={coachNotes} rows={3}
              onChange={e => setCoachNotes(e.target.value)}
              style={{ ...inp(), resize: "none", fontSize: 12 }} />
          </div>

          {/* Save */}
          {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 8, textAlign: "center" }}>{error}</div>}
          {saved ? (
            <div style={{ background: C.success + "20", border: `1px solid ${C.success}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>✅</div>
              <div style={{ color: C.success, fontWeight: 700, marginTop: 4 }}>Assessment saved to Airtable!</div>
            </div>
          ) : (
            <button onClick={save} disabled={saving}
              style={btn(player.color, { width: "100%", padding: 14, fontSize: 14 })}>
              {saving ? "Saving..." : `Save ${phase} Assessment`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── PLAYER DASHBOARD ─────────────────────────────────────────────────────────
function PlayerDashboard({ user, onLogout }) {
  const player = PLAYERS_DATA.find(p => p.id === user.playerId);
  const [tab, setTab] = useState("plan");
  const tabs = [{ id: "plan", label: "My Plan" }, { id: "pmip", label: "PMIP" }, { id: "log", label: "Log Session" }, { id: "dashboard", label: "Dashboard" }, { id: "training", label: "Training Plans" }, { id: "assessment", label: "Assessment" }, { id: "profile", label: "My Profile" }];
  if (!player) return <div style={{ padding: 20, color: C.textMuted }}>No training plan found.</div>;
  return (
    <div>
      <TopNav user={user} activeTab={tab} setActiveTab={setTab} tabs={tabs} onLogout={onLogout} />
      {tab === "plan" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{player.emoji} My Training Plan</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1 · May 26 – Jul 26</div>
          {player.blocks.map(block => (
            <div key={block.name} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>{block.name.toUpperCase()}</div>
              {block.exercises.map(ex => (
                <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.darkBorder}` }}>
                  <span style={{ color: C.text, fontSize: 13 }}>{ex.name}</span>
                  <span style={{ color: C.textMuted, fontSize: 11, fontFamily: "monospace" }}>{ex.prescription}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {tab === "log" && <SessionLogger player={player} />}
      {tab === "pmip" && <PMIPView playerName={player.name} isCoach={false} />}
      {tab === "dashboard" && <PerformanceDashboard playerId={player.id} />}
      {tab === "training" && <TrainingPlans filterPlayerName={player.name} />}
      {tab === "assessment" && <AssessmentForm player={player} readOnly={true} />}
      {tab === "dashboard" && <PerformanceDashboard playerId={player.id} />}
      {tab === "profile" && <PlayerProfile player={player} canEdit={false} />}
    </div>
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ user, onLogout }) {
  const player = PLAYERS_DATA.find(p => p.id === user.childId);
  const [tab, setTab] = useState("overview");
  const tabs = [{ id: "overview", label: "Overview" }, { id: "plan", label: "Training Plan" }, { id: "dashboard", label: "Dashboard" }, { id: "assessment", label: "Assessment" }, { id: "profile", label: "Profile" }];
  if (!player) return <div style={{ padding: 20, color: C.textMuted }}>No player data found.</div>;
  return (
    <div>
      <TopNav user={user} activeTab={tab} setActiveTab={setTab} tabs={tabs} onLogout={onLogout} />
      {tab === "overview" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{player.emoji} {player.name}'s Dashboard</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[{ label: "Plan Type", value: player.planType, color: player.color }, { label: "Duration", value: `${player.duration} min`, color: C.blueLight }, { label: "Phase", value: "Pre-Season 1", color: C.success }, { label: "Status", value: "Active ✓", color: C.success }].map(({ label, value, color }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ color, fontSize: 15, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>CURRENT PLAN</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{player.planName}</div>
            <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{player.blocks.reduce((a, b) => a + b.exercises.length, 0)} exercises · {player.blocks.length} blocks</div>
          </div>
        </div>
      )}
      {tab === "assessment" && <AssessmentForm player={player} readOnly={true} />}
      {tab === "dashboard" && <PerformanceDashboard playerId={player.id} />}
      {tab === "profile" && <PlayerProfile player={player} canEdit={false} />}
      {tab === "plan" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Training Plan</div>
          {player.blocks.map(block => (
            <div key={block.name} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>{block.name.toUpperCase()}</div>
              {block.exercises.map(ex => (
                <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.darkBorder}` }}>
                  <span style={{ color: C.text, fontSize: 13 }}>{ex.name}</span>
                  <span style={{ color: C.textMuted, fontSize: 11, fontFamily: "monospace" }}>{ex.prescription}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── FITNESS PLATFORM ─────────────────────────────────────────────────────────

const ATHLETE_COLORS = {
  "Hybrid Athlete":  { color: "#FF6B35", light: "#FF6B3520", emoji: "🔥" },
  "Distance Runner": { color: "#1E88E5", light: "#1E88E520", emoji: "🏃" },
  "Strength Training": { color: "#E53935", light: "#E5393520", emoji: "🏋️" },
  "General Fitness": { color: "#10B981", light: "#10B98120", emoji: "💪" },
};

const HYBRID_BENCHMARKS = {
  "Max Pull Ups":          { avg: 8,    elite: 15,   unit: "reps", lowerIsBetter: false },
  "Max Push Ups":          { avg: 25,   elite: 50,   unit: "reps", lowerIsBetter: false },
  "Max Air Squats (2 min)":{ avg: 40,   elite: 70,   unit: "reps", lowerIsBetter: false },
  "Plank Hold (seconds)":  { avg: 90,   elite: 180,  unit: "s",    lowerIsBetter: false },
  "Mile Run Time (seconds)":{ avg: 480, elite: 360,  unit: "s",    lowerIsBetter: true  },
  "400m Run (seconds)":    { avg: 90,   elite: 70,   unit: "s",    lowerIsBetter: true  },
  "Deadlift 1RM (lbs)":    { avg: 225,  elite: 365,  unit: "lbs",  lowerIsBetter: false },
  "Back Squat 1RM (lbs)":  { avg: 185,  elite: 315,  unit: "lbs",  lowerIsBetter: false },
};

// ─── FITNESS REQUEST ACCESS ───────────────────────────────────────────────────
function FitnessRequestAccess({ onBack }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", athleteType: "Hybrid Athlete",
    goal: "General Fitness", experience: "Beginner",
    daysPerWeek: "3", sessionDuration: "60", equipment: "", injuries: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    setLoading(true); setError("");
    try {
      // Create Adult Client record
      const clientRes = await airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_CLIENTS_TABLE_ID}`, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields: {
          "Full Name": form.name,
          "Email": form.email,
          "Athlete Type": form.athleteType,
          "Primary Goal": form.goal,
          "Experience Level": form.experience,
          "Training Days Per Week": parseInt(form.daysPerWeek) || 3,
          "Session Duration min": parseInt(form.sessionDuration) || 60,
          "Equipment Available": form.equipment,
          "Injury History": form.injuries,
          "Start Date": new Date().toISOString().split("T")[0],
          "Status": "Active",
        }}]}),
      });
      const clientId = clientRes.records?.[0]?.id;

      // Create User record with fitness_client role
      await airtableFetch(`${AIRTABLE_BASE_ID}/${USERS_TABLE_ID}`, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields: {
          "Name": form.name,
          "Email": form.email,
          "Password": form.password,
          "Role": "fitness_client",
          "Status": "Pending",
          "Client ID": clientId || "",
          "Requested At": new Date().toISOString(),
        }}]}),
      });
      setDone(true);
    } catch { setError("Submission failed. Please try again."); }
    setLoading(false);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ color: C.text, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Request Sent!</div>
        <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>Your coach will review and approve your access. Check back soon!</div>
        <button onClick={onBack} style={btn(C.blue, { padding: "12px 32px" })}>Back to Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.dark, padding: 20, overflowY: "auto" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24, paddingTop: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>💪</div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>Join the Fitness Platform</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Tell us about yourself — coach will approve your access</div>
        </div>

        <div style={{ background: C.darkCard, borderRadius: 16, padding: 20, border: `1px solid ${C.darkBorder}` }}>
          {/* Required fields */}
          {[
            { label: "FULL NAME *", key: "name", type: "text" },
            { label: "EMAIL *", key: "email", type: "email" },
            { label: "PASSWORD *", key: "password", type: "password" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>{f.label}</div>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={inp({ fontSize: 13 })} />
            </div>
          ))}

          {/* Athlete Type */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>I AM A</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {Object.entries(ATHLETE_COLORS).map(([type, info]) => (
                <button key={type} onClick={() => setForm(p => ({ ...p, athleteType: type }))}
                  style={{ padding: "10px 6px", borderRadius: 10,
                    border: `2px solid ${form.athleteType === type ? info.color : C.darkBorder}`,
                    background: form.athleteType === type ? info.color + "20" : "transparent",
                    cursor: "pointer" }}>
                  <div style={{ fontSize: 18 }}>{info.emoji}</div>
                  <div style={{ color: form.athleteType === type ? info.color : C.textMuted, fontSize: 10, fontWeight: 700, marginTop: 3 }}>{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal & Experience */}
          {[
            { label: "PRIMARY GOAL", key: "goal", options: ["Build Strength", "Lose Weight", "Improve Endurance", "Improve Performance", "General Fitness", "Compete"] },
            { label: "EXPERIENCE LEVEL", key: "experience", options: ["Beginner", "Intermediate", "Advanced"] },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>{f.label}</div>
              <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          {/* Training preferences */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>DAYS/WEEK</div>
              <select value={form.daysPerWeek} onChange={e => setForm(p => ({ ...p, daysPerWeek: e.target.value }))}
                style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
                {["2", "3", "4", "5", "6"].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <div>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>SESSION LENGTH</div>
              <select value={form.sessionDuration} onChange={e => setForm(p => ({ ...p, sessionDuration: e.target.value }))}
                style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
                {["30", "45", "60", "75", "90", "120"].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>EQUIPMENT AVAILABLE</div>
            <textarea value={form.equipment} rows={2} onChange={e => setForm(p => ({ ...p, equipment: e.target.value }))}
              placeholder="e.g. barbell, dumbbells, pull-up bar, kettlebells..."
              style={{ ...inp({ fontSize: 12 }), resize: "none" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 5, fontFamily: "monospace" }}>INJURY HISTORY (optional)</div>
            <textarea value={form.injuries} rows={2} onChange={e => setForm(p => ({ ...p, injuries: e.target.value }))}
              placeholder="Any injuries, limitations, or areas to avoid..."
              style={{ ...inp({ fontSize: 12 }), resize: "none" }} />
          </div>

          {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 10, textAlign: "center" }}>{error}</div>}
          <button onClick={submit} disabled={loading} style={btn("#FF6B35", { width: "100%", padding: 14, fontSize: 14 })}>
            {loading ? "Submitting..." : "Request Access"}
          </button>
          <button onClick={onBack} style={{ ...btn(C.darkBorder, { width: "100%", padding: 12, marginTop: 8 }), color: C.textMuted }}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FITNESS CLIENT DASHBOARD ─────────────────────────────────────────────────
function FitnessClientDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [clientData, setClientData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientId = user.clientId || user["Client ID"] || "";
  const athleteInfo = ATHLETE_COLORS[clientData?.["Athlete Type"]] || ATHLETE_COLORS["General Fitness"];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientRes, plansRes, assessRes] = await Promise.all([
        clientId ? airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_CLIENTS_TABLE_ID}/${clientId}`) : Promise.resolve(null),
        airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_PLANS_TABLE_ID}`),
        airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_ASSESSMENTS_TABLE_ID}`),
      ]);
      if (clientRes?.fields) setClientData(clientRes.fields);
      if (plansRes?.records) {
        setPlans(plansRes.records.filter(r =>
          (r.fields["Client Name"] || "").toLowerCase() === user.name.toLowerCase()
        ));
      }
      if (assessRes?.records) {
        setAssessments(assessRes.records.filter(r =>
          (r.fields["Client Name"] || "").toLowerCase() === user.name.toLowerCase()
        ));
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "plans", label: "My Plan" },
    { id: "assessment", label: "Assessment" },
    { id: "profile", label: "Profile" },
  ];

  const color = athleteInfo.color;

  return (
    <div>
      <TopNav user={{ ...user, role: "fitness_client" }} activeTab={tab} setActiveTab={setTab} tabs={tabs} onLogout={onLogout} />

      {tab === "overview" && (
        <div style={{ padding: 16 }}>
          {/* Welcome header */}
          <div style={{ background: color + "20", border: `1px solid ${color}44`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
              {clientData?.["Athlete Type"]?.toUpperCase() || "FITNESS CLIENT"}
            </div>
            <div style={{ color: C.text, fontSize: 20, fontWeight: 800, marginTop: 2 }}>
              {athleteInfo.emoji} Welcome, {user.name}
            </div>
            <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>
              {clientData?.["Primary Goal"] || "General Fitness"} · {clientData?.["Experience Level"] || ""}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Training Days", value: clientData?.["Training Days Per Week"] ? `${clientData["Training Days Per Week"]}x / week` : "—" },
              { label: "Session Length", value: clientData?.["Session Duration min"] ? `${clientData["Session Duration min"]} min` : "—" },
              { label: "Active Plans", value: plans.filter(p => p.fields["Status"] === "Active").length },
              { label: "Assessments", value: assessments.length },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Latest assessment summary */}
          {assessments.length > 0 && (
            <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>LATEST ASSESSMENT</div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{assessments[0].fields["Assessment Title"]}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>{assessments[0].fields["Assessment Date"]} · {assessments[0].fields["Phase"]}</div>
            </div>
          )}
        </div>
      )}

      {tab === "plans" && (
        <div style={{ padding: 16 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Loading plans...</div>
          ) : selectedPlan ? (
            <div>
              <button onClick={() => setSelectedPlan(null)}
                style={{ background: C.darkBorder, border: "none", borderRadius: 8, padding: "6px 14px", color: C.text, fontSize: 12, cursor: "pointer", marginBottom: 14 }}>
                Back
              </button>
              {["Warm Up", "Main Block", "Finishers", "Cool Down"].map(section => {
                const val = selectedPlan.fields[section];
                if (!val) return null;
                const sectionColors = { "Warm Up": "#FFB300", "Main Block": color, "Finishers": "#EF4444", "Cool Down": "#64B5F6" };
                return (
                  <div key={section} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ color: sectionColors[section], fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>{section.toUpperCase()}</div>
                    <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'DM Mono', monospace" }}>{val}</pre>
                  </div>
                );
              })}
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div>No training plans assigned yet.</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Your coach will assign your plan soon.</div>
            </div>
          ) : (
            plans.map(plan => (
              <div key={plan.id} onClick={() => setSelectedPlan(plan)}
                style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16, marginBottom: 10, cursor: "pointer", borderLeft: `4px solid ${color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{plan.fields["Plan Name"]}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>
                      {plan.fields["Day"]} · {plan.fields["Focus"]} · {plan.fields["Duration min"]} min
                    </div>
                  </div>
                  <span style={{ color: "#AAA", fontSize: 18 }}>›</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "assessment" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>My Assessments</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Baseline & progress tracking</div>
          {assessments.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div>No assessments recorded yet.</div>
            </div>
          ) : assessments.map(a => (
            <div key={a.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{a.fields["Phase"] || "Assessment"}</div>
                <div style={{ color: C.textMuted, fontSize: 11 }}>{a.fields["Assessment Date"]}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {Object.entries(a.fields).filter(([k, v]) => typeof v === "number" && k !== "id").map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.darkBorder}` }}>
                    <span style={{ color: C.textMuted, fontSize: 10 }}>{k.replace(/ \(.*\)/, "")}</span>
                    <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && (
        <div style={{ padding: 16 }}>
          <div style={{ background: color + "20", border: `1px solid ${color}44`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>MY PROFILE</div>
            <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginTop: 2 }}>{athleteInfo.emoji} {user.name}</div>
          </div>
          {clientData ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Athlete Type", value: clientData["Athlete Type"] },
                { label: "Experience", value: clientData["Experience Level"] },
                { label: "Goal", value: clientData["Primary Goal"] },
                { label: "Training Days", value: clientData["Training Days Per Week"] ? `${clientData["Training Days Per Week"]}x/week` : "—" },
                { label: "Session Length", value: clientData["Session Duration min"] ? `${clientData["Session Duration min"]} min` : "—" },
                { label: "Start Date", value: clientData["Start Date"] || "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12 }}>
                  <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{value || "—"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: C.textMuted, textAlign: "center", padding: 40 }}>Loading profile...</div>
          )}
          {clientData?.["Equipment Available"] && (
            <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12, marginTop: 10 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>EQUIPMENT</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{clientData["Equipment Available"]}</div>
            </div>
          )}
          {clientData?.["Injury History"] && (
            <div style={{ background: "#EF444415", border: "1px solid #EF444433", borderRadius: 10, padding: 12, marginTop: 10 }}>
              <div style={{ color: "#EF4444", fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>INJURY HISTORY</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{clientData["Injury History"]}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── COACH FITNESS SECTION ────────────────────────────────────────────────────
function CoachFitnessSection({ onLogout, user }) {
  const [tab, setTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: "", category: "Strength", athleteType: "All", description: "", sets: "", reps: "", rest: "", equipment: "", cue: "", scaling: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsRes, plansRes, libRes] = await Promise.all([
        airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_CLIENTS_TABLE_ID}`),
        airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_PLANS_TABLE_ID}`),
        airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_EXERCISE_LIBRARY_TABLE_ID}`),
      ]);
      if (clientsRes?.records) setClients(clientsRes.records.filter(r => r.fields["Status"] === "Active"));
      if (plansRes?.records) setPlans(plansRes.records);
      if (libRes?.records) setLibrary(libRes.records);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const saveExercise = async () => {
    if (!newExercise.name) { setSaveMsg("Exercise name required."); return; }
    setSaving(true); setSaveMsg("");
    try {
      const res = await airtableFetch(`${AIRTABLE_BASE_ID}/${ADULT_EXERCISE_LIBRARY_TABLE_ID}`, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields: {
          "Exercise Name": newExercise.name,
          "Category": newExercise.category,
          "Athlete Type": newExercise.athleteType,
          "Description": newExercise.description,
          "Default Sets": newExercise.sets ? parseInt(newExercise.sets) : null,
          "Default Reps or Duration": newExercise.reps,
          "Default Rest (seconds)": newExercise.rest ? parseInt(newExercise.rest) : null,
          "Equipment Needed": newExercise.equipment,
          "Coaching Cue": newExercise.cue,
          "Scaling Option": newExercise.scaling,
          "Added By": "Coach",
        }}]}),
      });
      if (res.records) {
        setSaveMsg("Exercise saved!");
        setNewExercise({ name: "", category: "Strength", athleteType: "All", description: "", sets: "", reps: "", rest: "", equipment: "", cue: "", scaling: "" });
        setShowAddExercise(false);
        loadData();
      }
    } catch { setSaveMsg("Save failed."); }
    setSaving(false);
  };

  const tabs = [
    { id: "clients", label: "Clients" },
    { id: "plans", label: "Plans" },
    { id: "library", label: "Exercise Library" },
  ];

  return (
    <div>
      <div style={{ background: C.darkCard, borderBottom: `1px solid ${C.darkBorder}`, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ color: "#FF6B35", fontSize: 10, letterSpacing: 2, fontFamily: "monospace" }}>FITNESS PLATFORM</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>Adult Clients</div>
          </div>
          <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.darkBorder}`, borderRadius: 6, padding: "4px 10px", color: C.textMuted, fontSize: 11, cursor: "pointer" }}>Out</button>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
                color: tab === t.id ? "#FF6B35" : C.textMuted, fontSize: 12, fontWeight: 700,
                borderBottom: tab === t.id ? "2px solid #FF6B35" : "2px solid transparent",
                whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "clients" && (
        <div style={{ padding: 16 }}>
          {loading ? <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Loading...</div> : (
            <>
              <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 12 }}>{clients.length} active client{clients.length !== 1 ? "s" : ""}</div>
              {clients.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                  <div>No fitness clients yet.</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>Clients sign up via the Request Access form.</div>
                </div>
              ) : clients.map(client => {
                const info = ATHLETE_COLORS[client.fields["Athlete Type"]] || ATHLETE_COLORS["General Fitness"];
                const clientPlans = plans.filter(p => (p.fields["Client Name"] || "").toLowerCase() === (client.fields["Full Name"] || "").toLowerCase());
                return (
                  <div key={client.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16, marginBottom: 10, borderLeft: `4px solid ${info.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{info.emoji} {client.fields["Full Name"]}</div>
                        <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>
                          {client.fields["Athlete Type"]} · {client.fields["Experience Level"]} · {client.fields["Primary Goal"]}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, background: info.color + "25", color: info.color, border: `1px solid ${info.color}44`, borderRadius: 12, padding: "3px 10px", fontWeight: 700 }}>
                        {client.fields["Status"]}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 10, background: C.darkBorder, color: C.textMuted, borderRadius: 6, padding: "2px 8px" }}>
                        {client.fields["Training Days Per Week"]}x/week
                      </span>
                      <span style={{ fontSize: 10, background: C.darkBorder, color: C.textMuted, borderRadius: 6, padding: "2px 8px" }}>
                        {clientPlans.length} plan{clientPlans.length !== 1 ? "s" : ""}
                      </span>
                      {client.fields["Session Duration min"] && (
                        <span style={{ fontSize: 10, background: C.darkBorder, color: C.textMuted, borderRadius: 6, padding: "2px 8px" }}>
                          {client.fields["Session Duration min"]} min
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {tab === "plans" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Training Plans</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 14 }}>All adult client plans</div>
          {loading ? <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Loading...</div>
            : plans.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div>No plans yet. Ask me to create plans for your clients!</div>
              </div>
            ) : plans.map(plan => {
              const info = ATHLETE_COLORS[plan.fields["Athlete Type"]] || ATHLETE_COLORS["General Fitness"];
              return (
                <div key={plan.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 8, borderLeft: `4px solid ${info.color}` }}>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{plan.fields["Plan Name"]}</div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>
                    {plan.fields["Client Name"]} · {plan.fields["Day"]} · {plan.fields["Focus"]} · {plan.fields["Duration min"]} min
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 9, background: info.color + "25", color: info.color, border: `1px solid ${info.color}44`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{plan.fields["Athlete Type"]}</span>
                    {plan.fields["Status"] && <span style={{ fontSize: 9, background: C.success + "25", color: C.success, borderRadius: 6, padding: "2px 8px" }}>{plan.fields["Status"]}</span>}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {tab === "library" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>Exercise Library</div>
              <div style={{ color: C.textMuted, fontSize: 12 }}>{library.length} exercises</div>
            </div>
            <button onClick={() => setShowAddExercise(!showAddExercise)}
              style={btn("#FF6B35", { fontSize: 11, padding: "6px 14px" })}>
              + Add Exercise
            </button>
          </div>

          {showAddExercise && (
            <div style={{ background: C.darkCard, border: "1px solid #FF6B3544", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 12, fontFamily: "monospace" }}>ADD EXERCISE</div>
              {[
                { label: "EXERCISE NAME *", key: "name", type: "text" },
                { label: "SETS", key: "sets", type: "number" },
                { label: "REPS / DURATION", key: "reps", type: "text" },
                { label: "REST (seconds)", key: "rest", type: "number" },
                { label: "EQUIPMENT", key: "equipment", type: "text" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{f.label}</div>
                  <input type={f.type} value={newExercise[f.key]} onChange={e => setNewExercise(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inp({ fontSize: 13 })} />
                </div>
              ))}
              {[
                { label: "CATEGORY", key: "category", opts: ["Strength", "Cardio", "Olympic Lift", "Core", "Gymnastics", "Mobility", "Plyometric"] },
                { label: "ATHLETE TYPE", key: "athleteType", opts: ["All", "Hybrid Athlete", "Distance Runner", "Strength Training"] },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{f.label}</div>
                  <select value={newExercise[f.key]} onChange={e => setNewExercise(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ ...inp({ fontSize: 13 }), appearance: "none" }}>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>COACHING CUE</div>
                <textarea value={newExercise.cue} rows={2} onChange={e => setNewExercise(p => ({ ...p, cue: e.target.value }))}
                  style={{ ...inp({ fontSize: 12 }), resize: "none" }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>SCALING OPTION</div>
                <textarea value={newExercise.scaling} rows={2} onChange={e => setNewExercise(p => ({ ...p, scaling: e.target.value }))}
                  style={{ ...inp({ fontSize: 12 }), resize: "none" }} placeholder="Easier version for beginners..." />
              </div>
              {saveMsg && <div style={{ color: saveMsg.includes("saved") ? C.success : C.danger, fontSize: 12, marginBottom: 8, textAlign: "center" }}>{saveMsg}</div>}
              <button onClick={saveExercise} disabled={saving} style={btn("#FF6B35", { width: "100%", padding: 12 })}>
                {saving ? "Saving..." : "Save Exercise"}
              </button>
            </div>
          )}

          {loading ? <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Loading...</div>
            : library.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏋️</div>
                <div>No exercises yet. Add your first one above!</div>
              </div>
            ) : ["Strength", "Cardio", "Olympic Lift", "Core", "Gymnastics", "Mobility", "Plyometric"].map(cat => {
              const catEx = library.filter(e => e.fields["Category"] === cat);
              if (catEx.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ color: "#FF6B35", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>
                    {cat.toUpperCase()} ({catEx.length})
                  </div>
                  {catEx.map(ex => (
                    <div key={ex.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12, marginBottom: 6 }}>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{ex.fields["Exercise Name"]}</div>
                      {ex.fields["Default Reps or Duration"] && (
                        <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2, fontFamily: "monospace" }}>
                          {ex.fields["Default Sets"] ? `${ex.fields["Default Sets"]} sets × ` : ""}{ex.fields["Default Reps or Duration"]}
                          {ex.fields["Default Rest (seconds)"] ? ` · ${ex.fields["Default Rest (seconds)"]}s rest` : ""}
                        </div>
                      )}
                      {ex.fields["Equipment Needed"] && <div style={{ color: C.textDim, fontSize: 10, marginTop: 2 }}>{ex.fields["Equipment Needed"]}</div>}
                      {ex.fields["Coaching Cue"] && <div style={{ color: "#FFB300", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>Cue: {ex.fields["Coaching Cue"]}</div>}
                      {ex.fields["Scaling Option"] && <div style={{ color: C.success, fontSize: 10, marginTop: 3 }}>Scale: {ex.fields["Scaling Option"]}</div>}
                      {ex.fields["Athlete Type"] && ex.fields["Athlete Type"] !== "All" && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontSize: 9, background: "#FF6B3525", color: "#FF6B35", borderRadius: 6, padding: "2px 8px" }}>{ex.fields["Athlete Type"]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); // login | request_soccer | request_fitness

  if (screen === "request_soccer") return <RequestAccess onBack={() => setScreen("login")} />;
  if (screen === "request_fitness") return <FitnessRequestAccess onBack={() => setScreen("login")} />;
  if (!user) return <Login onLogin={setUser} onRequestAccess={(type) => setScreen(type === "fitness" ? "request_fitness" : "request_soccer")} />;
  const logout = () => { setUser(null); setScreen("login"); };
  if (user.role === "coach") return <CoachDashboard user={user} onLogout={logout} />;
  if (user.role === "player") return <PlayerDashboard user={user} onLogout={logout} />;
  if (user.role === "parent") return <ParentDashboard user={user} onLogout={logout} />;
  if (user.role === "fitness_client") return <FitnessClientDashboard user={user} onLogout={logout} />;
  return null;
}
