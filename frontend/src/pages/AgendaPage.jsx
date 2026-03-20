import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, Music, Palette, Star, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { eventosApi } from '../services/api';

const FEATURED_EVENT = {
  title: 'Starlite Occident Festival',
  dates: '15 Julio — 20 Agosto 2025',
  location: 'Cantera de Nagüeles',
  desc: 'El festival boutique más importante de Europa vuelve a la Cantera de Nagüeles con artistas internacionales de primer nivel.',
  img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=900&q=80',
  tag: 'Festival Destacado',
};

const EVENTS = [
  { day: '05', month: 'Dic', title: 'Encendido del Alumbrado Navideño', location: 'Av. Ricardo Soriano y Casco Antiguo', icon: Star, tag: 'Tradición' },
  { day: '12', month: 'Dic', title: 'Mercadillo de Artesanía Navideña', location: 'Plaza de los Naranjos', icon: Palette, tag: 'Mercado' },
  { day: '19', month: 'Dic', title: 'Concierto de Año Nuevo Orquesta', location: 'Palacio de Congresos, Marbella', icon: Music, tag: 'Música' },
  { day: '28', month: 'Dic', title: 'Nochevieja en Puerto Banús', location: 'Puerto Banús — Zona VIP', icon: Star, tag: 'Evento' },
  { day: '05', month: 'Ene', title: 'Cabalgata de Reyes Magos', location: 'Recorre el casco antiguo de Marbella', icon: Star, tag: 'Tradición' },
  { day: '15', month: 'Feb', title: 'Carnaval de Marbella 2026', location: 'Centro histórico', icon: Music, tag: 'Festival' },
];

const AgendaPage = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [apiEvents, setApiEvents] = useState([]);
  const CATS = ['Todos', 'Festival', 'Música', 'Tradición', 'Mercado', 'Evento'];

  useEffect(() => {
    eventosApi.getAll({ proximos: 1 })
      .then(res => setApiEvents(res.data))
      .catch(() => { }); // silencioso si la API no está disponible
  }, []);

  const allEvents = [
    ...EVENTS,
    ...apiEvents.map(e => ({
      day: new Date(e.fecha_inicio).getDate().toString().padStart(2, '0'),
      month: new Date(e.fecha_inicio).toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
      title: e.titulo_es,
      location: e.ubicacion || 'Marbella',
      icon: Star,
      tag: 'Evento',
    }))
  ];

  const filtered = activeCategory === 'Todos'
    ? allEvents
    : allEvents.filter(e => e.tag === activeCategory);

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-amber-400)', marginBottom: '1rem', display: 'inline-flex' }}>
            <Calendar size={14} /> &nbsp; Agenda Cultural
          </div>
          <h1 className="section-title">Eventos en Marbella</h1>
          <p className="section-desc">Conciertos, festivales y eventos locales que no te puedes perder.</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* Evento Destacado */}
          <div className="featured-event" style={{ marginBottom: '3rem' }}>
            <div className="fe-img-container">
              <img src={FEATURED_EVENT.img} className="fe-img" alt={FEATURED_EVENT.title} />
              <span className="badge" style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--color-amber-500)', color: 'white' }}>
                {FEATURED_EVENT.tag}
              </span>
            </div>
            <div className="fe-content">
              <div style={{ color: 'var(--color-amber-600)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
                <Calendar size={14} /> {FEATURED_EVENT.dates}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2, color: 'var(--color-slate-900)' }}>
                {FEATURED_EVENT.title}
              </h2>
              <p style={{ color: 'var(--color-slate-500)', marginBottom: '0.75rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {FEATURED_EVENT.desc}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-slate-400)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                <MapPin size={14} /> {FEATURED_EVENT.location}
              </p>
              <button className="btn btn-dark" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={16} /> Comprar Entradas
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="filter-scroll" style={{ marginBottom: '2rem' }}>
            {CATS.map(c => (
              <button key={c} className={`filter-pill ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
                {c}
              </button>
            ))}
          </div>

          {/* Lista de eventos */}
          <div>
            {filtered.map((ev, i) => (
              <div key={i} className="event-row" style={{ cursor: 'pointer' }}>
                <div className="date-box">
                  <span className="date-num">{ev.day}</span>
                  <span className="date-month">{ev.month}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)', fontSize: '0.65rem' }}>
                      {ev.tag}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', color: 'var(--color-slate-900)' }}>
                    {ev.title}
                  </h3>
                  <p style={{ color: 'var(--color-slate-500)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> {ev.location}
                  </p>
                </div>
                <ChevronRight size={18} color="var(--color-slate-300)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default AgendaPage;