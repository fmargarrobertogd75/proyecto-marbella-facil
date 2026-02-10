import React from 'react';
import { Navigation, MapPin, Clock } from 'lucide-react';

const TransportSection = () => {
  return (
    <section className="section bg-dark-section">
      <div className="container transport-layout">
        <div className="transport-text">
          <div className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', marginBottom: '1.5rem' }}>
            <Navigation size={14} /> &nbsp; MOVILIDAD URBANA
          </div>
          <h2 className="section-title">
            Líneas y Horarios <br />
            <span style={{ color: 'var(--marbella-gold)' }}>Oficiales</span>
          </h2>          <p className="section-desc">Consulta las rutas principales y la frecuencia estimada de paso de los autobuses urbanos de Marbella.</p>
          <a href="transporte.html" className="btn btn-primary" style={{ marginTop: '1.5rem', borderRadius: '0.5rem' }}>
            <MapPin size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Ver Todas las Líneas
          </a>
        </div>

        <div className="transport-card-main" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="tc-header" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'white' }}><Clock color="#f59e0b" size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Próximas Salidas</span>
            <a href="transporte.html" style={{ color: 'var(--color-amber-500)', fontSize: '0.8rem' }}>Ver todas →</a>
          </div>
          <div className="tc-lines">
            <div className="tc-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="line-icon l1">L1</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'white' }}>Centro - Puerto Banús</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>Lun - Dom</span>
                </div>
              </div>
              <span style={{ color: 'var(--color-amber-500)', fontWeight: 700 }}>Cada 15 min</span>
            </div>
            <div className="tc-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="line-icon l2" style={{ background: '#047857' }}>L2</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'white' }}>La Cañada - Estación</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>Lun - Dom</span>
                </div>
              </div>
              <span style={{ color: 'var(--color-amber-500)', fontWeight: 700 }}>Cada 20 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;