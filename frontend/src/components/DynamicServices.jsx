import React, { useEffect, useState } from 'react';
import { Globe, Mail, MapPin, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { negociosApi } from '../services/api';

const AVATAR_COLORS = ['#1e40af', '#065f46', '#7c2d12', '#4c1d95', '#9f1239', '#0f766e'];

const getInitials = (nombre = '') =>
  nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const DynamicServices = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    negociosApi.getAll({ per_page: 6, destacado: 1 })
      .then(res => {
        // La API devuelve paginación: { data: [...] } o array directo
        const items = res.data.data ?? res.data;
        setNegocios(items);
      })
      .catch(err => {
        console.error('Error al cargar negocios:', err);
        setError('No se pudieron cargar los negocios. Asegúrate de que Laravel esté ejecutándose en puerto 8000.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head center-text">
          <h2 className="section-title">
            Negocios <span style={{ color: 'var(--marbella-gold)' }}>Destacados</span>
          </h2>
          <p className="section-desc">Directorio de establecimientos y servicios locales de Marbella</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
            Cargando negocios desde la API…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#fef2f2', borderRadius: '1rem', color: '#b91c1c', border: '1px solid #fecaca' }}>
            <strong>⚠️ {error}</strong>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
              Ejecuta: <code>php artisan serve</code> en la carpeta <code>backend/</code>
            </p>
          </div>
        )}

        {!loading && !error && negocios.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-slate-400)' }}>
            No hay negocios aprobados todavía. Ejecuta los seeders con <code>php artisan db:seed</code>.
          </div>
        )}

        {!loading && !error && negocios.length > 0 && (
          <>
            <div className="grid-3">
              {negocios.map((n, i) => (
                <div key={n.id} className="collab-card">
                  {/* Imagen o avatar con iniciales */}
                  {n.imagen_principal ? (
                    <img
                      src={n.imagen_principal}
                      alt={n.nombre}
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="collab-avatar"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {getInitials(n.nombre)}
                    </div>
                  )}

                  <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '1rem' }}>
                    {n.nombre}
                  </h3>

                  {n.descripcion_es && (
                    <p style={{ color: 'var(--color-slate-500)', fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      {n.descripcion_es.length > 80
                        ? n.descripcion_es.slice(0, 80) + '…'
                        : n.descripcion_es}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--color-slate-500)', marginBottom: '0.5rem' }}>
                    {n.precio_medio && (
                      <span style={{ fontWeight: 700, color: 'var(--marbella-gold)' }}>
                        {n.precio_medio}
                      </span>
                    )}
                    {n.direccion && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={11} /> {n.direccion.split(',')[0]}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                    {n.email_contacto && (
                      <a href={`mailto:${n.email_contacto}`} style={{ color: 'var(--color-blue-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={12} /> Email
                      </a>
                    )}
                    {n.web && (
                      <a href={n.web} target="_blank" rel="noreferrer" style={{ color: 'var(--color-blue-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Globe size={12} /> Web
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/gastronomia" className="btn btn-outline">Ver directorio completo →</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DynamicServices;