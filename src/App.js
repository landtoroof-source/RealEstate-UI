import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './index.css';
import { sendChat } from './api';
import Message from './components/Message';
import TypingIndicator from './components/TypingIndicator';
import QuickReplies from './components/QuickReplies';
import LeadForm from './components/LeadForm';

// ── session id (persists per tab) ─────────────────────────────────────────────
const SESSION_ID = uuid();

// ── keywords that trigger lead form offer ─────────────────────────────────────
const LEAD_TRIGGER_KEYWORDS = [
  'consultation', 'contact', 'call me', 'reach out', 'free call',
  'share your', 'name and', 'phone', 'email', 'get in touch',
  'advisor', 'expert', 'follow up', 'details',
];

const LEAD_TRIGGER_PHRASES = [
  'would you like', 'shall we', 'interested in speaking',
  "let's connect", 'connect with', 'get you connected',
];

function shouldOfferLeadForm(text) {
  const lower = text.toLowerCase();
  const hasKeyword = LEAD_TRIGGER_KEYWORDS.some(k => lower.includes(k));
  const hasPhrase  = LEAD_TRIGGER_PHRASES.some(p => lower.includes(p));
  return hasKeyword && hasPhrase;
}

// ── greeting ──────────────────────────────────────────────────────────────────
const GREETING = {
  role: 'assistant',
  content: `Welcome to PropAI — your intelligent real estate advisor.\n\nI'm here to help you navigate the property market, whether you're buying, renting, or looking to invest. What brings you here today?`,
};

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  app: {
    display: 'flex', height: '100vh', overflow: 'hidden',
    background: 'var(--bg)',
  },

  // ── sidebar ──
  sidebar: {
    width: '260px', flexShrink: 0,
    background: 'var(--surface)',
    borderRight: '0.5px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    padding: '0',
  },
  logo: {
    padding: '1.5rem 1.25rem 1rem',
    borderBottom: '0.5px solid var(--border)',
  },
  logoMark: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  logoTag: {
    display: 'flex', alignItems: 'center', gap: '6px',
    marginTop: '4px',
  },
  dot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--gold)',
  },
  logoSub: {
    fontSize: '11px', color: 'var(--text-muted)',
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  sideSection: {
    padding: '1.25rem',
    borderBottom: '0.5px solid var(--border)',
  },
  sideSectionTitle: {
    fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--text-dim)', marginBottom: '12px',
  },
  statRow: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  statItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)' },
  statVal: {
    fontSize: '12px', fontWeight: 500,
    color: 'var(--gold)', fontFamily: 'var(--font-display)',
  },
  sideCta: {
    margin: '1.25rem',
    marginTop: 'auto',
    padding: '14px',
    background: 'var(--gold-dim)',
    border: '0.5px solid rgba(201,168,76,0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  sideCtaTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px', color: 'var(--gold)',
    marginBottom: '4px',
  },
  sideCtaSub: {
    fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5,
  },

  // ── main chat ──
  main: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '0.5px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--surface)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'var(--gold-dim)',
    border: '0.5px solid var(--gold)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontSize: '16px',
    color: 'var(--gold)',
  },
  headerName: {
    fontFamily: 'var(--font-display)', fontSize: '16px',
    color: 'var(--text)',
  },
  onlineBadge: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '11px', color: '#4caf80',
  },
  onlineDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#4caf80',
  },
  headerRight: {
    display: 'flex', gap: '8px',
  },
  headerBtn: {
    background: 'transparent',
    border: '0.5px solid var(--border2)',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.15s',
  },

  // ── messages ──
  messages: {
    flex: 1, overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column',
    gap: '2px',
  },

  // ── input area ──
  inputArea: {
    padding: '1rem 1.5rem',
    borderTop: '0.5px solid var(--border)',
    background: 'var(--surface)',
  },
  inputWrap: {
    display: 'flex', gap: '10px', alignItems: 'flex-end',
    background: 'var(--surface2)',
    border: '0.5px solid var(--border2)',
    borderRadius: '14px',
    padding: '8px 8px 8px 16px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    resize: 'none', color: 'var(--text)',
    fontFamily: 'var(--font-body)', fontSize: '14px',
    lineHeight: 1.6, minHeight: '24px', maxHeight: '120px',
    overflowY: 'auto', paddingTop: '2px',
  },
  sendBtn: (active) => ({
    width: '36px', height: '36px', borderRadius: '10px',
    background: active ? 'var(--gold)' : 'var(--border)',
    border: 'none', cursor: active ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s',
  }),
  leadBanner: {
    margin: '0 0 10px',
    padding: '10px 14px',
    background: 'var(--gold-dim)',
    border: '0.5px solid rgba(201,168,76,0.35)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '12px',
    animation: 'fadeUp 0.25s ease',
  },
  bannerText: { fontSize: '13px', color: 'var(--gold)', flex: 1 },
  bannerBtn: {
    background: 'var(--gold)', color: '#0a0a0a',
    border: 'none', borderRadius: '8px',
    padding: '6px 14px', fontSize: '12px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  bannerClose: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', fontSize: '16px', padding: '0 4px', flexShrink: 0,
  },
};

