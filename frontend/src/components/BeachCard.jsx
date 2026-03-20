import React from 'react';
import { Flag, Thermometer, User } from 'lucide-react';

const BeachCard = ({ name, img, temp, occupancy, status, icon: Icon, iconColor, desc, stats, flagColor, isDetailed }) => (
  <div className="card-playa">
    <img src={img} alt={name} />
    <div className="card-gradient"></div>
    <div className="flag-icon" style={{ background: flagColor || 'rgba(255,255,255,0.2)', color: flagColor ? 'white' : (name.includes('Nikki') ? '#fbbf24' : '#10b981') }}>
      <Flag fill="currentColor" size={16} />
    </div>
    
    <div className="card-info">
      {/* Cabecera de la tarjeta */}
      <div style={{ display: 'flex', justifySelf: 'space-between', alignItems: 'flex-start', marginBottom: isDetailed ? '0.5rem' : '1.5rem', width: '100%' }}>
        <h3 className="card-name" style={{ margin: 0, fontSize: isDetailed ? '1.5rem' : '1.75rem' }}>{name}</h3>
        {isDetailed && <span style={{ color: 'var(--color-amber-400)', fontWeight: 700, fontSize: '1.25rem', marginLeft: 'auto' }}>{temp}</span>}
      </div>

      {isDetailed && <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>{desc}</p>}

      <div className="stats-row" style={{ borderTop: isDetailed ? '1px solid rgba(255,255,255,0.2)' : 'none', paddingTop: isDetailed ? '1rem' : '0' }}>
        {/* Renderizado para la HOME (Versión Simple) */}
        {!isDetailed && (
          <>
            <div className="stat-item"><Thermometer color="#fbbf24" size={18} /><span className="stat-val">{temp}</span></div>
            <div className="stat-item"><User color="#60a5fa" size={18} /><span className="stat-val">{occupancy}</span></div>
            <div className="stat-item">{Icon && <Icon color={iconColor} size={18} />}<span className="stat-val">{status}</span></div>
          </>
        )}

        {/* Renderizado para la Página de Playas (Versión Detallada) */}
        {isDetailed && stats && stats.map((item, i) => (
          <div key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignSelf: 'center', gap: '0.25rem' }}>
            <item.icon width={14} /> {item.text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BeachCard;