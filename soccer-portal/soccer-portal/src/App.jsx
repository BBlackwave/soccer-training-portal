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
            <button onClick={onRequestAccess}
              style={{ background: "transparent", border: "none", color: C.blueLight, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
              Request Access
            </button>
            <span style={{ color: C.textDim, fontSize: 11, display: "block", marginTop: 6 }}>
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
  const [tab, setTab] = useState("players");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loggerPlayers, setLoggerPlayers] = useState([]);
  const [loggerView, setLoggerView] = useState(null);
  const [playerDetailView, setPlayerDetailView] = useState("session");

  const tabs = [
    { id: "players", label: "Players" },
    { id: "session", label: "Session Logger" },
    { id: "team", label: "Team" },
    { id: "users", label: "Manage Users" },
  ];

  return (
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
                  {v === "session" ? "📋 Session" : v === "assess" ? "📊 Assessment" : "👤 Profile"}
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
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await airtableFetch(`${AIRTABLE_BASE_ID}/tblpL5SzrgltxfRua/${player.id}`);
      if (data.fields) {
        setProfile(data.fields);
        setForm({
          height: data.fields["Height (inches)"] || "",
          weight: data.fields["Weight lbs"] || "",
          position: data.fields["Player Position"] || "",
          foot: data.fields["Preferred Foot"] || "",
          jersey: data.fields["Jersey No"] || "",
          dob: data.fields["Date of Birth"] || "",
        });
      }
    } catch {}
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await airtableFetch(`${AIRTABLE_BASE_ID}/tblpL5SzrgltxfRua/${player.id}`, {
        method: "PATCH",
        body: JSON.stringify({ fields: {
          "Height (inches)": parseFloat(form.height) || null,
          "Weight lbs": parseFloat(form.weight) || null,
          "Player Position": form.position || null,
          "Preferred Foot": form.foot || null,
          "Jersey No": parseInt(form.jersey) || null,
          "Date of Birth": form.dob || null,
        }}),
      });
      setSaved(true); setEditing(false); loadProfile();
    } catch {}
    setSaving(false);
  };

  const bmi = form.height && form.weight
    ? ((parseFloat(form.weight) / (parseFloat(form.height) * parseFloat(form.height))) * 703).toFixed(1)
    : profile?.BMI || null;

  const bmiCategory = (b) => {
    if (!b) return null;
    if (b < 18.5) return { label: "Underweight", color: "#64B5F6" };
    if (b < 25) return { label: "Healthy", color: "#10B981" };
    if (b < 30) return { label: "Overweight", color: "#F59E0B" };
    return { label: "Obese", color: "#EF4444" };
  };
  const bmiInfo = bmiCategory(parseFloat(bmi));

  const heightDisplay = (inches) => {
    if (!inches) return "—";
    const ft = Math.floor(inches / 12);
    const inch = Math.round(inches % 12);
    return `${ft}'${inch}" (${inches}")`;
  };

  if (loading) return <div style={{ padding: 20, color: C.textMuted, textAlign: "center" }}>Loading profile...</div>;

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
      <div style={{ background: player.color + "20", border: `1px solid ${player.color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: player.color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PLAYER PROFILE</div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 800, marginTop: 2 }}>{player.emoji} {player.name}</div>
            {profile?.["Player Position"] && <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{profile["Player Position"]} · #{profile["Jersey No"] || "—"}</div>}
          </div>
          {canEdit && (
            <button onClick={() => setEditing(!editing)}
              style={{ background: editing ? C.darkBorder : player.color, border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {editing ? "Cancel" : "✏️ Edit"}
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "Height", value: heightDisplay(profile?.["Height (inches)"]) },
              { label: "Weight", value: profile?.["Weight lbs"] ? `${profile["Weight lbs"]} lbs` : "—" },
              { label: "Date of Birth", value: profile?.["Date of Birth"] || "—" },
              { label: "Preferred Foot", value: profile?.["Preferred Foot"] || "—" },
              { label: "Position", value: profile?.["Player Position"] || "—" },
              { label: "Jersey No", value: profile?.["Jersey No"] ? `#${profile["Jersey No"]}` : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{label.toUpperCase()}</div>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* BMI Card */}
          {bmi && (
            <div style={{ background: C.darkCard, border: `1px solid ${bmiInfo?.color || C.darkBorder}44`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>BMI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ color: bmiInfo?.color || C.text, fontSize: 36, fontWeight: 800, fontFamily: "monospace" }}>{bmi}</div>
                <div>
                  {bmiInfo && <div style={{ background: bmiInfo.color + "25", color: bmiInfo.color, border: `1px solid ${bmiInfo.color}44`, borderRadius: 12, padding: "3px 12px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>{bmiInfo.label}</div>}
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>Body Mass Index · Auto-calculated</div>
                </div>
              </div>
              {/* BMI scale */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", height: 6 }}>
                  {[{ color: "#64B5F6", w: "25%" }, { color: "#10B981", w: "35%" }, { color: "#F59E0B", w: "25%" }, { color: "#EF4444", w: "15%" }].map((s, i) => (
                    <div key={i} style={{ background: s.color, width: s.w }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {["Underweight", "Healthy", "Overweight", "Obese"].map(l => (
                    <span key={l} style={{ fontSize: 8, color: C.textDim }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!canEdit && !profile?.["Height (inches)"] && (
            <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14, textAlign: "center", color: C.textMuted, fontSize: 12 }}>
              Profile not yet filled in. Ask your coach to update your profile.
            </div>
          )}
        </>
      ) : (
        /* Edit form */
        <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 12, fontFamily: "monospace" }}>EDIT PROFILE</div>
          {[
            { label: "HEIGHT (inches)", key: "height", type: "number", placeholder: 'e.g. 68 for 5'8"' },
            { label: "WEIGHT (lbs)", key: "weight", type: "number", placeholder: "e.g. 145" },
            { label: "DATE OF BIRTH", key: "dob", type: "date", placeholder: "" },
            { label: "JERSEY NUMBER", key: "jersey", type: "number", placeholder: "e.g. 10" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{f.label}</div>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={inp({ fontSize: 13 })} />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>POSITION</div>
            <select style={{ ...inp({ fontSize: 13 }), appearance: "none" }} value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}>
              <option value="">Select...</option>
              {["Forward", "Striker", "Winger", "Attacking Mid", "Midfielder", "Defensive Mid", "Defender", "Center Back", "Full Back", "Goalkeeper"].map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>PREFERRED FOOT</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Right", "Left", "Both"].map(f => (
                <button key={f} onClick={() => setForm(p => ({ ...p, foot: f }))}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `2px solid ${form.foot === f ? player.color : C.darkBorder}`,
                    background: form.foot === f ? player.color + "25" : "transparent", color: form.foot === f ? player.color : C.textMuted,
                    cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* BMI preview */}
          {form.height && form.weight && (
            <div style={{ background: C.blueFade, border: `1px solid ${C.blue}44`, borderRadius: 8, padding: 10, marginBottom: 12, textAlign: "center" }}>
              <span style={{ color: C.textMuted, fontSize: 11 }}>BMI Preview: </span>
              <span style={{ color: C.blueLight, fontSize: 15, fontWeight: 800 }}>{bmi}</span>
              {bmiInfo && <span style={{ color: bmiInfo.color, fontSize: 11, marginLeft: 8 }}>({bmiInfo.label})</span>}
            </div>
          )}
          {saved && <div style={{ color: C.success, fontSize: 12, textAlign: "center", marginBottom: 8 }}>✅ Profile saved!</div>}
          <button onClick={saveProfile} disabled={saving}
            style={btn(player.color, { width: "100%", padding: 12 })}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ASSESSMENT FORM ──────────────────────────────────────────────────────────
const PHYSICAL_TESTS = [
  { key: "sprint10", label: "10 Yard Sprint", unit: "seconds", field: "Sprint 10 Yard (seconds)" },
  { key: "sprint40", label: "40 Yard Sprint", unit: "seconds", field: "Sprint 40 Yard (seconds)" },
  { key: "shuttle", label: "5-10-5 Shuttle", unit: "seconds", field: "5-10-5 Shuttle (seconds)" },
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
        {loadingHistory ? "Loading..." : "📊 View Assessment History"}
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
  const tabs = [{ id: "plan", label: "My Plan" }, { id: "log", label: "Log Session" }, { id: "assessment", label: "Assessment" }, { id: "profile", label: "My Profile" }];
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
      {tab === "assessment" && <AssessmentForm player={player} readOnly={true} />}
      {tab === "profile" && <PlayerProfile player={player} canEdit={false} />}
    </div>
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ user, onLogout }) {
  const player = PLAYERS_DATA.find(p => p.id === user.childId);
  const [tab, setTab] = useState("overview");
  const tabs = [{ id: "overview", label: "Overview" }, { id: "plan", label: "Training Plan" }, { id: "assessment", label: "Assessment" }, { id: "profile", label: "Profile" }];
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");

  if (screen === "request") return <RequestAccess onBack={() => setScreen("login")} />;
  if (!user) return <Login onLogin={setUser} onRequestAccess={() => setScreen("request")} />;
  const logout = () => { setUser(null); setScreen("login"); };
  if (user.role === "coach") return <CoachDashboard user={user} onLogout={logout} />;
  if (user.role === "player") return <PlayerDashboard user={user} onLogout={logout} />;
  if (user.role === "parent") return <ParentDashboard user={user} onLogout={logout} />;
  return null;
}
