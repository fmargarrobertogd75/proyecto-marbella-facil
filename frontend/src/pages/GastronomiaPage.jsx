import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, MapPin, Star, UtensilsCrossed, Loader2,
  Phone, Globe, Mail, X, Wifi, Wind, Car, Waves, Music,
  Leaf, CalendarCheck, PawPrint, Accessibility, Sun,
  ChevronLeft, ChevronRight, SlidersHorizontal, Calendar, Clock, Users
} from 'lucide-react';
import { negociosApi, categoriasApi, caracteristicasApi, reservasApi, negocioApi } from '../services/api';

/* ── Mapa de iconos de características ─────────────────────────── */
const ICON_MAP = {
  'fa-wifi': Wifi, 'fa-sun': Sun, 'fa-car': Car, 'fa-wind': Wind,
  'fa-wheelchair': Accessibility, 'fa-paw': PawPrint, 'fa-water': Waves,
  'fa-music': Music, 'fa-leaf': Leaf, 'fa-calendar-check': CalendarCheck,
};
const PRECIO_LABEL = { '€': 'Económico', '€€': 'Moderado', '€€€': 'Caro', '€€€€': 'Lujo' };
const PRECIO_COLOR = { '€': '#22c55e', '€€': '#f59e0b', '€€€': '#ef4444', '€€€€': '#8b5cf6' };

const CaracteristicaBadge = ({ nombre_es, icono }) => {
  const Icon = ICON_MAP[icono] || Wifi;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.25rem 0.65rem', borderRadius: '999px',
      background: 'rgba(245,158,11,0.1)', color: 'var(--color-amber-700)',
      fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(245,158,11,0.2)',
    }}>
      <Icon size={11} /> {nombre_es}
    </span>
  );
};

