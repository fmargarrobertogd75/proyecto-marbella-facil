export default function TabsContainer({ tabs, activeTab, onTabChange }) {
  return (
    <div style={{
      borderBottom: '2px solid #e2e8f0',
      marginBottom: '2rem',
    }}>
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? '#f59e0b' : '#64748b',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2.5px solid #f59e0b' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
              letterSpacing: activeTab === tab.id ? '0.01em' : 0,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) e.target.style.color = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) e.target.style.color = '#64748b';
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
