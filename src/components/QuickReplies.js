const chips = [
  'I want to buy a property',
  'I\'m looking to invest',
  'Help me find a rental',
  'What\'s my budget range?',
  'Best locations in Bangalore',
  'How does EMI work?',
];

export default function QuickReplies({ onSelect, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '8px',
      padding: '8px 0 4px',
      animation: 'fadeUp 0.3s ease',
    }}>
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--border2)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = 'var(--gold)';
            e.target.style.color = 'var(--gold)';
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'var(--border2)';
            e.target.style.color = 'var(--text-muted)';
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
