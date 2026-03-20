import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TabsContainer from '../components/TabsContainer';
import StatsCard from '../components/StatsCard';
import ReservaCard from '../components/ReservaCard';
import { Calendar, TrendingUp, Star, AlertCircle, Check, X } from 'lucide-react';
import { negocioApi } from '../services/api';

export default function NegocioDashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [usuario, setUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'estadisticas');
  const [loading, setLoading] = useState(true);

  // Datos
  const [estadisticas, setEstadisticas] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [filtroReservas, setFiltroReservas] = useState('todas');
  const [tiposReserva, setTiposReserva] = useState([]);
  const [slots, setSlots] = useState([]);

  // Modales
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [reservaARechazar, setReservaARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('marbella_usuario');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    if (u.rol !== 'empresa') {
      navigate('/');
      return;
    }
    setUsuario(u);
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar estadísticas
      const statsRes = await negocioApi.getEstadisticas();
      setEstadisticas(statsRes.data);

      // Cargar reservas
      const reservasRes = await negocioApi.getReservas({ filtro: 'todas' });
      setReservas(reservasRes.data.data || reservasRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert(error.response?.data?.message || 'Error al cargar datos');
      setLoading(false);
    }
  };

  const confirmarReserva = async (reservaId) => {
    if (!confirm('¿Confirmar esta reserva?')) return;

    try {
      await negocioApi.confirmarReserva(reservaId);
      alert('Reserva confirmada exitosamente');
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al confirmar reserva');
    }
  };

  const abrirModalRechazo = (reservaId) => {
    setReservaARechazar(reservaId);
    setMotivoRechazo('');
    setShowRechazarModal(true);
  };

  const rechazarReserva = async () => {
    if (!motivoRechazo.trim()) {
      alert('Debes proporcionar un motivo para rechazar la reserva');
      return;
    }

    try {
      await negocioApi.rechazarReserva(reservaARechazar, { motivo_cancelacion: motivoRechazo });
      alert('Reserva rechazada');
      setShowRechazarModal(false);
      setReservaARechazar(null);
      setMotivoRechazo('');
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al rechazar reserva');
    }
  };

  if (!usuario || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-slate-50, #f8fafc)' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando panel...</div>
      </div>
    );
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/negocio/dashboard?tab=${tabId}`, { replace: true });
  };

  const sidebarItems = [
    { label: 'Estadísticas', path: '/negocio/dashboard?tab=estadisticas', icon: 'BarChart3', activeWhen: 'tab=estadisticas' },
    { label: 'Reservas',     path: '/negocio/dashboard?tab=reservas',     icon: 'Calendar',  activeWhen: 'tab=reservas'     },
    { label: 'Configuración',path: '/negocio/dashboard?tab=configuracion',icon: 'Settings',  activeWhen: 'tab=configuracion'},
  ];

  const tabs = [
    { id: 'estadisticas', label: 'Estadísticas' },
    { id: 'reservas', label: 'Gestión de Reservas' },
    { id: 'configuracion', label: 'Configuración' },
  ];

  const reservasFiltradas = filtroReservas === 'todas'
    ? reservas
    : reservas.filter(r => r.estado === filtroReservas);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-slate-50, #f8fafc)', paddingTop: '4.75rem' }}>
      <Sidebar items={sidebarItems} usuario={usuario} />

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Cabecera del panel */}
        <div style={{
          background: 'linear-gradient(150deg, #0a1628 0%, #0f172a 50%, #1a2d4a 100%)',
          padding: '2rem 2.5rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: '10%', width: 300, height: 150, background: 'radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Panel Empresa
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem', lineHeight: 1.2 }}>
              Panel de Negocio
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              {estadisticas?.negocio?.nombre || 'Mi Negocio'}
            </p>
          </div>
        </div>

        <div style={{ padding: '2rem 2.5rem' }}>
          <TabsContainer tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

          {/* TAB ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && estadisticas && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard icon={Calendar}     title="Reservas Este Mes"    value={estadisticas.estadisticas.reservas_este_mes}    description="Total de reservas"        color="#f59e0b" />
                <StatsCard icon={Check}        title="Confirmadas"          value={estadisticas.estadisticas.reservas_confirmadas} description="Confirmadas este mes"     color="#10b981" />
                <StatsCard icon={AlertCircle}  title="Pendientes"           value={estadisticas.estadisticas.reservas_pendientes}  description="Requieren tu atención"    color="#f59e0b" />
                <StatsCard icon={Star}         title="Rating Promedio"      value={estadisticas.estadisticas.rating_promedio.toFixed(1)} description={`${estadisticas.estadisticas.total_resenas} reseñas`} color="#8b5cf6" />
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Tasa de Ocupación</h2>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '2rem' }}>Reservas confirmadas sobre el total del mes</p>
                <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                  <div style={{ fontSize: '4.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-serif, serif)', lineHeight: 1 }}>
                    {estadisticas.estadisticas.tasa_ocupacion}%
                  </div>
                  <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '0.9375rem' }}>
                    {estadisticas.estadisticas.reservas_confirmadas} de {estadisticas.estadisticas.reservas_este_mes} reservas confirmadas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB RESERVAS */}
          {activeTab === 'reservas' && (
            <div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['todas', 'pendientes', 'confirmadas', 'hoy', 'futuras'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFiltroReservas(f)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '0.5rem',
                      border: `1.5px solid ${filtroReservas === f ? '#f59e0b' : '#e2e8f0'}`,
                      backgroundColor: filtroReservas === f ? '#f59e0b' : 'white',
                      color: filtroReservas === f ? 'white' : '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: filtroReservas === f ? 700 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {reservasFiltradas.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <Calendar size={36} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
                  No hay reservas {filtroReservas !== 'todas' && `"${filtroReservas}"`}
                </div>
              ) : (
                reservasFiltradas.map(r => (
                  <ReservaCard
                    key={r.id}
                    reserva={r}
                    tipo="negocio"
                    onConfirmar={confirmarReserva}
                    onRechazar={abrirModalRechazo}
                  />
                ))
              )}
            </div>
          )}

          {/* TAB CONFIGURACIÓN */}
          {activeTab === 'configuracion' && (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Configuración del Negocio</h2>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                Aquí podrás gestionar tipos de reserva, horarios de disponibilidad y otras configuraciones.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Funcionalidad en desarrollo...</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Rechazar Reserva */}
      {showRechazarModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowRechazarModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', width: '90%', maxWidth: 480, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>Rechazar Reserva</h2>
              <button onClick={() => setShowRechazarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              Proporciona un motivo para rechazar la reserva. El cliente será notificado.
            </p>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ej: No hay disponibilidad en esa fecha..."
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', fontSize: '0.9375rem', marginBottom: '1.5rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowRechazarModal(false)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button
                onClick={rechazarReserva}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 700 }}
              >
                Rechazar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
