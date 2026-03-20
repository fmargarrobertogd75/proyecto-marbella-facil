import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Flag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BeachCard from './BeachCard';
import { playasApi } from '../services/api';

const FLAG_ICON = {
  'Verde': { icon: CheckCircle, color: '#10b981' },
  'Amarilla': { icon: AlertCircle, color: '#f59e0b' },
  'Roja': { icon: AlertCircle, color: '#ef4444' },
};

const BeachSection = () => {
  const [playas, setPlayas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playasApi.getAll()
      .then(res => setPlayas((res.data ?? []).slice(0, 3)))
      .catch(() => setPlayas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Estado de las Playas</h2>
          <p className="section-desc">
            Banderas, temperatura y ocupación en tiempo real.{' '}
            <Link to="/playas" className="link-arrow">Ver todas las playas →</Link>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-slate-400)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
            Cargando estado de playas…
          </div>
        ) : playas.length > 0 ? (
          <div className="grid-3">
            {playas.map(p => {
              const flagData = FLAG_ICON[p.bandera] || FLAG_ICON['Verde'];
              return (
                <BeachCard
                  key={p.id}
                  name={p.nombre}
                  img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
                  temp={p.temperatura_agua ? `${p.temperatura_agua}°C` : '--'}
                  occupancy={p.ocupacion || 'Desconocida'}
                  status={p.estado_mar || 'Tranquilo'}
                  icon={flagData.icon}
                  iconColor={flagData.color}
                />
              );
            })}
          </div>
        ) : (
          // Fallback estático si Laravel no responde
          <div className="grid-3">
            <BeachCard name="Playa de Nagüeles" img="/arc_19643_g.webp" temp="21°C" occupancy="Media" status="Limpio" icon={CheckCircle} iconColor="#10b981" />
            <BeachCard name="Nikki Beach" img="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800" temp="22°C" occupancy="Alta" status="Limpio" icon={CheckCircle} iconColor="#10b981" />
            <BeachCard name="Dunas de Cabopino" img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" temp="20.5°C" occupancy="Baja" status="Medusas" icon={AlertCircle} iconColor="#f87171" />
          </div>
        )}
      </div>
    </section>
  );
};

export default BeachSection;