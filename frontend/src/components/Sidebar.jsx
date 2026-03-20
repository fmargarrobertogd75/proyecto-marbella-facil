import { Home, User, Calendar, Award, Gift, Star, Settings, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ items, usuario }) {
  const location = useLocation();

  const iconMap = {
    Home, User, Calendar, Award, Gift, Star, Settings, BarChart3
  };

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      backgroundColor: '#0f172a',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 1rem 2rem',
      color: 'white',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Spacer para el navbar fijo */}
      <div style={{ height: '5rem', flexShrink: 0 }} />

      {/* Marca */}
      <div style={{ marginBottom: '1.75rem', paddingLeft: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif, serif)', fontWeight: 800, fontSize: '1.1rem', color: 'white', flexShrink: 0 }}>
            {usuario.nombre?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario.nombre}
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario.email}
            </p>
          </div>
        </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <nav>
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || User;
          const locationFull = location.pathname + location.search;
          const isActive = locationFull === item.path ||
            (item.activeWhen && locationFull.includes(item.activeWhen));

          return (
            <Link
              key={idx}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.65rem 0.875rem',
                marginBottom: '0.375rem',
                borderRadius: '0.625rem',
                backgroundColor: isActive ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: isActive ? '#f59e0b' : '#94a3b8',
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }
              }}
              onMouseLeave={(e) => {
                if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
