import { useState } from 'react';
import { captureLead } from '../api';

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem',
    animation: 'fadeUp 0.25s ease',
  },
  card: {
    background: 'var(--surface)',
    border: '0.5px solid var(--border2)',
    borderRadius: '20px',
    padding: '2rem',
    width: '100%', maxWidth: '420px',
    position: 'relative',
  },
  accent: {
    display: 'block',
    width: '40px', height: '2px',
    background: 'var(--gold)',
    marginBottom: '1.25rem',
    borderRadius: '1px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--text)',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '1.75rem',
    lineHeight: 1.5,
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    background: 'var(--surface2)',
    border: '0.5px solid var(--border2)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--text)',
    outline: 'none',
    marginBottom: '1rem',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body)',
  },
  row: { display: 'flex', gap: '10px' },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'var(--gold)',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s',
  },
  skip: {
    display: 'block',
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '13px',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
  },
  success: {
    textAlign: 'center',
    padding: '1rem 0',
  },
  checkCircle: {
    width: '52px', height: '52px',
    borderRadius: '50%',
    background: 'var(--gold-dim)',
    border: '1px solid var(--gold)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.25rem',
    fontSize: '22px',
  },
};

export default function LeadForm({ sessionId, interest, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--gold)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'var(--border2)'; };

  const submit = async () => {
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.email.trim() && !form.phone.trim()) {
      setError('Please enter at least an email or phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await captureLead({ sessionId, ...form, interest });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.card}>
        {done ? (
          <div style={styles.success}>
            <div style={styles.checkCircle}>✓</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>
              We'll be in touch
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Our advisors will reach out within 24 hours with personalised property options.
            </p>
            <button style={{ ...styles.btn, marginTop: '1.5rem' }} onClick={onClose}>
              Continue chatting
            </button>
          </div>
        ) : (
          <>
            <span style={styles.accent} />
            <p style={styles.title}>Book a free consultation</p>
            <p style={styles.sub}>
              Our real estate experts will reach out with personalised property suggestions tailored to your goals.
            </p>

            <label style={styles.label}>Full name *</label>
            <input
              style={styles.input}
              placeholder="Ravi Kumar"
              value={form.name}
              onChange={set('name')}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={set('email')}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Phone</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={set('phone')}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '12px', color: '#e05a4e', marginBottom: '10px' }}>{error}</p>
            )}

            <button
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Get free consultation →'}
            </button>
            <button style={styles.skip} onClick={onClose}>
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
