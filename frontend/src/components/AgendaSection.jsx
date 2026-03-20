import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgendaSection = () => {
  return (
    <section className="section bg-gray">
      <div className="container">
        <div className="center-text" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">Próximos Eventos</h2>
          <p className="section-desc">No te pierdas nada de la agenda cultural de Marbella.</p>
        </div>

        <div className="event-card-featured">
          <div style={{ flex: '1', minWidth: '300px', minHeight: '350px' }}>
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
              alt="Starlite"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="fe-content">
            <div style={{ color: 'var(--color-amber-600)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              FESTIVAL DESTACADO
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1.2, color: 'var(--color-slate-900)' }}>
              Starlite Occident 2025
            </h3>
            <p style={{ color: 'var(--color-slate-500)', marginBottom: '2rem', lineHeight: 1.7 }}>
              El festival boutique más importante de Europa vuelve a la Cantera de Nagüeles con artistas internacionales.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-600)' }}>
                <Calendar size={16} color="var(--color-amber-500)" /> Julio — Agosto
              </span>
              <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-600)' }}>
                <MapPin size={16} color="var(--color-amber-500)" /> Cantera Nagüeles
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={16} /> Comprar Entradas
              </button>
              <Link to="/agenda" className="btn btn-outline">
                Ver Calendario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;