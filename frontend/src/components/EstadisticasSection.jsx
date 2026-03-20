import { useState, useEffect } from 'react';
import { TrendingUp, Eye, MapPin, Star, Clock, Award } from 'lucide-react';

export default function EstadisticasSection() {
  const [stats, setStats] = useState({
    visitasHoy: Math.floor(Math.random() * 500 + 100),
    lungaresVistos: Math.floor(Math.random() * 30 + 5),
    puntosGanados: Math.floor(Math.random() * 200 + 50),
    resenas: Math.floor(Math.random() * 15 + 2),
  });

  const [animacion, setAnimacion] = useState(false);

  useEffect(() => {
    setAnimacion(true);
  }, []);

  const statItems = [
    { icono: Eye, label: 'Visitas hoy', valor: stats.visitasHoy, color: 'blue', unidad: 'vistas' },
    { icono: MapPin, label: 'Lugares vistos', valor: stats.lungaresVistos, color: 'emerald', unidad: 'lugares' },
    { icono: Award, label: 'Puntos ganados', valor: stats.puntosGanados, color: 'amber', unidad: 'pts' },
    { icono: Star, label: 'Reseñas dejadas', valor: stats.resenas, color: 'purple', unidad: 'reseñas' },
  ];

  const colorMap = {
    blue: { bg: 'var(--color-blue-100)', text: 'var(--color-blue-600)', border: 'var(--color-blue-300)' },
    emerald: { bg: 'var(--color-emerald-100)', text: 'var(--color-emerald-600)', border: 'var(--color-emerald-300)' },
    amber: { bg: 'var(--color-amber-100)', text: 'var(--color-amber-600)', border: 'var(--color-amber-300)' },
    purple: { bg: 'var(--color-purple-100)', text: 'var(--color-purple-600)', border: 'var(--color-purple-300)' },
  };

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
      borderBottom: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <TrendingUp size={40} color="var(--color-amber-600)" />
          </div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: 'var(--color-slate-900)',
          }}>
            Tu Actividad en Marbella Fácil
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate-500)', maxWidth: '500px', margin: '0 auto' }}>
            Sigue tu progreso y logros en la plataforma
          </p>
        </div>

        {/* Grid de Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {statItems.map((item, idx) => {
            const Icon = item.icono;
            const colors = colorMap[item.color];
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  border: `2px solid ${colors.border}`,
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.4s ease',
                  transform: animacion ? `translateY(0) scale(1)` : `translateY(20px) scale(0.95)`,
                  opacity: animacion ? 1 : 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Header con icono */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: 'var(--color-slate-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    flex: 1,
                  }}>
                    {item.label}
                  </h3>
                  <div style={{
                    backgroundColor: colors.bg,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} color={colors.text} />
                  </div>
                </div>

                {/* Valor principal */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '800',
                    color: colors.text,
                    lineHeight: 1,
                  }}>
                    {item.valor}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginTop: '0.5rem' }}>
                    {item.unidad} esta semana
                  </p>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '6px',
                  backgroundColor: colors.bg,
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginTop: 'auto',
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: colors.text,
                    borderRadius: '999px',
                    width: `${Math.min((item.valor / 500) * 100, 100)}%`,
                    transition: 'width 1s ease 0.3s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-slate-200)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                fontSize: '1.5rem',
                minWidth: '40px',
              }}>
                🎯
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem', color: 'var(--color-slate-900)' }}>
                  Reto Semanal
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                  Visita 3 nuevos lugares esta semana y gana 50 puntos extra
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                fontSize: '1.5rem',
                minWidth: '40px',
              }}>
                ⭐
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem', color: 'var(--color-slate-900)' }}>
                  Deja Reseñas
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                  Comparte tu experiencia y ayuda a otros viajeros
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                fontSize: '1.5rem',
                minWidth: '40px',
              }}>
                🏆
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem', color: 'var(--color-slate-900)' }}>
                  Logro Desbloqueado
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                  ¡Explorador! Has visitado 10+ lugares 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
