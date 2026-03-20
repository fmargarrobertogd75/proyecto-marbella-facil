import { useState } from 'react';
import { Clock, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function HorariosManager({ horarios: initialHorarios = [], onSave }) {
  const [horarios, setHorarios] = useState(initialHorarios);
  const [editando, setEditando] = useState(null);
  const [nuevoHorario, setNuevoHorario] = useState({
    dia_semana: 'lunes',
    hora_inicio: '',
    hora_fin: '',
    capacidad_max: 10,
  });
  const [mostrandoForm, setMostrandoForm] = useState(false);

  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  const agregarHorario = () => {
    if (!nuevoHorario.hora_inicio || !nuevoHorario.hora_fin) {
      alert('Debes rellenar todos los campos');
      return;
    }

    const nuevo = {
      id: Date.now(),
      ...nuevoHorario,
      temp: true, // Marcamos como temporal hasta que se guarde en el servidor
    };

    setHorarios([...horarios, nuevo]);
    setNuevoHorario({ dia_semana: 'lunes', hora_inicio: '', hora_fin: '', capacidad_max: 10 });
    setMostrandoForm(false);

    if (onSave) {
      onSave([...horarios, nuevo]);
    }
  };

  const eliminarHorario = (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    const nuevos = horarios.filter(h => h.id !== id);
    setHorarios(nuevos);
    if (onSave) onSave(nuevos);
  };

  const iniciarEdicion = (horario) => {
    setEditando(horario);
  };

  const guardarEdicion = () => {
    const nuevos = horarios.map(h => h.id === editando.id ? editando : h);
    setHorarios(nuevos);
    setEditando(null);
    if (onSave) onSave(nuevos);
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  // Agruparpor día
  const horariosPorDia = diasSemana.map(dia => ({
    dia,
    slots: horarios.filter(h => h.dia_semana === dia),
  }));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-md)',
      padding: '2rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
            Gestión de Horarios
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
            Configura los horarios disponibles para reservas
          </p>
        </div>
        <button
          onClick={() => setMostrandoForm(!mostrandoForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-amber-500)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-amber-600)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-amber-500)'}
        >
          {mostrandoForm ? <X size={16} /> : <Plus size={16} />}
          {mostrandoForm ? 'Cancelar' : 'Nuevo Horario'}
        </button>
      </div>

      {/* Formulario nuevo horario */}
      {mostrandoForm && (
        <div style={{
          backgroundColor: 'var(--color-slate-50)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px dashed var(--color-slate-300)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                Día de la semana
              </label>
              <select
                value={nuevoHorario.dia_semana}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, dia_semana: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                {diasSemana.map(dia => (
                  <option key={dia} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                Hora inicio
              </label>
              <input
                type="time"
                value={nuevoHorario.hora_inicio}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, hora_inicio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                Hora fin
              </label>
              <input
                type="time"
                value={nuevoHorario.hora_fin}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, hora_fin: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                Capacidad máxima
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={nuevoHorario.capacidad_max}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, capacidad_max: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-slate-200)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              />
            </div>
          </div>

          <button
            onClick={agregarHorario}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--color-emerald-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.875rem',
            }}
          >
            <Plus size={16} />
            Agregar Horario
          </button>
        </div>
      )}

      {/* Lista de horarios agrupados por día */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {horariosPorDia.map(({ dia, slots }) => (
          <div key={dia} style={{
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-slate-200)',
            overflow: 'hidden',
          }}>
            <div style={{
              backgroundColor: 'var(--color-slate-100)',
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid var(--color-slate-200)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-slate-900)', textTransform: 'capitalize' }}>
                {dia}
              </h3>
            </div>

            <div style={{ padding: '1rem' }}>
              {slots.length === 0 ? (
                <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                  Sin horarios configurados
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {slots.map(slot => (
                    <div key={slot.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: slot.temp ? 'var(--color-amber-50)' : 'var(--color-slate-50)',
                      borderRadius: 'var(--radius-sm)',
                      border: slot.temp ? '1px solid var(--color-amber-300)' : '1px solid var(--color-slate-200)',
                    }}>
                      {editando && editando.id === slot.id ? (
                        // Modo edición
                        <>
                          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                            <input
                              type="time"
                              value={editando.hora_inicio}
                              onChange={(e) => setEditando({ ...editando, hora_inicio: e.target.value })}
                              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-slate-300)', fontSize: '0.875rem' }}
                            />
                            <input
                              type="time"
                              value={editando.hora_fin}
                              onChange={(e) => setEditando({ ...editando, hora_fin: e.target.value })}
                              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-slate-300)', fontSize: '0.875rem' }}
                            />
                            <input
                              type="number"
                              min="1"
                              value={editando.capacidad_max}
                              onChange={(e) => setEditando({ ...editando, capacidad_max: parseInt(e.target.value) })}
                              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-slate-300)', fontSize: '0.875rem', width: '80px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={guardarEdicion}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: 'var(--color-emerald-500)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: 'var(--color-slate-400)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        // Modo visualización
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Clock size={18} color="var(--color-amber-600)" />
                            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-slate-900)' }}>
                              {slot.hora_inicio} - {slot.hora_fin}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '999px',
                              backgroundColor: 'var(--color-blue-100)',
                              color: 'var(--color-blue-800)',
                            }}>
                              Cap: {slot.capacidad_max}
                            </span>
                            {slot.temp && (
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-amber-200)',
                                color: 'var(--color-amber-900)',
                              }}>
                                NUEVO
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => iniciarEdicion(slot)}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--color-slate-300)',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--color-slate-600)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-slate-100)';
                                e.currentTarget.style.borderColor = 'var(--color-slate-400)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--color-slate-300)';
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => eliminarHorario(slot.id)}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: 'transparent',
                                border: '1px solid #fecaca',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#dc2626',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#fee2e2';
                                e.currentTarget.style.borderColor = '#ef4444';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = '#fecaca';
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
