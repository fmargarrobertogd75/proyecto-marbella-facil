import React, { useState, useEffect } from 'react';
import {
  Filter, Flag, Loader2, Thermometer, Wind, Users,
  Waves, MapPin, CheckCircle2, AlertCircle, XCircle,
  Sun, X, Info
} from 'lucide-react';
import { playasApi } from '../services/api';

/* ── Configuraciones visuales ───────────────────────────────────── */
const BANDERA_CONFIG = {
  'Verde': { color: '#22c55e', bg: '#dcfce7', label: 'Agua apta para baño', Icon: CheckCircle2 },
  'Amarilla': { color: '#f59e0b', bg: '#fef9c3', label: 'Precaución', Icon: AlertCircle },
  'Roja': { color: '#ef4444', bg: '#fee2e2', label: 'Baño prohibido', Icon: XCircle },
  'Negra': { color: '#1e293b', bg: '#f1f5f9', label: 'Playa cerrada', Icon: XCircle },
  'Medusas': { color: '#f97316', bg: '#ffedd5', label: 'Presencia de medusas', Icon: AlertCircle },
};
const OCUPACION_COLOR = { 'Baja': '#22c55e', 'Media': '#f59e0b', 'Alta': '#ef4444', 'Completo': '#991b1b' };
const OCUPACION_PCT = { 'Baja': 25, 'Media': 55, 'Alta': 80, 'Completo': 100 };
const MAR_COLOR = { 'Calma': '#22c55e', 'Rizado': '#f59e0b', 'Marejada': '#ef4444', 'Fuerte Marejada': '#7f1d1d' };

const BEACH_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
  'https://images.unsplash.com/photo-1500370010940-6bf6df4f4b7f?w=800&q=80',
  'https://images.unsplash.com/photo-1586861203927-800a5acdce4d?w=800&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&q=80',
  'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80',
];

const SERVICIOS_PLAYA = ['Socorrista', 'Alquiler hamacas', 'Zona de juegos', 'Acceso adaptado',
  'Ducha', 'Restaurante cercano', 'Parking', 'WiFi en chiringuito'];

