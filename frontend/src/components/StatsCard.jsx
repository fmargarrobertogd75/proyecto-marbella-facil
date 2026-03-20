export default function StatsCard({ icon: Icon, title, value, description, color = '#3b82f6' }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '0.5rem',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '1rem',
        }}>
          {Icon && <Icon size={24} color={color} />}
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>
            {value}
          </p>
        </div>
      </div>
      {description && (
        <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
          {description}
        </p>
      )}
    </div>
  );
}
