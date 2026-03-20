import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TabsContainer from '../components/TabsContainer';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import ReservaCard from '../components/ReservaCard';
import { Award, Calendar, Star, TrendingUp, Gift, Clock, X } from 'lucide-react';
import { puntosApi, reservasExtApi, reservasApi, resenasApi, recompensasApi } from '../services/api';

export default function PerfilUsuarioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [usuario, setUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'resumen');
  const [loading, setLoading] = useState(true);

  // Datos
  const [puntos, setPuntos] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [historialPuntos, setHistorialPuntos] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [canjes, setCanjes] = useState([]);

  const [filtroReservas, setFiltroReservas] = useState('todas');

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    navigate(`/perfil?tab=${tabId}`, { replace: true });
  }, [navigate]);

  // Modals para acciones del usuario sobre reservas
  const [modalModificar, setModalModificar] = useState(null); // reserva a modificar
  const [modalCancelar, setModalCancelar] = useState(null);   // reserva a cancelar
  const [formModificar, setFormModificar] = useState({ fecha_reserva: '', hora_reserva: '', num_personas: '', observaciones: '' });
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('marbella_usuario');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUsuario(u);
    cargarDatos(u);
  }, []);

  const cargarDatos = async (u) => {
    try {
      const [puntosRes, reservasRes, historialRes, recompensasRes, canjesRes] = await Promise.all([
        puntosApi.getMisPuntos(),
        reservasExtApi.getMiHistorial(),
        puntosApi.getHistorial(),
        recompensasApi.getAll(),
        recompensasApi.getMisCanjes(),
      ]);

      setPuntos(puntosRes.data);
      setReservas(reservasRes.data.data || reservasRes.data);
      setHistorialPuntos(historialRes.data.data || historialRes.data);
      setRecompensas(recompensasRes.data);
      setCanjes(canjesRes.data.data || canjesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const canjearRecompensa = async (recompensaId) => {
    if (!confirm('¿Estás seguro de que quieres canjear esta recompensa?')) return;

    try {
      await recompensasApi.canjear(recompensaId);
      alert('¡Recompensa canjeada exitosamente!');
      // Recargar datos
      const u = JSON.parse(localStorage.getItem('marbella_usuario'));
      cargarDatos(u);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al canjear recompensa');
    }
  };

  const abrirModalModificar = (reserva) => {
    setFormModificar({
      fecha_reserva: reserva.fecha_reserva || '',
      hora_reserva: reserva.hora_reserva || '',
      num_personas: reserva.num_personas || '',
      observaciones: reserva.observaciones || '',
    });
    setErrorAccion('');
    setModalModificar(reserva);
  };

  const abrirModalCancelar = (reserva) => {
    setMotivoCancelacion('');
    setErrorAccion('');
    setModalCancelar(reserva);
  };

  const confirmarModificar = async () => {
    if (!formModificar.fecha_reserva || !formModificar.hora_reserva) {
      setErrorAccion('La fecha y la hora son obligatorias.');
      return;
    }
    setLoadingAccion(true);
    setErrorAccion('');
    try {
      await reservasApi.modificarPropia(modalModificar.id, formModificar);
      setModalModificar(null);
      const u = JSON.parse(localStorage.getItem('marbella_usuario'));
      await cargarDatos(u);
    } catch (error) {
      setErrorAccion(error.response?.data?.message || 'No se pudo modificar la reserva.');
    } finally {
      setLoadingAccion(false);
    }
  };

  const confirmarCancelar = async () => {
    setLoadingAccion(true);
    setErrorAccion('');
    try {
      await reservasApi.cancelarPropia(modalCancelar.id, { motivo_cancelacion: motivoCancelacion || 'Cancelada por el usuario' });
      setModalCancelar(null);
      const u = JSON.parse(localStorage.getItem('marbella_usuario'));
      await cargarDatos(u);
    } catch (error) {
      setErrorAccion(error.response?.data?.message || 'No se pudo cancelar la reserva.');
    } finally {
      setLoadingAccion(false);
    }
  };

  if (!usuario || loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  const sidebarItems = [
    { label: 'Resumen', path: '/perfil?tab=resumen', icon: 'Home', activeWhen: 'tab=resumen' },
    { label: 'Mis Reservas', path: '/perfil?tab=reservas', icon: 'Calendar', activeWhen: 'tab=reservas' },
    { label: 'Mis Reseñas', path: '/perfil?tab=resenas', icon: 'Star', activeWhen: 'tab=resenas' },
    { label: 'Mis Puntos', path: '/perfil?tab=puntos', icon: 'Award', activeWhen: 'tab=puntos' },
    { label: 'Recompensas', path: '/perfil?tab=recompensas', icon: 'Gift', activeWhen: 'tab=recompensas' },
  ];

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'reservas', label: 'Mis Reservas' },
    { id: 'resenas', label: 'Mis Reseñas' },
    { id: 'puntos', label: 'Mis Puntos' },
    { id: 'recompensas', label: 'Recompensas' },
  ];

  const reservasFiltradas = filtroReservas === 'todas'
    ? reservas
    : reservas.filter(r => r.estado === filtroReservas);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-slate-50, #f8fafc)', paddingTop: '4.75rem' }}>
      <Sidebar items={sidebarItems} usuario={usuario} />

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Cabecera del perfil */}
        <div style={{
          background: 'linear-gradient(150deg, #0a1628 0%, #0f172a 50%, #1a2d4a 100%)',
          padding: '2rem 2.5rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Malla de puntos decorativa */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          {/* Brillo dorado */}
          <div style={{ position: 'absolute', bottom: -60, right: '10%', width: 300, height: 150, background: 'radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Mi cuenta
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem', lineHeight: 1.2 }}>Mi Perfil</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>Gestiona tu cuenta, reservas y recompensas</p>
          </div>
        </div>

        <div style={{ padding: '2rem 2.5rem' }}>
        <TabsContainer tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* TAB RESUMEN */}
        {activeTab === 'resumen' && puntos && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <StatsCard icon={Award} title="Puntos Totales" value={puntos.puntos_actuales} description={`Nivel: ${puntos.nivel_actual.nombre}`} color="#f59e0b" />
              <StatsCard icon={Calendar} title="Reservas Totales" value={reservas.length} description="Todas tus reservas" color="#3b82f6" />
              <StatsCard icon={Star} title="Reseñas Publicadas" value={resenas.length} description="Tus opiniones" color="#8b5cf6" />
              <StatsCard icon={Gift} title="Recompensas Canjeadas" value={canjes.length} description="Total de canjes" color="#10b981" />
            </div>

            {/* Nivel y Progreso */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>{puntos.nivel_actual.icono}</span>
                {puntos.nivel_actual.nombre}
              </h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{puntos.nivel_actual.descripcion_beneficios}</p>
              {puntos.siguiente_nivel && (
                <>
                  <ProgressBar
                    current={puntos.puntos_actuales}
                    max={puntos.siguiente_nivel.puntos_necesarios}
                    label={`Progreso al ${puntos.siguiente_nivel.nombre}`}
                    color="#f59e0b"
                  />
                  <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
                    Te faltan {puntos.siguiente_nivel.faltan} puntos para alcanzar el nivel {puntos.siguiente_nivel.nombre} {puntos.siguiente_nivel.icono}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB RESERVAS */}
        {activeTab === 'reservas' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['todas', 'pendientes', 'confirmadas', 'pasadas', 'canceladas'].map(f => (
                <button
                  key={f}
                  onClick={() => setFiltroReservas(f)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: filtroReservas === f ? '#f59e0b' : 'white',
                    color: filtroReservas === f ? 'white' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {reservasFiltradas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No tienes reservas {filtroReservas !== 'todas' && filtroReservas}</p>
            ) : (
              reservasFiltradas.map(r => (
                <ReservaCard
                  key={r.id}
                  reserva={r}
                  tipo="usuario"
                  onCancelar={abrirModalCancelar}
                  onModificar={abrirModalModificar}
                />
              ))
            )}
          </div>
        )}

        {/* TAB RESEÑAS */}
        {activeTab === 'resenas' && (
          <div>
            {resenas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Aún no has escrito reseñas</p>
            ) : (
              <div>
                {resenas.map(r => (
                  <div key={r.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{r.negocio?.nombre}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < r.puntuacion ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{r.comentario}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB PUNTOS */}
        {activeTab === 'puntos' && (
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Historial de Puntos</h2>
              {historialPuntos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Sin movimientos de puntos</p>
              ) : (
                <div>
                  {historialPuntos.map(h => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>
                      <div>
                        <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{h.concepto}</p>
                        <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          {new Date(h.created_at).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: h.tipo === 'ganado' ? '#10b981' : '#ef4444' }}>
                        {h.tipo === 'ganado' ? '+' : '-'}{h.puntos}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB RECOMPENSAS */}
        {activeTab === 'recompensas' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Catálogo de Recompensas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {recompensas.map(r => (
                <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>{r.titulo}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', flex: 1, lineHeight: 1.55 }}>{r.descripcion}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-serif, serif)' }}>
                      {r.puntos_necesarios} pts
                    </span>
                    {r.stock !== null && <span style={{ fontSize: '0.8125rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>Stock: {r.stock}</span>}
                  </div>
                  <button
                    onClick={() => canjearRecompensa(r.id)}
                    disabled={!r.disponible || puntos.puntos_actuales < r.puntos_necesarios}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: r.disponible && puntos.puntos_actuales >= r.puntos_necesarios
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : '#e2e8f0',
                      color: r.disponible && puntos.puntos_actuales >= r.puntos_necesarios ? 'white' : '#94a3b8',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      cursor: r.disponible && puntos.puntos_actuales >= r.puntos_necesarios ? 'pointer' : 'not-allowed',
                      marginTop: 'auto',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {!r.disponible ? 'Agotado' : puntos.puntos_actuales < r.puntos_necesarios ? 'Puntos insuficientes' : 'Canjear recompensa'}
                  </button>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Mis Canjes</h2>
            {canjes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Aún no has canjeado recompensas</p>
            ) : (
              <div>
                {canjes.map(c => (
                  <div key={c.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{c.recompensa?.titulo}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Código: {c.codigo_canje}</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Canjeado: {new Date(c.fecha_canje).toLocaleDateString('es-ES')}</p>
                      </div>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: '600', backgroundColor: c.estado === 'entregado' ? '#d1fae5' : '#fef3c7', color: c.estado === 'entregado' ? '#065f46' : '#92400e' }}>
                        {c.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* Modal Modificar Reserva */}
      {modalModificar && (
        <div onClick={e => e.target === e.currentTarget && setModalModificar(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cambiar fecha de reserva</h2>
              <button onClick={() => setModalModificar(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Reserva en <strong>{modalModificar.negocio?.nombre}</strong>. Solo puedes modificar reservas en estado <em>pendiente</em>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#374151' }}>Nueva fecha *</label>
                <input
                  type="date"
                  value={formModificar.fecha_reserva}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onChange={e => setFormModificar(f => ({ ...f, fecha_reserva: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#374151' }}>Nueva hora *</label>
                <input
                  type="time"
                  value={formModificar.hora_reserva}
                  onChange={e => setFormModificar(f => ({ ...f, hora_reserva: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#374151' }}>Personas</label>
                <input
                  type="number"
                  min={1} max={20}
                  value={formModificar.num_personas}
                  onChange={e => setFormModificar(f => ({ ...f, num_personas: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#374151' }}>Observaciones</label>
                <textarea
                  value={formModificar.observaciones}
                  onChange={e => setFormModificar(f => ({ ...f, observaciones: e.target.value }))}
                  rows={3}
                  placeholder="Alergias, preferencias..."
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              {errorAccion && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errorAccion}</p>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setModalModificar(null)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
                  Cancelar
                </button>
                <button onClick={confirmarModificar} disabled={loadingAccion} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', cursor: loadingAccion ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: loadingAccion ? 0.7 : 1 }}>
                  {loadingAccion ? 'Guardando...' : 'Confirmar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancelar Reserva */}
      {modalCancelar && (
        <div onClick={e => e.target === e.currentTarget && setModalCancelar(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: 440, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>Cancelar reserva</h2>
              <button onClick={() => setModalCancelar(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              ¿Seguro que quieres cancelar la reserva en <strong>{modalCancelar.negocio?.nombre}</strong> del <strong>{modalCancelar.fecha_reserva}</strong> a las <strong>{modalCancelar.hora_reserva}</strong>?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#374151' }}>Motivo (opcional)</label>
                <textarea
                  value={motivoCancelacion}
                  onChange={e => setMotivoCancelacion(e.target.value)}
                  rows={3}
                  placeholder="Indica el motivo de la cancelación..."
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              {errorAccion && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errorAccion}</p>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setModalCancelar(null)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
                  Volver
                </button>
                <button onClick={confirmarCancelar} disabled={loadingAccion} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.5rem', background: '#ef4444', color: 'white', cursor: loadingAccion ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: loadingAccion ? 0.7 : 1 }}>
                  {loadingAccion ? 'Cancelando...' : 'Sí, cancelar reserva'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
