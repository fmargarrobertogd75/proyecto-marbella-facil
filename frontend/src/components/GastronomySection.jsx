import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Star, MapPin } from 'lucide-react';

const FEATURED_RESTAURANTS = [
  {
    name: 'Lobito de Mar',
    zone: 'Milla de Oro',
    cuisine: 'Mediterránea',
    price: '€€€',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
    rating: 4.8,
  },
  {
    name: 'Da Bruno',
    zone: 'Paseo Marítimo',
    cuisine: 'Italiana',
    price: '€€',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    rating: 4.6,
  },
  {
    name: 'El Lago',
    zone: 'Elviria',
    cuisine: 'Estrella Michelin',
    price: '€€€€',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    rating: 4.9,
  },
];

const GastronomySection = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-amber-600)', marginBottom: '1rem' }}>
              <UtensilsCrossed size={14} /> Gastronomía Selecta
            </div>
            <h2 className="section-title">Los mejores sabores<br />de Marbella</h2>
            <p className="section-desc">
              Desde chiringuitos en la playa hasta restaurantes con estrella Michelin.
            </p>
          </div>
          <Link to="/gastronomia" className="btn btn-dark">
            Ver directorio completo →
          </Link>
        </div>

        <div className="grid-3">
          {FEATURED_RESTAURANTS.map((rest) => (
            <Link to="/gastronomia" key={rest.name} className="restaurant-card" style={{ textDecoration: 'none' }}>
              <div className="rest-img-box">
                <img src={rest.img} alt={rest.name} className="rest-img" />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(15,23,42,0.75)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {rest.cuisine}
                </span>
              </div>
              <div className="rest-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-slate-900)' }}>{rest.name}</h3>
                  <span style={{ color: 'var(--color-amber-500)', fontWeight: 700, fontSize: '0.9rem' }}>{rest.price}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-slate-500)', fontSize: '0.85rem' }}>
                    <MapPin size={13} /> {rest.zone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-slate-700)' }}>
                    <Star size={13} fill="currentColor" color="var(--color-amber-400)" /> {rest.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GastronomySection;