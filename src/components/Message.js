const styles = {
  wrapper: (role) => ({
    display: 'flex',
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
    marginBottom: '6px',
    animation: 'fadeUp 0.2s ease',
  }),
  bubble: (role) => ({
    maxWidth: '78%',
    padding: '11px 15px',
    borderRadius: role === 'user'
      ? '18px 18px 4px 18px'
      : '18px 18px 18px 4px',
    background: role === 'user' ? 'var(--user-bubble)' : 'var(--ai-bubble)',
    border: role === 'user'
      ? '0.5px solid rgba(201,168,76,0.2)'
      : '0.5px solid var(--border)',
    fontSize: '14px',
    lineHeight: 1.65,
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }),
  avatar: {
    width: '28px', height: '28px',
    borderRadius: '50%',
    background: 'var(--gold-dim)',
    border: '0.5px solid var(--gold)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
    alignSelf: 'flex-end',
    marginRight: '8px',
    color: 'var(--gold)',
    fontWeight: 500,
  },
};

export default function Message({ role, content }) {
  return (
    <div style={styles.wrapper(role)}>
      {role === 'assistant' && <div style={styles.avatar}>P</div>}
      <div style={styles.bubble(role)}>{content}</div>
    </div>
  );
}
