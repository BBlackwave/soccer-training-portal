import { useState, useEffect } from "react";

// ─── MOCK AUTH DATABASE ───────────────────────────────────────────────────────
// In production, replace with real auth (Firebase, Supabase, etc.)
const USERS = [
  { id: "coach-1", email: "coach@soccerdb.com", password: "coach123", role: "coach", name: "Coach" },
  { id: "player-aaron", email: "aaron@soccerdb.com", password: "aaron123", role: "player", name: "Aaron", playerId: "recPaWuQLtussFtna" },
  { id: "player-noah", email: "noah@soccerdb.com", password: "noah123", role: "player", name: "Noah", playerId: "rectUtNasT2HwjUwe" },
  { id: "player-alexander", email: "alexander@soccerdb.com", password: "alex123", role: "player", name: "Alexander", playerId: "rec88HsXp6OYXgzg3" },
  { id: "parent-1", email: "parent.aaron@soccerdb.com", password: "parent123", role: "parent", name: "Aaron's Parent", childId: "recPaWuQLtussFtna", childName: "Aaron" },
  { id: "parent-2", email: "parent.noah@soccerdb.com", password: "parent456", role: "parent", name: "Noah's Parent", childId: "rectUtNasT2HwjUwe", childName: "Noah" },
  { id: "parent-3", email: "parent.alex@soccerdb.com", password: "parent789", role: "parent", name: "Alexander's Parent", childId: "rec88HsXp6OYXgzg3", childName: "Alexander" },
];

const AIRTABLE_BASE_ID = "app0CglR4la9Jalnw";
const SESSION_LOGS_TABLE_ID = "tbl5GtDcTbdhN7i0t";

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
      { name: "Warm-Up", exercises: [
        { id: "n-wu-1", name: "4v2 Rondo", prescription: "10 min", sets: 1 },
      ]},
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
      { name: "Warm-Up", exercises: [
        { id: "al-wu-1", name: "4v2 Rondo", prescription: "10 min", sets: 1 },
      ]},
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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const C = {
  dark: "#0A1628", darkCard: "#111E35", darkBorder: "#1C2D4A",
  blue: "#2563EB", blueLight: "#3B82F6", blueFade: "#1E3A5F",
  text: "#F0F4FF", textMuted: "#7A92B8", textDim: "#4A6080",
  success: "#10B981", warning: "#F59E0B", danger: "#EF4444",
  white: "#FFFFFF",
};

const inp = (extra = {}) => ({
  width: "100%", boxSizing: "border-box",
  background: C.darkCard, border: `1px solid ${C.darkBorder}`,
  borderRadius: 8, padding: "10px 14px",
  color: C.text, fontSize: 14, outline: "none",
  fontFamily: "'DM Mono', monospace",
  ...extra,
});

