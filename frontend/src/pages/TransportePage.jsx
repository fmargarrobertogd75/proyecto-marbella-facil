import React, { useState } from 'react';
import { Bus, CreditCard, Clock, MapPin, Search } from 'lucide-react';

/* ─── Líneas oficiales del Consorcio de Transporte Metropolitano del Área de Málaga ─── */
const BUS_LINES = [
  { num: '1', label: 'Línea 1', route: 'C.C. La Cañada – Puerto Banús', color: '#06b6d4', night: false },
  { num: '2', label: 'Línea 2', route: 'C.C. La Cañada – El Mirador', color: '#9333ea', night: false },
  { num: '3', label: 'Línea 3', route: 'C.C. La Cañada – El Ángel', color: '#65a30d', night: false },
  { num: '4', label: 'Línea 4', route: 'Puerto Banús – San Pedro', color: '#ec4899', night: false },
  { num: '5', label: 'Línea 5', route: 'Puerto Banús – San Pedro – El Saito', color: '#16a34a', night: false },
  { num: '6', label: 'Línea 6', route: 'Cabopino – C.C. La Cañada', color: '#d97706', night: false },
  { num: '6B', label: 'Línea 6B', route: 'Bello Horizonte – C.C. La Cañada', color: '#7c3aed', night: false },
  { num: '7', label: 'Línea 7', route: 'San Pedro – Centro de Salud (Circular)', color: '#2563eb', night: false },
  { num: '8', label: 'Línea 8', route: 'C.C. La Cañada – San Pedro (Nocturno)', color: '#64748b', night: true },
  { num: '9', label: 'Línea 9', route: 'Cabopino – Marbella Centro (Nocturno)', color: '#dc2626', night: true },
  { num: '10', label: 'Línea 10', route: 'Marbella Centro – Starlite Occident', color: '#7e22ce', night: false },
  { num: '12', label: 'Línea 12', route: 'Hospital Costa del Sol – Nueva Andalucía', color: '#ca8a04', night: false },
  { num: '13', label: 'Línea 13', route: 'Hospital Costa del Sol – San Pedro', color: '#0d9488', night: false },
];

const TARIFFS = [
  { label: 'Billete sencillo', price: '1,30 €', note: '' },
  { label: 'Bono Bus (10 viajes)', price: '8,50 €', note: '0,85 €/viaje' },
  { label: 'Bono mensual', price: '25,00 €', note: '' },
  { label: 'Bono mensual joven', price: '15,00 €', note: 'Hasta 25 años' },
  { label: 'Bono estudiante', price: '12,00 €', note: 'Con acreditación' },
  { label: 'Mayores de 65 años', price: 'GRATIS', note: 'Con DNI/NIE' },
];

const LineCard = ({ num, label, route, color, night }) => (
  <div
    style={{
      borderRadius: '0.875rem',
      overflow: 'hidden',
      border: '1.5px solid var(--color-slate-200)',
      background: 'white',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${color}35`; e.currentTarget.style.borderColor = color; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--color-slate-200)'; }}
  >
    {/* Header coloreado */}
    <div
      style={{
        background: color,
        padding: '0.875rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ color: 'white', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.02em' }}>
        {label}
      </span>
      {night && (
        <span style={{ background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', letterSpacing: '0.05em' }}>
          NOCTURNO
        </span>
      )}
    </div>
    {/* Ruta */}
    <div style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <MapPin size={13} style={{ color: color, flexShrink: 0, marginTop: '2px' }} />
      <span style={{ fontSize: '0.82rem', color: 'var(--color-slate-600)', lineHeight: 1.45 }}>{route}</span>
    </div>
  </div>
);

const TransportePage = () => {
  const [search, setSearch] = useState('');
  const [filterNight, setFilterNight] = useState(false);

  const filtered = BUS_LINES.filter(l => {
    const matchSearch = l.route.toLowerCase().includes(search.toLowerCase()) || l.num.includes(search);
    const matchNight = !filterNight || l.night;
    return matchSearch && matchNight;
  });

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', marginBottom: '1rem', display: 'inline-flex' }}>
            <Bus size={14} /> &nbsp; Consorcio de Transporte Marbella
          </div>
          <h1 className="section-title" style={{ color: 'white' }}>Red de Transporte Urbano</h1>
          <p className="section-desc" style={{ color: 'rgba(255,255,255,0.65)' }}>
            13 líneas oficiales — Horarios, tarifas y paradas en tiempo real.
          </p>

          {/* Buscador inline en hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.5rem 1.5rem', maxWidth: '400px', margin: '2rem auto 0' }}>
            <Search size={15} color="rgba(255,255,255,0.55)" />
            <input
              type="text"
              placeholder="Busca línea o destino…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.9rem', width: '100%', fontFamily: 'var(--font-sans)' }}
            />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* Controles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bus color="var(--marbella-gold)" size={22} />
                Todas las Líneas
              </h2>
              <p style={{ color: 'var(--color-slate-500)', fontSize: '0.85rem' }}>
                {filtered.length} de {BUS_LINES.length} líneas mostradas
              </p>
            </div>
            <button
              onClick={() => setFilterNight(!filterNight)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: '1.5px solid',
                borderColor: filterNight ? 'var(--color-slate-900)' : 'var(--color-slate-300)',
                background: filterNight ? 'var(--color-slate-900)' : 'transparent',
                color: filterNight ? 'white' : 'var(--color-slate-600)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              🌙 Solo nocturnas
            </button>
          </div>

          {/* Cuadrícula de líneas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
            {filtered.map(line => <LineCard key={line.num} {...line} />)}
          </div>

          {/* Tarifas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CreditCard color="var(--marbella-gold)" size={22} />
                Tarifas 2025
              </h2>
              <div className="tariffs-card" style={{ maxWidth: '540px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  Operado por Avanza Movilidad · Precios vigentes para 2025
                </p>
                {TARIFFS.map(t => (
                  <div key={t.label} className="tariff-row">
                    <div>
                      <span style={{ display: 'block' }}>{t.label}</span>
                      {t.note && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{t.note}</span>}
                    </div>
                    <span className="tariff-price">{t.price}</span>
                  </div>
                ))}
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
                  * Los bonos requieren tarjeta inteligente de transporte. Disponible en oficinas Avanza o en el propio autobús.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default TransportePage;