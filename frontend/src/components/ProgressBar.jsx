export default function ProgressBar({ current, max, label, color = '#3b82f6' }) {
  const percentage = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
        }}>
          <span style={{ color: '#475569' }}>{label}</span>
          <span style={{ fontWeight: 'bold', color: '#0f172a' }}>
            {current} / {max}
          </span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: '0.75rem',
        backgroundColor: '#e2e8f0',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '9999px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}