const btn = (bg, extra = {}) => ({
  background: bg, color: "#fff", border: "none",
  borderRadius: 8, padding: "10px 20px",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
  letterSpacing: 0.3, transition: "opacity 0.2s",
  ...extra,
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.email === email.trim().toLowerCase() && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Invalid email or password."); }
      setLoading(false);
    }, 600);
  };

  const demoLogin = (u) => { setEmail(u.email); setPassword(u.password); };

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚽</div>
          <div style={{ color: C.text, fontSize: 24, fontWeight: 800, letterSpacing: -0.5, fontFamily: "'DM Sans', sans-serif" }}>
            Soccer Training DB
          </div>
          <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Player Portal</div>
        </div>

        {/* Form */}
        <div style={{ background: C.darkCard, borderRadius: 16, padding: 24, border: `1px solid ${C.darkBorder}` }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>EMAIL</div>
            <input style={inp()} type="email" value={email} placeholder="your@email.com"
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 6, fontFamily: "monospace" }}>PASSWORD</div>
            <input style={inp()} type="password" value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <button style={btn(C.blue, { width: "100%", padding: 14, fontSize: 15 })}
            onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 20, background: C.darkCard, borderRadius: 12, padding: 16, border: `1px solid ${C.darkBorder}` }}>
          <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, textAlign: "center", fontFamily: "monospace" }}>
            DEMO ACCOUNTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { label: "🏋️ Coach", user: USERS[0] },
              { label: "💪 Aaron", user: USERS[1] },
              { label: "⚽ Noah", user: USERS[2] },
              { label: "🎯 Alex", user: USERS[3] },
              { label: "👨‍👩‍👦 Parent A", user: USERS[4] },
              { label: "👨‍👩‍👦 Parent N", user: USERS[5] },
            ].map(({ label, user }) => (
              <button key={user.id} onClick={() => demoLogin(user)}
                style={{ background: C.blueFade, border: `1px solid ${C.darkBorder}`, borderRadius: 8,
                  padding: "6px 4px", color: C.text, fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                {label}
              </button>
            ))}
          </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚽</span>
          <span style={{ color: C.text, fontSize: 14, fontWeight: 800, letterSpacing: -0.3 }}>Soccer Training DB</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, background: roleColors[user.role] + "33", color: roleColors[user.role],
            border: `1px solid ${roleColors[user.role]}55`, borderRadius: 20, padding: "2px 8px", fontWeight: 700, textTransform: "uppercase" }}>
            {user.role}
          </span>
          <span style={{ color: C.textMuted, fontSize: 12 }}>{user.name}</span>
          <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${C.darkBorder}`,
            borderRadius: 6, padding: "4px 10px", color: C.textMuted, fontSize: 11, cursor: "pointer" }}>
            Out
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
              color: activeTab === t.id ? C.blueLight : C.textMuted, fontSize: 12, fontWeight: 700,
              borderBottom: activeTab === t.id ? `2px solid ${C.blueLight}` : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SESSION LOGGER ───────────────────────────────────────────────────────────
function buildExerciseState(player) {
  const state = {};
  player.blocks.forEach(b => b.exercises.forEach(ex => {
    state[ex.id] = { sets: Array.from({ length: ex.sets }, () => ({ reps: "", weight: "", note: "" })), exerciseNote: "" };
  }));
  return state;
}

const setInp = { border: "1px solid #1C2D4A", borderRadius: 5, padding: "4px 6px", fontSize: 11,
  outline: "none", width: "100%", boxSizing: "border-box", background: "#0D1825", color: "#F0F4FF", fontFamily: "monospace" };

function ExerciseCard({ exercise, exData, onChange, color }) {
  const [open, setOpen] = useState(false);
  const anyDone = exData.sets.some(s => s.reps !== "");
  const allDone = exData.sets.length > 0 && exData.sets.every(s => s.reps !== "");
  return (
    <div style={{ border: `1px solid ${allDone ? color : anyDone ? color + "55" : C.darkBorder}`,
      borderRadius: 10, marginBottom: 6, overflow: "hidden",
      background: allDone ? color + "15" : C.darkCard }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "10px 12px", display: "flex",
        justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%",
            background: allDone ? color : anyDone ? color + "88" : C.textDim, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{exercise.name}</div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{exercise.prescription}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {allDone && <span style={{ fontSize: 9, background: color, color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>✓</span>}
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
              <span style={{ fontSize: 9, color: C.textDim, textAlign: "center", lineHeight: "28px" }}>S{i+1}</span>
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

function SessionLogger({ player, user }) {
  const [exercises, setExercises] = useState(() => buildExerciseState(player));
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

  const saveSession = async () => {
    setSaving(true); setError("");
    const today = new Date().toISOString().split("T")[0];
    const title = `${player.name} — ${player.planType} ${today}`;
    let notes = [];
    player.blocks.forEach(b => b.exercises.forEach(ex => {
      const d = exercises[ex.id];
      const lines = d.sets.filter(s => s.reps).map((s, i) =>
        `  Set ${i+1}: ${s.reps} reps${s.weight ? " @ " + s.weight : ""}${s.note ? " — " + s.note : ""}`
      ).join("\n");
      if (lines) notes.push(`${ex.name}\n${lines}`);
      if (d.exerciseNote) notes.push(`  💬 ${d.exerciseNote}`);
    }));
    const fullNotes = notes.join("\n\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Save session log to Airtable. Base: ${AIRTABLE_BASE_ID}, Table: ${SESSION_LOGS_TABLE_ID}. Session Title: "${title}", Session Date: "${today}", Session Type: "${player.planType}", Duration: ${player.duration}, Coach Notes: ${JSON.stringify(coachNotes || fullNotes.slice(0,400))}, Areas to Improve: ${JSON.stringify(areasToImprove)}, Progress Notes: ${JSON.stringify(progressNotes || fullNotes)}, Plan Assignment: ["${player.assignmentId}"], Player: ["${player.id}"]. Confirm when saved.` }],
          mcp_servers: [{ type: "url", url: "https://mcp.airtable.com/mcp", name: "airtable-mcp" }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (res.status !== 200 || text.toLowerCase().includes("error")) { setError("Save failed. Try again."); }
      else { setSaved(true); }
    } catch { setError("Network error."); }
    setSaving(false);
  };

  return (
    <div style={{ padding: "12px 14px" }}>
      {/* Header */}
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

      {/* Block tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto" }}>
        {player.blocks.map(b => (
          <button key={b.name} onClick={() => setActiveBlock(b.name)}
            style={{ padding: "5px 12px", borderRadius: 14, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              background: activeBlock === b.name ? player.color : C.darkBorder,
              color: activeBlock === b.name ? "#fff" : C.textMuted }}>
            {b.name}
          </button>
        ))}
      </div>

      {/* Exercises */}
      {currentBlock?.exercises.map(ex => (
        <ExerciseCard key={ex.id} exercise={ex} exData={exercises[ex.id]}
          onChange={d => updateEx(ex.id, d)} color={player.color} />
      ))}

      {/* Notes */}
      <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginTop: 8 }}>
        <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>SESSION NOTES</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}
              style={{ flex: 1, height: 32, borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 14, background: rating >= n ? "#FFB300" : C.darkBorder }}>⭐</button>
          ))}
        </div>
        <textarea placeholder="Coach notes..." value={coachNotes} rows={2}
          onChange={e => setCoachNotes(e.target.value)}
          style={{...inp(), marginBottom: 8, resize: "none", fontSize: 12}} />
        <textarea placeholder="Areas to improve..." value={areasToImprove} rows={2}
          onChange={e => setAreasToImprove(e.target.value)}
          style={{...inp(), marginBottom: 8, resize: "none", fontSize: 12}} />
        <textarea placeholder="Progress notes..." value={progressNotes} rows={2}
          onChange={e => setProgressNotes(e.target.value)}
          style={{...inp(), resize: "none", fontSize: 12}} />
      </div>

      {/* Save */}
      <div style={{ marginTop: 12 }}>
        {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 8, textAlign: "center" }}>{error}</div>}
        {saved ? (
          <div style={{ background: C.success + "20", border: `1px solid ${C.success}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>✅</div>
            <div style={{ color: C.success, fontWeight: 700, marginTop: 4 }}>Session saved to Airtable!</div>
          </div>
        ) : (
          <button onClick={saveSession} disabled={saving || completed === 0}
            style={btn(completed === 0 ? C.textDim : player.color, { width: "100%", padding: 14, fontSize: 14, cursor: completed === 0 ? "not-allowed" : "pointer" })}>
            {saving ? "Saving..." : `Save Session${completed > 0 ? ` (${completed}/${allEx.length})` : ""}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PLAYER VIEW ──────────────────────────────────────────────────────────────
function PlayerDashboard({ user }) {
  const player = PLAYERS_DATA.find(p => p.id === user.playerId);
  const [tab, setTab] = useState("plan");
  const tabs = [{ id: "plan", label: "My Plan" }, { id: "log", label: "Log Session" }];

  if (!player) return <div style={{ padding: 20, color: C.textMuted }}>No training plan found.</div>;

  return (
    <div>
      <TopNav user={user} activeTab={tab} setActiveTab={setTab} tabs={tabs} onLogout={() => window.location.reload()} />
      {tab === "plan" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            {player.emoji} My Training Plan
          </div>
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
      {tab === "log" && <SessionLogger player={player} user={user} />}
    </div>
  );
}

// ─── PARENT VIEW ──────────────────────────────────────────────────────────────
function ParentDashboard({ user }) {
  const player = PLAYERS_DATA.find(p => p.id === user.childId);
  const [tab, setTab] = useState("overview");
  const tabs = [{ id: "overview", label: "Overview" }, { id: "plan", label: "Training Plan" }];

  if (!player) return <div style={{ padding: 20, color: C.textMuted }}>No player data found.</div>;

  return (
    <div>
      <TopNav user={user} activeTab={tab} setActiveTab={setTab} tabs={tabs} onLogout={() => window.location.reload()} />
      {tab === "overview" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            {player.emoji} {player.name}'s Dashboard
          </div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Plan Type", value: player.planType, color: player.color },
              { label: "Duration", value: `${player.duration} min`, color: C.blueLight },
              { label: "Phase", value: "Pre-Season 1", color: C.success },
              { label: "Status", value: "Active ✓", color: C.success },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ color, fontSize: 15, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>CURRENT PLAN</div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{player.planName}</div>
            <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>
              {player.blocks.reduce((acc, b) => acc + b.exercises.length, 0)} exercises across {player.blocks.length} blocks
            </div>
          </div>
        </div>
      )}
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

// ─── COACH VIEW ───────────────────────────────────────────────────────────────
function CoachDashboard({ user }) {
  const [tab, setTab] = useState("players");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loggerPlayers, setLoggerPlayers] = useState([]);
  const [loggerView, setLoggerView] = useState(null);

  const tabs = [
    { id: "players", label: "Players" },
    { id: "session", label: "Session Logger" },
    { id: "team", label: "Team Overview" },
  ];

  return (
    <div>
      <TopNav user={user} activeTab={tab} setActiveTab={(t) => { setTab(t); setSelectedPlayer(null); }} tabs={tabs} onLogout={() => window.location.reload()} />

      {/* PLAYERS TAB */}
      {tab === "players" && !selectedPlayer && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Players</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1 · 3 active</div>
          {PLAYERS_DATA.map(p => (
            <div key={p.id} onClick={() => setSelectedPlayer(p)}
              style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12,
                padding: 16, marginBottom: 10, cursor: "pointer", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: p.color + "30",
                    border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {p.emoji}
                  </div>
                  <div>
                    <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{p.planName}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 10, background: p.color + "25", color: p.color,
                    border: `1px solid ${p.color}44`, borderRadius: 12, padding: "3px 10px", fontWeight: 700 }}>
                    {p.planType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PLAYER DETAIL */}
      {tab === "players" && selectedPlayer && (
        <div>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.darkBorder}`, display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setSelectedPlayer(null)}
              style={{ background: C.darkBorder, border: "none", borderRadius: 6, padding: "5px 10px", color: C.text, cursor: "pointer", fontSize: 12 }}>
              ← Back
            </button>
            <span style={{ color: C.text, fontWeight: 700 }}>{selectedPlayer.emoji} {selectedPlayer.name}</span>
          </div>
          <SessionLogger player={selectedPlayer} user={user} />
        </div>
      )}

      {/* SESSION LOGGER TAB */}
      {tab === "session" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Session Logger</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Select players to log</div>

          {/* Player selector */}
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>SELECT PLAYERS</div>
            <div style={{ display: "flex", gap: 8 }}>
              {PLAYERS_DATA.map(p => {
                const selected = loggerPlayers.includes(p.id);
                return (
                  <button key={p.id} onClick={() => setLoggerPlayers(prev => selected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                    style={{ flex: 1, padding: "10px 6px", borderRadius: 10,
                      border: `2px solid ${selected ? p.color : C.darkBorder}`,
                      background: selected ? p.color + "20" : "transparent",
                      cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 20 }}>{p.emoji}</div>
                    <div style={{ color: selected ? p.color : C.textMuted, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{p.name}</div>
                  </button>
                );
              })}
            </div>
            {loggerPlayers.length > 0 && (
              <button onClick={() => setLoggerView(loggerPlayers[0])}
                style={btn(C.blue, { width: "100%", marginTop: 12, padding: 12 })}>
                Start Session ({loggerPlayers.length} player{loggerPlayers.length > 1 ? "s" : ""})
              </button>
            )}
          </div>

          {/* Active logger */}
          {loggerView && loggerPlayers.length > 0 && (
            <div>
              {/* View toggle */}
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {loggerPlayers.length > 1 && (
                  <button onClick={() => setLoggerView("split")}
                    style={btn(loggerView === "split" ? C.blue : C.darkBorder, { fontSize: 11, padding: "6px 12px" })}>
                    Split
                  </button>
                )}
                {loggerPlayers.map(pid => {
                  const p = PLAYERS_DATA.find(pl => pl.id === pid);
                  return (
                    <button key={pid} onClick={() => setLoggerView(pid)}
                      style={btn(loggerView === pid ? p.color : C.darkBorder, { fontSize: 11, padding: "6px 12px" })}>
                      {p.emoji} {p.name}
                    </button>
                  );
                })}
              </div>

              {loggerView === "split" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {loggerPlayers.map(pid => {
                    const p = PLAYERS_DATA.find(pl => pl.id === pid);
                    return (
                      <div key={pid} style={{ flex: 1, background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, overflow: "hidden" }}>
                        <SessionLogger player={p} user={user} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SessionLogger player={PLAYERS_DATA.find(p => p.id === loggerView)} user={user} />
              )}
            </div>
          )}
        </div>
      )}

      {/* TEAM OVERVIEW TAB */}
      {tab === "team" && (
        <div style={{ padding: 16 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Team Overview</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Pre-Season Phase 1 · May 26 – Jul 26, 2026</div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Players", value: "3", color: C.blue },
              { label: "Phase", value: "1 of 4", color: C.warning },
              { label: "Status", value: "Active", color: C.success },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ color, fontSize: 18, fontWeight: 800 }}>{value}</div>
                <div style={{ color: C.textMuted, fontSize: 10, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Players summary */}
          {PLAYERS_DATA.map(p => (
            <div key={p.id} style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 12, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <span style={{ color: C.text, fontWeight: 700 }}>{p.name}</span>
                </div>
                <span style={{ color: p.color, fontSize: 11, fontWeight: 700 }}>{p.planType}</span>
              </div>
              <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 6 }}>{p.planName}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {p.blocks.map(b => (
                  <span key={b.name} style={{ fontSize: 9, background: p.color + "20", color: p.color,
                    border: `1px solid ${p.color}33`, borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>
                    {b.name} ({b.exercises.length})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;
  if (user.role === "coach") return <CoachDashboard user={user} />;
  if (user.role === "player") return <PlayerDashboard user={user} />;
  if (user.role === "parent") return <ParentDashboard user={user} />;
  return <div style={{ color: C.text, padding: 20 }}>Unknown role.</div>;
}
