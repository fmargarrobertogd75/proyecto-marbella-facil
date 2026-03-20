import { useState, useEffect } from 'react';
import { Award, Gift, Sparkles, Filter, TrendingUp, Lock, Star } from 'lucide-react';
import { recompensasApi, puntosApi } from '../services/api';

export default function RecompensasPage() {
  const [recompensas, setRecompensas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('marbella_usuario');
    if (stored) setUsuario(JSON.parse(stored));
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [recompensasRes, nivelesRes] = await Promise.all([
        recompensasApi.getAll(),
        puntosApi.getNiveles(),
      ]);
      setRecompensas(recompensasRes.data);
      setNiveles(nivelesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const toggleFiltro = (tipo) => {
    setFiltroTipo(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    );
  };

  const recompensasFiltradas = filtroTipo.length === 0
    ? recompensas
    : recompensas.filter(r => filtroTipo.includes(r.tipo));

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', marginBottom: '1rem', display: 'inline-flex' }}>
            <Sparkles size={14} /> &nbsp; Programa de Recompensas
          </div>
          <h1 className="section-title">Centro de Recompensas</h1>
          <p className="section-desc">
            Acumula puntos y canjéalos por experiencias exclusivas y descuentos en Marbella
          </p>

          {/* User Points Stats (si está logueado) */}
          {usuario && (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24' }}>{usuario.puntos || 0}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Tus Puntos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399' }}>{usuario.nivel || 'Básico'}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Tu Nivel</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#60a5fa' }}>
                  {niveles.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Niveles Totales</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="page-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              {/* Filtros */}
              <div className="filter-box">
                <h3><Filter size={16} /> Filtros</h3>
                <div className="checkbox-group">
                  <span className="filter-group-label">Tipo de Recompensa</span>
                  {['descuento', 'regalo', 'experiencia'].map(tipo => (
                    <label key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filtroTipo.includes(tipo)}
                        onChange={() => toggleFiltro(tipo)}
                      />
                      <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{tipo}</span>
                    </label>
                  ))}
                </div>
                {filtroTipo.length > 0 && (
                  <button
                    onClick={() => setFiltroTipo([])}
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--color-slate-200)',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      color: 'var(--color-slate-500)',
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Niveles Info */}
              <div className="filter-box" style={{ marginTop: '1rem' }}>
                <h3><TrendingUp size={16} /> Niveles</h3>
                {niveles.map(nivel => (
                  <div key={nivel.id} style={{ marginBottom: '0.875rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{nivel.icono}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{nivel.nombre}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-amber-600)', fontWeight: 600 }}>
                      {nivel.puntos_minimos}+ pts
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-400)', marginTop: '0.25rem' }}>
                      {nivel.descripcion_beneficios}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <div className="content-area">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
                  Cargando recompensas...
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Mostrando <strong>{recompensasFiltradas.length}</strong> recompensa{recompensasFiltradas.length !== 1 ? 's' : ''} {filtroTipo.length > 0 ? 'con filtros aplicados' : 'disponibles'}
                  </p>

                  <div className="grid-3">
                    {recompensasFiltradas.map(r => (
                      <RecompensaCard key={r.id} recompensa={r} usuario={usuario} />
                    ))}
                  </div>

                  {recompensasFiltradas.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)' }}>
                      No hay recompensas con los filtros seleccionados.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA para usuarios no logueados */}
      {!usuario && (
        <section className="section bg-gray">
          <div className="container center-text">
            <h2 className="section-title">¿Listo para empezar a ganar puntos?</h2>
            <p className="section-desc">Regístrate ahora y obtén 25 puntos de bienvenida</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Crear Cuenta
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── CARD COMPONENT ─────────────────────────────────────────────── */
const RecompensaCard = ({ recompensa, usuario }) => {
  const puedesCanjear = usuario && usuario.puntos >= recompensa.puntos_necesarios;
  const disponible = recompensa.disponible !== false;

  return (
    <div
      style={{
        borderRadius: '0.875rem',
        overflow: 'hidden',
        border: '1.5px solid var(--color-slate-200)',
        background: 'white',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        opacity: disponible ? 1 : 0.6,
      }}
      onMouseEnter={e => {
        if (disponible) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Header con icono */}
      <div style={{
        background: disponible
          ? 'linear-gradient(135deg, var(--color-amber-400) 0%, var(--color-amber-600) 100%)'
          : 'var(--color-slate-300)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {!disponible ? (
          <Lock color="white" size={48} />
        ) : (
          <Gift color="white" size={48} />
        )}
        {/* Badge tipo */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'rgba(255,255,255,0.25)',
          padding: '0.3rem 0.7rem',
          borderRadius: '999px',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {recompensa.tipo}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
          {recompensa.titulo}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', lineHeight: 1.5, marginBottom: 'auto' }}>
          {recompensa.descripcion}
        </p>

        {/* Footer con puntos */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-slate-100)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--color-amber-600)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-amber-600)' }}>
              {recompensa.puntos_necesarios}
            </span>
          </div>

          {!disponible ? (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#dc2626',
              background: '#fee2e2',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
            }}>
              Agotado
            </span>
          ) : puedesCanjear ? (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#059669',
              background: '#d1fae5',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
            }}>
              ✓ Disponible
            </span>
          ) : null}
        </div>

        {/* Stock */}
        {recompensa.stock !== null && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
            📦 Stock: {recompensa.stock}
          </div>
        )}
      </div>
    </div>
  );
};