/* ── MODAL DETALLE ─────────────────────────────────────────────── */
const NegocioModal = ({ negocio, onClose, onReservar }) => {
  if (!negocio) return null;
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div style={{
        background: 'white', borderRadius: '1.5rem', width: '100%', maxWidth: 600,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Imagen */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', borderRadius: '1.5rem 1.5rem 0 0' }}>
          <img
            src={negocio.imagen_principal || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'}
            alt={negocio.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          ><X size={18} /></button>
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
            <span style={{ background: PRECIO_COLOR[negocio.precio_medio] || '#f59e0b', color: 'white', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.9rem' }}>
              {negocio.precio_medio} · {PRECIO_LABEL[negocio.precio_medio]}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-slate-900)', lineHeight: 1.2 }}>
              {negocio.nombre}
            </h2>
            {negocio.puntuacion_media > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, background: 'var(--color-amber-50)', border: '1px solid var(--color-amber-200)', borderRadius: '0.75rem', padding: '0.35rem 0.75rem' }}>
                <Star size={15} fill="var(--color-amber-400)" color="var(--color-amber-400)" />
                <span style={{ fontWeight: 800, color: 'var(--color-slate-800)' }}>{negocio.puntuacion_media}</span>
                <span style={{ color: 'var(--color-slate-400)', fontSize: '0.8rem' }}>({negocio.total_resenas})</span>
              </div>
            )}
          </div>

          {negocio.categoria && (
            <span style={{ fontSize: '0.78rem', color: 'var(--color-amber-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {negocio.categoria.nombre_es}
            </span>
          )}

          <p style={{ color: 'var(--color-slate-600)', lineHeight: 1.7, margin: '0.75rem 0 1.25rem', fontSize: '0.95rem' }}>
            {negocio.descripcion_es}
          </p>

          {/* Características */}
          {negocio.caracteristicas?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
                Características
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {negocio.caracteristicas.map(c => <CaracteristicaBadge key={c.id} {...c} />)}
              </div>
            </div>
          )}

          {/* Contacto */}
          <div style={{ borderTop: '1px solid var(--color-slate-100)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {negocio.direccion && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>
                <MapPin size={15} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: 1 }} />
                {negocio.direccion}
              </div>
            )}
            {negocio.telefono && (
              <a href={`tel:${negocio.telefono}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-blue-600)', textDecoration: 'none' }}>
                <Phone size={15} /> {negocio.telefono}
              </a>
            )}
            {negocio.email_contacto && (
              <a href={`mailto:${negocio.email_contacto}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-blue-600)', textDecoration: 'none' }}>
                <Mail size={15} /> {negocio.email_contacto}
              </a>
            )}
            {negocio.web && (
              <a href={negocio.web} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-blue-600)', textDecoration: 'none' }}>
                <Globe size={15} /> {negocio.web}
              </a>
            )}
          </div>

          {/* Botón Reservar */}
          <button
            onClick={() => onReservar(negocio)}
            style={{
              marginTop: '1.5rem', width: '100%', padding: '0.875rem',
              background: 'var(--marbella-gold, #f59e0b)', color: 'white',
              border: 'none', borderRadius: '0.75rem', fontSize: '1rem',
              fontWeight: 700, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Calendar size={18} /> Reservar mesa
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── MODAL HACER RESERVA ───────────────────────────────────────── */
const ReservaRestauranteModal = ({ negocio, onClose, onSuccess }) => {
  const [tiposReserva, setTiposReserva] = useState([]);
  const [slots, setSlots] = useState([]);
  const [step, setStep] = useState(1); // 1: tipo, 2: fecha/hora, 3: confirmación
  const [form, setForm] = useState({
    tipo_reserva_id: '',
    fecha_reserva: '',
    hora_reserva: '',
    num_personas: 2,
    observaciones: '',
  });
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const usuario = localStorage.getItem('marbella_usuario') ? JSON.parse(localStorage.getItem('marbella_usuario')) : null;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [tiposRes, slotsRes] = await Promise.all([
          negocioApi.getTiposReserva(negocio.id),
          negocioApi.getSlots(negocio.id),
        ]);
        const tipos = (tiposRes.data || []).filter(t => t.activo);
        setTiposReserva(tipos);
        setSlots(slotsRes.data || []);
        if (tipos.length === 1) {
          setForm(f => ({ ...f, tipo_reserva_id: tipos[0].id }));
          setStep(2);
        }
      } catch {
        // Si no hay tipos definidos seguimos sin tipo
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [negocio.id]);

  // Genera horas disponibles según el día de semana y los slots del tipo seleccionado
  useEffect(() => {
    if (!form.fecha_reserva || !form.tipo_reserva_id) {
      setHorasDisponibles([]);
      return;
    }
    const diaSemana = new Date(form.fecha_reserva).getDay(); // 0=domingo
    const slotsDelDia = slots.filter(s =>
      s.activo &&
      Number(s.dia_semana) === diaSemana &&
      Number(s.tipo_reserva_id) === Number(form.tipo_reserva_id)
    );

    if (slotsDelDia.length === 0) {
      // Si no hay slots configurados, generar horas genéricas (13:00-16:00, 20:00-23:00)
      const horas = [];
      for (let h = 13; h <= 15; h++) horas.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`);
      for (let h = 20; h <= 22; h++) horas.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`);
      setHorasDisponibles(horas);
    } else {
      const horas = [];
      slotsDelDia.forEach(slot => {
        const [hI, mI] = slot.hora_inicio.split(':').map(Number);
        const [hF, mF] = slot.hora_fin.split(':').map(Number);
        let minutos = hI * 60 + mI;
        const fin = hF * 60 + mF;
        while (minutos < fin) {
          horas.push(`${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`);
          minutos += 30;
        }
      });
      setHorasDisponibles(horas);
    }
  }, [form.fecha_reserva, form.tipo_reserva_id, slots]);

  const handleSubmit = async () => {
    if (!usuario) {
      setError('Debes iniciar sesión para hacer una reserva.');
      return;
    }
    if (!form.fecha_reserva || !form.hora_reserva) {
      setError('Selecciona fecha y hora.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await reservasApi.create({
        negocio_id: negocio.id,
        tipo_reserva_id: form.tipo_reserva_id || undefined,
        fecha_reserva: form.fecha_reserva,
        hora_reserva: form.hora_reserva,
        num_personas: Number(form.num_personas),
        observaciones: form.observaciones || undefined,
      });
      setExito(true);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo realizar la reserva. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const mañana = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (exito) {
    return (
      <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#065f46' }}>¡Reserva enviada!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
            Tu solicitud de reserva en <strong>{negocio.nombre}</strong> para el {form.fecha_reserva} a las {form.hora_reserva} ha sido recibida y está pendiente de confirmación.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
              Cerrar
            </button>
            <button onClick={() => { onClose(); window.location.href = '/perfil?tab=reservas'; }} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.75rem', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
              Ver mis reservas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.2rem' }}>Reservar mesa</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{negocio.nombre}</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
            Cargando disponibilidad...
          </div>
        ) : !usuario ? (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Debes iniciar sesión para hacer una reserva.</p>
            <button onClick={() => { onClose(); window.location.href = '/login'; }} style={{ padding: '0.75rem 2rem', background: 'var(--marbella-gold, #f59e0b)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              Iniciar sesión
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            {/* Tipo de reserva (si hay varios) */}
            {tiposReserva.length > 1 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>
                  Tipo de reserva
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tiposReserva.map(t => (
                    <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: `1.5px solid ${Number(form.tipo_reserva_id) === t.id ? 'var(--marbella-gold, #f59e0b)' : '#e2e8f0'}`, borderRadius: '0.75rem', cursor: 'pointer', background: Number(form.tipo_reserva_id) === t.id ? 'rgba(245,158,11,0.06)' : 'white' }}>
                      <input type="radio" name="tipo_reserva" value={t.id} checked={Number(form.tipo_reserva_id) === t.id} onChange={() => setForm(f => ({ ...f, tipo_reserva_id: t.id }))} style={{ accentColor: '#f59e0b' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.nombre}</div>
                        {t.descripcion && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.descripcion}</div>}
                        {t.capacidad_maxima && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Máx. {t.capacidad_maxima} personas</div>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Fecha */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} /> Fecha *
              </label>
              <input
                type="date"
                value={form.fecha_reserva}
                min={mañana}
                onChange={e => setForm(f => ({ ...f, fecha_reserva: e.target.value, hora_reserva: '' }))}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            {/* Horas disponibles */}
            {form.fecha_reserva && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} /> Hora *
                </label>
                {horasDisponibles.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No hay horarios disponibles este día.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {horasDisponibles.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, hora_reserva: h }))}
                        style={{
                          padding: '0.5rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                          border: `1.5px solid ${form.hora_reserva === h ? 'var(--marbella-gold, #f59e0b)' : '#e2e8f0'}`,
                          background: form.hora_reserva === h ? 'var(--marbella-gold, #f59e0b)' : 'white',
                          color: form.hora_reserva === h ? 'white' : '#374151',
                        }}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Personas */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={15} /> Número de personas *
              </label>
              <input
                type="number"
                min={1} max={20}
                value={form.num_personas}
                onChange={e => setForm(f => ({ ...f, num_personas: e.target.value }))}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            {/* Observaciones */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>
                Observaciones (opcional)
              </label>
              <textarea
                value={form.observaciones}
                onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
                rows={3}
                placeholder="Alergias, ocasión especial, preferencias de mesa..."
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={enviando || !form.fecha_reserva || !form.hora_reserva}
              style={{
                width: '100%', padding: '0.875rem', border: 'none', borderRadius: '0.75rem',
                background: enviando || !form.fecha_reserva || !form.hora_reserva ? '#cbd5e1' : 'var(--marbella-gold, #f59e0b)',
                color: 'white', fontWeight: 700, fontSize: '1rem',
                cursor: enviando || !form.fecha_reserva || !form.hora_reserva ? 'not-allowed' : 'pointer',
              }}
            >
              {enviando ? 'Enviando reserva...' : 'Confirmar reserva'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── CARD RESTAURANTE ──────────────────────────────────────────── */
const RestaurantCard = ({ negocio, onClick }) => {
  const n = negocio;
  return (
    <div
      className="restaurant-card"
      onClick={() => onClick(n)}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Imagen */}
      <div className="rest-img-box">
        <img
          src={n.imagen_principal || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'}
          className="rest-img"
          alt={n.nombre}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'; }}
        />
        <span style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: PRECIO_COLOR[n.precio_medio] || '#f59e0b', color: 'white',
          fontWeight: 800, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '0.5rem',
        }}>{n.precio_medio}</span>
        {n.destacado && (
          <span style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: 'var(--marbella-gold)', color: 'white', fontSize: '0.65rem',
            fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', textTransform: 'uppercase',
          }}>★ Destacado</span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="rest-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-slate-900)' }}>{n.nombre}</h3>
          {n.puntuacion_media > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-slate-700)', flexShrink: 0 }}>
              <Star size={12} fill="var(--color-amber-400)" color="var(--color-amber-400)" /> {n.puntuacion_media}
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--color-slate-400)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
          {n.descripcion_es?.slice(0, 75)}{n.descripcion_es?.length > 75 ? '…' : ''}
        </p>

        {n.direccion && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-slate-500)', marginBottom: '0.625rem' }}>
            <MapPin size={11} /> {n.direccion.split(',')[0]}
          </div>
        )}

        {/* Características (primeras 3) */}
        {n.caracteristicas?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
            {n.caracteristicas.slice(0, 3).map(c => <CaracteristicaBadge key={c.id} {...c} />)}
            {n.caracteristicas.length > 3 && (
              <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-400)', padding: '0.25rem 0.4rem' }}>
                +{n.caracteristicas.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── PÁGINA PRINCIPAL ──────────────────────────────────────────── */
const GastronomiaPage = () => {
  const [negocios, setNegocios] = useState([]);
  const [caracteristicas, setCaracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroCaract, setFiltroCaract] = useState('');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [modalNegocio, setModalNegocio] = useState(null);
  const [modalReserva, setModalReserva] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const cargar = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const params = {
        categoria: 'gastronomia', per_page: 12, page: p,
        ...(filtroPrecio && { precio: filtroPrecio }),
        ...(filtroCaract && { caracteristica: filtroCaract }),
        ...(soloDestacados && { destacado: 1 }),
      };
      const res = await negociosApi.getAll(params);
      const body = res.data;
      setNegocios(body.data ?? body);
      setMeta({ last_page: body.last_page ?? 1, total: body.total ?? (body.data ?? body).length });
    } catch {
      setError('No se pudieron cargar los restaurantes.');
    } finally {
      setLoading(false);
    }
  }, [filtroPrecio, filtroCaract, soloDestacados]);

  useEffect(() => { cargar(1); setPage(1); }, [cargar]);
  useEffect(() => { caracts(); }, []);

  const caracts = async () => {
    try {
      const res = await caracteristicasApi.getAll();
      setCaracts(res.data);
    } catch { }
  };

  const filtered = negocios.filter(n =>
    !search ||
    n.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (n.descripcion_es || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.direccion || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-amber-400)', marginBottom: '1rem', display: 'inline-flex' }}>
              <UtensilsCrossed size={14} /> &nbsp; Gastronomía
            </div>
            <h1 className="section-title">Guía Gastronómica</h1>
            <p className="section-desc">Los mejores restaurantes de Marbella, con características y reseñas reales.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', display: 'flex', alignItems: 'center', padding: '0.5rem 1.25rem', gap: '0.5rem', maxWidth: '320px', width: '100%' }}>
            <Search size={16} color="rgba(255,255,255,0.6)" />
            <input
              type="text"
              placeholder="Buscar restaurante..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.9rem', width: '100%', fontFamily: 'var(--font-sans)' }}
            />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Barra de filtros */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Precio */}
            <div className="filter-scroll" style={{ flex: 1, minWidth: 0 }}>
              {['', '€', '€€', '€€€', '€€€€'].map(p => (
                <button key={p || 'todos'} className={`filter-pill ${filtroPrecio === p ? 'active' : ''}`} onClick={() => setFiltroPrecio(p)}>
                  {p || 'Todo precio'}
                </button>
              ))}
              {/* Características */}
              {caracteristicas.length > 0 && (
                <select
                  value={filtroCaract}
                  onChange={e => setFiltroCaract(e.target.value)}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1.5px solid var(--color-slate-200)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', cursor: 'pointer', color: filtroCaract ? 'var(--color-slate-800)' : 'var(--color-slate-500)', background: filtroCaract ? 'var(--marbella-gold)' : 'white', color: filtroCaract ? 'white' : 'var(--color-slate-500)' }}
                >
                  <option value="">Con característica…</option>
                  {caracteristicas.map(c => <option key={c.id} value={c.id}>{c.nombre_es}</option>)}
                </select>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--color-slate-600)', padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1.5px solid var(--color-slate-200)', background: soloDestacados ? 'var(--marbella-gold)' : 'white', color: soloDestacados ? 'white' : 'var(--color-slate-600)' }}>
                <input type="checkbox" checked={soloDestacados} onChange={e => setSoloDestacados(e.target.checked)} style={{ display: 'none' }} />
                ★ Solo destacados
              </label>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-slate-400)', whiteSpace: 'nowrap' }}>
              {meta.total} lugares
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
              Cargando restaurantes...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#b91c1c', background: '#fef2f2', borderRadius: '1rem', border: '1px solid #fecaca' }}>
              ⚠️ {error}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid-3">
                {filtered.map(n => <RestaurantCard key={n.id} negocio={n} onClick={setModalNegocio} />)}
              </div>
              {/* Paginación */}
              {meta.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                  <button disabled={page === 1} onClick={() => { setPage(p => p - 1); cargar(page - 1); }} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-slate-200)', borderRadius: '0.5rem', cursor: 'pointer', background: 'white', opacity: page === 1 ? 0.4 : 1 }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>Página {page} de {meta.last_page}</span>
                  <button disabled={page === meta.last_page} onClick={() => { setPage(p => p + 1); cargar(page + 1); }} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-slate-200)', borderRadius: '0.5rem', cursor: 'pointer', background: 'white', opacity: page === meta.last_page ? 0.4 : 1 }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
              <UtensilsCrossed size={40} style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem', opacity: 0.3 }} />
              No se encontraron restaurantes para estos filtros.
              <br /><button onClick={() => { setFiltroPrecio(''); setFiltroCaract(''); setSoloDestacados(false); }} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: '999px', border: '1px solid var(--color-slate-200)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>Limpiar filtros</button>
            </div>
          )}
        </div>
      </section>

      {/* Modal detalle */}
      {modalNegocio && (
        <NegocioModal
          negocio={modalNegocio}
          onClose={() => setModalNegocio(null)}
          onReservar={(negocio) => { setModalNegocio(null); setModalReserva(negocio); }}
        />
      )}

      {/* Modal reserva */}
      {modalReserva && (
        <ReservaRestauranteModal
          negocio={modalReserva}
          onClose={() => setModalReserva(null)}
        />
      )}
    </div>
  );
};

export default GastronomiaPage;