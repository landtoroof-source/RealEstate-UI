const dotStyle = (delay) => ({
  width: '6px', height: '6px',
  borderRadius: '50%',
  background: 'var(--gold)',
  animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
});

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '6px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'var(--gold-dim)', border: '0.5px solid var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', color: 'var(--gold)', fontWeight: 500, flexShrink: 0,
      }}>P</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: 'var(--ai-bubble)',
        border: '0.5px solid var(--border)',
        borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px',
      }}>
        <div style={dotStyle(0)} />
        <div style={dotStyle(0.2)} />
        <div style={dotStyle(0.4)} />
      </div>
    </div>
  );
}
