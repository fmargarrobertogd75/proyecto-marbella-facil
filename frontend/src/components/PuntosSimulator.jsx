import { useState } from 'react';
import { Calculator, TrendingUp, Award } from 'lucide-react';

export default function PuntosSimulator() {
  const [actividad, setActividad] = useState('reserva');
  const [cantidad, setCantidad] = useState(1);
  const [puntosEstimados, setPuntosEstimados] = useState(0);

  const actividades = {
    reserva: { titulo: 'Reserva de Hotel', puntosPorUnidad: 10, unidad: 'noche' },
    restaurante: { titulo: 'Cena en Restaurante', puntosPorUnidad: 5, unidad: 'comida' },
    playa: { titulo: 'Acceso a Playa Premium', puntosPorUnidad: 3, unidad: 'día' },
    tour: { titulo: 'Tour Guiado', puntosPorUnidad: 15, unidad: 'persona' },
    compra: { titulo: 'Compras', puntosPorUnidad: 1, unidad: 'euro' },
  };

  const actualizarPuntos = (value) => {
    setCantidad(value);
    const puntos = value * actividades[actividad].puntosPorUnidad;
    setPuntosEstimados(puntos);
  };

  return (
    <section style={{
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, var(--color-blue-100) 0%, var(--color-slate-50) 100%)',
      borderTop: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Calculator size={40} color="var(--color-blue-500)" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.2rem)', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
            Calculadora de Puntos
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate-500)' }}>
            Descubre cuántos puntos puedes ganar con tus actividades
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-slate-200)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {/* Selector de Actividad */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--color-slate-900)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Tipo de Actividad
              </label>
              <select
                value={actividad}
                onChange={(e) => {
                  setActividad(e.target.value);
                  actualizarPuntos(cantidad);
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  color: 'var(--color-slate-900)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-blue-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-slate-200)'}
              >
                {Object.entries(actividades).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.titulo} • +{val.puntosPorUnidad} pts/{val.unidad}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--color-slate-900)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Cantidad ({actividades[actividad].unidad})
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={cantidad}
                onChange={(e) => actualizarPuntos(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  color: 'var(--color-amber-600)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-blue-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-slate-200)'}
              />
            </div>

            {/* Resultado */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-amber-50) 100%)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              border: '2px solid var(--color-amber-300)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} color="var(--color-amber-600)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-amber-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Puntos
                </span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-amber-600)' }}>
                +{puntosEstimados}
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-blue-50)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-blue-200)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            <TrendingUp size={20} color="var(--color-blue-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-blue-900)', fontWeight: '700', marginBottom: '0.5rem' }}>
                💡 Tip de Puntos
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-blue-700)', lineHeight: '1.5' }}>
                Los puntos se acumulan automáticamente en tu cuenta. Recuerda que cada actividad diferente ofrece diferentes recompensas. ¡Sigue activo y desbloquea más beneficios!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
