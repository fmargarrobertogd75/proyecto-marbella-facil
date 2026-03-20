import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Clock, ArrowRight } from 'lucide-react';

/* Líneas oficiales del Consorcio de Transporte de Marbella */
const BUS_LINES = [
  { num: '1', route: 'C.C. La Cañada – Puerto Banús', color: '#06b6d4', freq: '15 min' },
  { num: '2', route: 'C.C. La Cañada – El Mirador', color: '#9333ea', freq: '20 min' },
  { num: '3', route: 'C.C. La Cañada – El Ángel', color: '#65a30d', freq: '25 min' },
  { num: '4', route: 'Puerto Banús – San Pedro', color: '#ec4899', freq: '30 min' },
];

const TransportSection = () => {
  return (
    <section className="section bg-dark-section">
      <div className="container transport-layout">
        {/* Texto izquierdo */}
        <div className="transport-text">
          <div className="badge" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd', marginBottom: '1.5rem' }}>
            <Navigation size={14} /> &nbsp; MOVILIDAD URBANA
          </div>
          <h2 className="section-title">
            Líneas y Horarios <br />
            <span style={{ color: 'var(--marbella-gold)' }}>del Consorcio</span>
          </h2>
          <p className="section-desc" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Consulta las rutas principales y la frecuencia estimada de los
            autobuses urbanos de Marbella en tiempo real.
          </p>
          <Link
            to="/transporte"
            className="btn btn-gold"
            style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Ver las 13 líneas <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tarjeta de líneas */}
        <div className="transport-card-main">
          <div className="tc-header">
            <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Clock color="var(--marbella-gold)" size={15} />
              Próximas Salidas — Líneas principales
            </span>
            <Link to="/transporte" style={{ color: 'var(--marbella-gold)', fontSize: '0.78rem', fontWeight: 700 }}>
              Ver todas →
            </Link>
          </div>

          {BUS_LINES.map((line) => (
            <div key={line.num} className="tc-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.6rem',
                    background: line.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '1rem',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${line.color}55`,
                  }}
                >
                  {line.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', lineHeight: 1.3 }}>
                    Línea {line.num}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                    {line.route}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--marbella-gold)', fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>
                  cada {line.freq}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportSection;