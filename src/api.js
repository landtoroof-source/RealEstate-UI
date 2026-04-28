// ── config ────────────────────────────────────────────────────────────────────
// Change this to your deployed Render URL in production
const BASE_URL = process.env.REACT_APP_API_URL || 'https://realestateapp-1-v8ut.onrender.com';

// ── chat ──────────────────────────────────────────────────────────────────────
export async function sendChat({ sessionId, message, history }) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      history: history.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json(); // { reply, session_id, lead_detected }
}

// ── lead capture ──────────────────────────────────────────────────────────────
export async function captureLead({ sessionId, name, email, phone, interest }) {
  const res = await fetch(`${BASE_URL}/leads/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      name,
      email: email || null,
      phone: phone || null,
      interest: interest || null,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
