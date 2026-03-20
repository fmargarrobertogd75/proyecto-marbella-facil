import { useState, useEffect } from 'react';
import { Star, Thermometer, Users, Wind, Zap, MapPin } from 'lucide-react';
import { playasApi } from '../services/api';

export default function PlayasComparador() {
  const [playas, setPlayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferencias, setPreferencias] = useState({
    temperatura: 'media',
    ocupacion: 'baja',
    aktividad: 'relajacion',
  });
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    cargarPlayas();
  }, []);

  const cargarPlayas = async () => {
    try {
      const res = await playasApi.getAll();
      setPlayas(res.data.slice(0, 6)); // Limitamos a 6
      setLoading(false);
    } catch (error) {
      console.error('Error cargando playas:', error);
      setLoading(false);
    }
  };

  const calcularPuntuacion = (playa, prefs) => {
    let puntos = 0;

    // Temperatura: +30 si coincide con preferencia
    if (prefs.temperatura === 'calida' && playa.temperatura_agua > 22) puntos += 30;
    if (prefs.temperatura === 'media' && (playa.temperatura_agua > 18 && playa.temperatura_agua <= 22)) puntos += 30;
    if (prefs.temperatura === 'fria' && playa.temperatura_agua <= 18) puntos += 30;

    // Ocupación: +40 si coincide
    const mapOcupacion = { baja: 'Baja', media: 'Media', alta: 'Alta' };
    if (playa.ocupacion === mapOcupacion[prefs.ocupacion]) puntos += 40;

    // Bandera verde (buenas condiciones)
    if (playa.bandera === 'Verde') puntos += 30;

    return Math.min(puntos, 100);
  };

  const playasRecomendadas = playas
    .map(p => ({ ...p, puntuacion: calcularPuntuacion(p, preferencias) }))
    .sort((a, b) => b.puntuacion - a.puntuacion);

  const toggleSeleccionar = (playa) => {
    setSeleccionadas(prev =>
      prev.find(p => p.id === playa.id)
        ? prev.filter(p => p.id !== playa.id)
        : [...prev, playa]
    );
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando playas...</div>;
  }

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: 'var(--color-slate-50)',
      borderTop: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: 'var(--color-slate-900)',
          }}>
            🏖️ Comparador de Playas
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate-500)', maxWidth: '500px', margin: '0 auto' }}>
            Encuentra la playa perfecta según tus preferencias
          </p>
        </div>

        {/* Filtros de Preferencias */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-slate-200)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* Temperatura */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--color-slate-900)',
              }}>
                <Thermometer size={18} color="var(--color-amber-600)" />
                Temperatura
              </label>
              <select
                value={preferencias.temperatura}
                onChange={(e) => setPreferencias({ ...preferencias, temperatura: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                }}
              >
                <option value="fria">Fría (&lt;18°C)</option>
                <option value="media">Media (18-22°C)</option>
                <option value="calida">Cálida (&gt;22°C)</option>
              </select>
            </div>

            {/* Ocupación */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--color-slate-900)',
              }}>
                <Users size={18} color="var(--color-blue-500)" />
                Ocupación
              </label>
              <select
                value={preferencias.ocupacion}
                onChange={(e) => setPreferencias({ ...preferencias, ocupacion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                }}
              >
                <option value="baja">Baja (tranquilo)</option>
                <option value="media">Media (normal)</option>
                <option value="alta">Alta (concurrido)</option>
              </select>
            </div>

            {/* Actividad */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--color-slate-900)',
              }}>
                <Zap size={18} color="var(--color-emerald-500)" />
                Tipo
              </label>
              <select
                value={preferencias.aktividad}
                onChange={(e) => setPreferencias({ ...preferencias, aktividad: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                }}
              >
                <option value="relajacion">Relajación</option>
                <option value="deportes">Deportes acuáticos</option>
                <option value="familia">Familia</option>
                <option value="aventura">Aventura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Playas Recomendadas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {playasRecomendadas.map((playa, idx) => {
            const isSelected = seleccionadas.find(p => p.id === playa.id);
            return (
              <div
                key={playa.id}
                onClick={() => toggleSeleccionar(playa)}
                style={{
                  backgroundColor: isSelected ? 'var(--color-amber-50)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  border: isSelected ? '2px solid var(--color-amber-500)' : '2px solid var(--color-slate-200)',
                  boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-amber-400)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-slate-200)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {/* Ranking */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--color-amber-500)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 1rem',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                }}>
                  #{idx + 1}
                </div>

                {/* Puntuación */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  {/* Estrellas */}
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < Math.round(playa.puntuacion / 20) ? 'var(--color-amber-500)' : 'var(--color-slate-300)'}
                        fill={i < Math.round(playa.puntuacion / 20) ? 'var(--color-amber-500)' : 'none'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-slate-700)' }}>
                    {Math.round(playa.puntuacion)}%
                  </span>
                </div>

                {/* Nombre */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                  {playa.nombre}
                </h3>

                {/* Municipio */}
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} /> {playa.municipio}
                </p>

                {/* Estadísticas */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-slate-200)',
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Temperatura
                    </p>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-amber-600)' }}>
                      {playa.temperatura_agua ? `${playa.temperatura_agua}°C` : '--'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Ocupación
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-blue-600)' }}>
                      {playa.ocupacion}
                    </p>
                  </div>
                </div>

                {/* Bandera */}
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: playa.bandera === 'Verde' ? 'var(--color-emerald-100)' : 'var(--color-amber-100)',
                  border: `1px solid ${playa.bandera === 'Verde' ? 'var(--color-emerald-300)' : 'var(--color-amber-300)'}`,
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: playa.bandera === 'Verde' ? 'var(--color-emerald-800)' : 'var(--color-amber-800)',
                }}>
                  🚩 Bandera: {playa.bandera}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de Seleccionadas */}
        {seleccionadas.length > 0 && (
          <div style={{
            backgroundColor: 'var(--color-blue-50)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            border: '2px solid var(--color-blue-300)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-blue-900)' }}>
              ✓ Has seleccionado <span style={{ color: 'var(--color-amber-600)' }}>{seleccionadas.length} playa{seleccionadas.length !== 1 ? 's' : ''}</span> para comparar
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-blue-800)', marginTop: '0.5rem' }}>
              {seleccionadas.map(p => p.nombre).join(', ')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
