import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const AgendaSection = () => {
  return (
    <section className="section bg-gray">
      <div className="container">
        <div className="center-text" style={{marginBottom: '4rem'}}>
          <h2 className="section-title">Próximos Eventos</h2>
          <p className="section-desc">No te pierdas nada de la agenda cultural de Marbella.</p>
        </div>

        <div className="event-card-featured" style={{background: 'white', display: 'flex', flexWrap: 'wrap', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <div style={{flex: '1', minWidth: '300px', minHeight: '350px'}}>
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800" 
              alt="Starlite" 
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </div>
          <div style={{flex: '1.2', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{color: 'var(--color-amber-600)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem'}}>FESTIVAL DESTACADO</div>
            <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem'}}>Starlite Occident 2025</h3>
            <p style={{color: 'var(--color-slate-500)', marginBottom: '2rem'}}>El festival boutique más importante de Europa vuelve a la Cantera de Nagüeles con artistas internacionales.</p>
            <div style={{display: 'flex', gap: '2rem', marginBottom: '2.5rem'}}>
              <span style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Calendar size={18} color="#f59e0b" /> Julio - Agosto</span>
              <span style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={18} color="#f59e0b" /> Cantera Nagüeles</span>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <a href="#" className="btn btn-dark" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}><Ticket size={18} /> Comprar Entradas</a>
              <a href="#" className="btn btn-outline">Ver Calendario</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;