/* ── MODAL DETALLE PLAYA ────────────────────────────────────────── */
const PlayaModal = ({ playa, onClose, idx }) => {
  if (!playa) return null;
  const bConfig = BANDERA_CONFIG[playa.bandera] || BANDERA_CONFIG['Verde'];
  const BFlag = bConfig.Icon;
  const photo = BEACH_PHOTOS[idx % BEACH_PHOTOS.length];

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div style={{ background: 'white', borderRadius: '1.5rem', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Hero imagen */}
        <div style={{ position: 'relative', height: 210 }}>
          <img src={photo} alt={playa.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem 1.5rem 0 0' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 50%)', borderRadius: '1.5rem 1.5rem 0 0' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
            <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{playa.nombre}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{playa.municipio}</p>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          {/* Estado general */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {/* Bandera */}
            <div style={{ background: bConfig.bg, borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <BFlag size={24} color={bConfig.color} style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: bConfig.color }}>{playa.bandera}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>{bConfig.label}</div>
            </div>
            {/* Temperatura */}
            <div style={{ background: '#eff6ff', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <Thermometer size={24} color="#3b82f6" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e40af' }}>
                {playa.temperatura_agua ? `${playa.temperatura_agua}°C` : '--'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)' }}>Temperatura agua</div>
            </div>
            {/* Ocupación */}
            <div style={{ background: '#f0fdf4', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <Users size={24} color="#22c55e" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: OCUPACION_COLOR[playa.ocupacion] || '#22c55e' }}>{playa.ocupacion}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)' }}>Ocupación</div>
            </div>
          </div>

          {/* Barra ocupación */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-slate-500)', marginBottom: '0.4rem' }}>
              <span>Afluencia actual</span>
              <span style={{ fontWeight: 600, color: OCUPACION_COLOR[playa.ocupacion] }}>{OCUPACION_PCT[playa.ocupacion]}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--color-slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${OCUPACION_PCT[playa.ocupacion]}%`, background: OCUPACION_COLOR[playa.ocupacion], borderRadius: '999px', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Estado del mar */}
          <div style={{ background: 'var(--color-slate-50)', borderRadius: '0.875rem', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Waves size={22} color={MAR_COLOR[playa.estado_mar] || '#22c55e'} />
            <div>
              <div style={{ fontWeight: 700, color: MAR_COLOR[playa.estado_mar] || '#22c55e', fontSize: '0.95rem' }}>Mar: {playa.estado_mar}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)' }}>
                {playa.estado_mar === 'Calma' && 'Condiciones ideales para el baño.'}
                {playa.estado_mar === 'Rizado' && 'Olas pequeñas. Apto con precaución.'}
                {playa.estado_mar === 'Marejada' && 'Olas moderadas. Se recomienda precaución.'}
                {playa.estado_mar === 'Fuerte Marejada' && 'No se recomienda el baño.'}
              </div>
            </div>
          </div>

          {/* Servicios disponibles (simulados para demo) */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Servicios típicos
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SERVICIOS_PLAYA.slice(0, 5 + (playa.id % 3)).map(servicio => (
                <span key={servicio} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '999px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 600, border: '1px solid #bfdbfe' }}>
                  <CheckCircle2 size={10} /> {servicio}
                </span>
              ))}
            </div>
          </div>

          {playa.ultima_actualizacion && (
            <p style={{ fontSize: '0.72rem', color: 'var(--color-slate-400)', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Info size={11} /> Actualizado: {new Date(playa.ultima_actualizacion).toLocaleString('es-ES')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── CARD PLAYA ─────────────────────────────────────────────────── */
const PlayaCard = ({ playa, idx, onClick }) => {
  const bConfig = BANDERA_CONFIG[playa.bandera] || BANDERA_CONFIG['Verde'];
  const photo = BEACH_PHOTOS[idx % BEACH_PHOTOS.length];

  return (
    <div
      onClick={() => onClick(playa, idx)}
      style={{
        borderRadius: '1.25rem', overflow: 'hidden', background: 'white',
        boxShadow: 'var(--shadow-md)', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid var(--color-slate-100)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Foto */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={photo} alt={playa.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)' }} />
        {/* Bandera */}
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: bConfig.color, width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 0 3px rgba(255,255,255,0.4)`,
        }}>
          <Flag size={14} fill="white" color="white" />
        </div>
        {/* Label bandera */}
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          background: bConfig.bg, color: bConfig.color, fontSize: '0.68rem',
          fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px',
          border: `1px solid ${bConfig.color}30`,
        }}>
          {playa.bandera}
        </div>
        {/* Nombre */}
        <div style={{ position: 'absolute', bottom: '0.875rem', left: '1rem' }}>
          <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)', marginBottom: '0.1rem' }}>{playa.nombre}</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={10} /> {playa.municipio}
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1rem 1.25rem' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#3b82f6' }}>
              {playa.temperatura_agua ? `${playa.temperatura_agua}°` : '--'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Agua</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--color-slate-100)', borderRight: '1px solid var(--color-slate-100)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: OCUPACION_COLOR[playa.ocupacion] || '#22c55e' }}>{playa.ocupacion}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ocup.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: MAR_COLOR[playa.estado_mar] || '#22c55e' }}>{playa.estado_mar?.split(' ')[0]}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mar</div>
          </div>
        </div>

        {/* Barra ocupación */}
        <div style={{ height: 5, background: 'var(--color-slate-100)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ height: '100%', width: `${OCUPACION_PCT[playa.ocupacion] || 0}%`, background: OCUPACION_COLOR[playa.ocupacion] || '#22c55e', borderRadius: '999px', transition: 'width 0.5s ease' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: bConfig.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <bConfig.Icon size={12} /> {bConfig.label}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-400)' }}>Ver detalles →</span>
        </div>
      </div>
    </div>
  );
};