// ── component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [messages,    setMessages]    = useState([GREETING]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [showBanner,  setShowBanner]  = useState(false);
  const [interest,    setInterest]    = useState('');
  const [msgCount,    setMsgCount]    = useState(0);
  const [showQuick,   setShowQuick]   = useState(true);

  const bottomRef  = useRef(null);
  const textRef    = useRef(null);
  const inputWrap  = useRef(null);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // auto-resize textarea
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const send = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    setShowQuick(false);
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // track user interest from first message
    if (!interest) setInterest(msg.slice(0, 120));

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const data = await sendChat({ sessionId: SESSION_ID, message: msg, history });

      const aiMsg = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      const newCount = msgCount + 1;
      setMsgCount(newCount);

      // Show banner if AI is nudging toward lead capture, or after 4 exchanges
      if (shouldOfferLeadForm(data.reply) || newCount >= 4) {
        setShowBanner(true);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please make sure the backend is running on http://127.0.0.1:8000',
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, interest, msgCount]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFocus = () => {
    if (inputWrap.current) inputWrap.current.style.borderColor = 'rgba(201,168,76,0.4)';
  };
  const handleBlur = () => {
    if (inputWrap.current) inputWrap.current.style.borderColor = 'var(--border2)';
  };

  const marketStats = [
    { label: 'Bangalore avg price', val: '₹8,200/sqft' },
    { label: 'Mumbai avg price',    val: '₹19,500/sqft' },
    { label: 'Hyderabad growth',    val: '+12% YoY' },
    { label: 'Home loan rate',      val: '8.5% p.a.' },
  ];

  return (
    <div style={S.app}>
      {/* ── sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoMark}>PropAI</div>
          <div style={S.logoTag}>
            <div style={S.dot} />
            <span style={S.logoSub}>Real Estate Advisor</span>
          </div>
        </div>

        <div style={S.sideSection}>
          <div style={S.sideSectionTitle}>Market pulse</div>
          <div style={S.statRow}>
            {marketStats.map(s => (
              <div key={s.label} style={S.statItem}>
                <span style={S.statLabel}>{s.label}</span>
                <span style={S.statVal}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.sideSection}>
          <div style={S.sideSectionTitle}>I can help with</div>
          {['Buy / Rent guidance', 'Investment strategy', 'EMI & loan advice', 'Location analysis', 'RERA & legal basics'].map(t => (
            <div key={t} style={{
              fontSize: '12px', color: 'var(--text-muted)',
              padding: '5px 0',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ color: 'var(--gold)', fontSize: '10px' }}>◆</span>
              {t}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={S.sideCta} onClick={() => setShowForm(true)}>
          <div style={S.sideCtaTitle}>Free consultation</div>
          <div style={S.sideCtaSub}>Talk to a real estate expert. No cost, no commitment.</div>
        </div>
      </aside>

      {/* ── chat main ── */}
      <main style={S.main}>
        {/* header */}
        <header style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.avatar}>P</div>
            <div>
              <div style={S.headerName}>PropAI Advisor</div>
              <div style={S.onlineBadge}>
                <div style={S.onlineDot} />
                Online — responds instantly
              </div>
            </div>
          </div>
          <div style={S.headerRight}>
            <button
              style={S.headerBtn}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text-muted)'; }}
              onClick={() => setShowForm(true)}
            >
              Book consultation
            </button>
            <button
              style={S.headerBtn}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text-muted)'; }}
              onClick={() => { setMessages([GREETING]); setMsgCount(0); setShowQuick(true); setShowBanner(false); setInterest(''); }}
            >
              New chat
            </button>
          </div>
        </header>

        {/* messages */}
        <div style={S.messages}>
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* input area */}
        <div style={S.inputArea}>
          {/* lead banner */}
          {showBanner && !showForm && (
            <div style={S.leadBanner}>
              <span style={S.bannerText}>
                🏠 Get personalised property options — book a free expert call
              </span>
              <button style={S.bannerBtn} onClick={() => { setShowForm(true); setShowBanner(false); }}>
                Yes, let's connect
              </button>
              <button style={S.bannerClose} onClick={() => setShowBanner(false)}>×</button>
            </div>
          )}

          {/* quick replies */}
          <QuickReplies visible={showQuick} onSelect={(t) => send(t)} />

          {/* text input */}
          <div style={S.inputWrap} ref={inputWrap}>
            <textarea
              ref={textRef}
              style={S.textarea}
              placeholder="Ask about properties, investments, EMI, locations…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={1}
            />
            <button
              style={S.sendBtn(!!input.trim() && !loading)}
              onClick={() => send()}
              disabled={!input.trim() || loading}
            >
              {loading
                ? <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #0a0a0a', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke={input.trim() ? '#0a0a0a' : 'var(--text-dim)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() ? '#0a0a0a' : 'var(--text-dim)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '8px' }}>
            AI-powered advice · Not a substitute for professional legal or financial consultation
          </p>
        </div>
      </main>

      {/* lead form modal */}
      {showForm && (
        <LeadForm
          sessionId={SESSION_ID}
          interest={interest}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