/* ── PÁGINA PRINCIPAL ───────────────────────────────────────────── */
const PlayasPage = () => {
  const [playas, setPlayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banderaFiltro, setBanderaFiltro] = useState([]);
  const [ocupFiltro, setOcupFiltro] = useState([]);
  const [modalPlaya, setModalPlaya] = useState(null);
  const [modalIdx, setModalIdx] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await playasApi.getAll();
        setPlayas(Array.isArray(res.data) ? res.data : res.data.data ?? []);
      } catch {
        setError('No se pudieron cargar los datos de las playas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = playas.filter(p => {
    if (banderaFiltro.length > 0 && !banderaFiltro.includes(p.bandera)) return false;
    if (ocupFiltro.length > 0 && !ocupFiltro.includes(p.ocupacion)) return false;
    return true;
  });

  const abrirModal = (playa, idx) => { setModalPlaya(playa); setModalIdx(idx); };

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', marginBottom: '1rem', display: 'inline-flex' }}>
            <Waves size={14} /> &nbsp; Costa de Marbella
          </div>
          <h1 className="section-title">Playas y Costa</h1>
          <p className="section-desc">Estado del mar, banderas y afluencia en tiempo real de los 27 km de costa marbellí.</p>

          {/* Stats globales rápidas */}
          {playas.length > 0 && (
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Banderas verdes', val: playas.filter(p => p.bandera === 'Verde').length, color: '#22c55e' },
                { label: 'Banderas amarillas', val: playas.filter(p => p.bandera === 'Amarilla').length, color: '#f59e0b' },
                { label: 'Banderas rojas', val: playas.filter(p => p.bandera === 'Roja').length, color: '#ef4444' },
                { label: 'Total playas', val: playas.length, color: 'white' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="page-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="filter-box">
                <h3><Filter size={16} /> Filtros</h3>
                <div className="checkbox-group">
                  <span className="filter-group-label">Estado Bandera</span>
                  {['Verde', 'Amarilla', 'Roja', 'Negra', 'Medusas'].map(b => (
                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={banderaFiltro.includes(b)} onChange={() => toggleArr(banderaFiltro, setBanderaFiltro, b)} />
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: BANDERA_CONFIG[b]?.color }}>
                        <Flag size={12} fill={BANDERA_CONFIG[b]?.color} /> {b}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="checkbox-group" style={{ marginTop: '1rem' }}>
                  <span className="filter-group-label">Ocupación</span>
                  {['Baja', 'Media', 'Alta', 'Completo'].map(o => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={ocupFiltro.includes(o)} onChange={() => toggleArr(ocupFiltro, setOcupFiltro, o)} />
                      <span style={{ fontSize: '0.875rem', color: OCUPACION_COLOR[o] }}>{o}</span>
                    </label>
                  ))}
                </div>
                {(banderaFiltro.length > 0 || ocupFiltro.length > 0) && (
                  <button onClick={() => { setBanderaFiltro([]); setOcupFiltro([]); }} style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-slate-200)', background: 'white', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-slate-500)' }}>
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Leyenda bandera */}
              <div className="filter-box" style={{ marginTop: '1rem' }}>
                <h3><Info size={16} /> Guía de banderas</h3>
                {Object.entries(BANDERA_CONFIG).map(([b, cfg]) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.625rem', fontSize: '0.8rem' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: cfg.color, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: cfg.color }}>{b}</div>
                      <div style={{ color: 'var(--color-slate-400)' }}>{cfg.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Grid */}
            <div className="content-area">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
                  <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
                  Cargando playas...
                </div>
              ) : error ? (
                <div style={{ padding: '2rem', background: '#fef2f2', borderRadius: '1rem', color: '#b91c1c', border: '1px solid #fecaca' }}>⚠️ {error}</div>
              ) : (
                <>
                  <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Mostrando <strong>{filtered.length}</strong> playa{filtered.length !== 1 ? 's' : ''} {(banderaFiltro.length > 0 || ocupFiltro.length > 0) ? 'con filtros aplicados' : 'disponibles'}
                  </p>
                  <div className="grid-3">
                    {filtered.map((playa, idx) => (
                      <PlayaCard key={playa.id} playa={playa} idx={idx} onClick={abrirModal} />
                    ))}
                  </div>
                  {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)' }}>
                      No hay playas con los filtros seleccionados.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalPlaya && <PlayaModal playa={modalPlaya} idx={modalIdx} onClose={() => setModalPlaya(null)} />}
    </div>
  );
};

export default PlayasPage;