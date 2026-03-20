import { Award, Star, Trophy, Target, Zap, Heart, Map, Compass, Crown, Shield } from 'lucide-react';

// Sistema de insignias/logros
const INSIGNIAS = [
  {
    id: 'explorador',
    nombre: 'Explorador',
    descripcion: 'Visita 5 lugares diferentes',
    icon: Map,
    color: '#3b82f6',
    requisito: (stats) => stats.lugaresVisitados >= 5,
    progreso: (stats) => Math.min((stats.lugaresVisitados / 5) * 100, 100),
  },
  {
    id: 'viajero',
    nombre: 'Viajero Frecuente',
    descripcion: 'Realiza 10 reservas',
    icon: Compass,
    color: '#10b981',
    requisito: (stats) => stats.reservasRealizadas >= 10,
    progreso: (stats) => Math.min((stats.reservasRealizadas / 10) * 100, 100),
  },
  {
    id: 'critico',
    nombre: 'Crítico Gastronómico',
    descripcion: 'Deja 5 reseñas',
    icon: Star,
    color: '#f59e0b',
    requisito: (stats) => stats.resenasEscritas >= 5,
    progreso: (stats) => Math.min((stats.resenasEscritas / 5) * 100, 100),
  },
  {
    id: 'coleccionista',
    nombre: 'Coleccionista de Puntos',
    descripcion: 'Acumula 500 puntos',
    icon: Zap,
    color: '#8b5cf6',
    requisito: (stats) => stats.puntosAcumulados >= 500,
    progreso: (stats) => Math.min((stats.puntosAcumulados / 500) * 100, 100),
  },
  {
    id: 'fiel',
    nombre: 'Cliente Fiel',
    descripcion: 'Visita el mismo lugar 3 veces',
    icon: Heart,
    color: '#ec4899',
    requisito: (stats) => stats.visitasRepetidas >= 3,
    progreso: (stats) => Math.min((stats.visitasRepetidas / 3) * 100, 100),
  },
  {
    id: 'maestro',
    nombre: 'Maestro de Marbella',
    descripcion: 'Alcanza nivel 5',
    icon: Crown,
    color: '#d97706',
    requisito: (stats) => stats.nivel >= 5,
    progreso: (stats) => Math.min((stats.nivel / 5) * 100, 100),
  },
  {
    id: 'elite',
    nombre: 'Usuario Elite',
    descripcion: 'Canjea 5 recompensas',
    icon: Trophy,
    color: '#7c3aed',
    requisito: (stats) => stats.recompensasCanjeadas >= 5,
    progreso: (stats) => Math.min((stats.recompensasCanjeadas / 5) * 100, 100),
  },
  {
    id: 'guardian',
    nombre: 'Guardián de la Costa',
    descripcion: 'Visita 10 playas diferentes',
    icon: Shield,
    color: '#06b6d4',
    requisito: (stats) => stats.playasVisitadas >= 10,
    progreso: (stats) => Math.min((stats.playasVisitadas / 10) * 100, 100),
  },
];

export default function InsigniasSection({ userStats }) {
  // Stats del usuario
  const stats = {
    lugaresVisitados: userStats?.lugaresVisitados || 0,
    reservasRealizadas: userStats?.reservasRealizadas || 0,
    resenasEscritas: userStats?.resenasEscritas || 0,
    puntosAcumulados: userStats?.puntosAcumulados || 0,
    visitasRepetidas: userStats?.visitasRepetidas || 0,
    nivel: userStats?.nivel || 1,
    recompensasCanjeadas: userStats?.recompensasCanjeadas || 0,
    playasVisitadas: userStats?.playasVisitadas || 0,
  };

  const insigniasDesbloqueadas = INSIGNIAS.filter(i => i.requisito(stats));
  const insigniasBloqueadas = INSIGNIAS.filter(i => !i.requisito(stats));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-md)',
      padding: '2rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-slate-900)', marginBottom: '0.5rem' }}>
          🏆 Tus Logros
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
          Has desbloqueado {insigniasDesbloqueadas.length} de {INSIGNIAS.length} insignias
        </p>
      </div>

      {/* Progreso general */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          height: '8px',
          backgroundColor: 'var(--color-slate-200)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(insigniasDesbloqueadas.length / INSIGNIAS.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--color-amber-500), var(--color-amber-600))',
            borderRadius: '999px',
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Insignias desbloqueadas */}
      {insigniasDesbloqueadas.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-slate-900)', marginBottom: '1rem' }}>
            ✨ Desbloqueadas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {insigniasDesbloqueadas.map(insignia => (
              <InsigniaCard key={insignia.id} insignia={insignia} desbloqueada={true} progreso={100} />
            ))}
          </div>
        </div>
      )}

      {/* Insignias bloqueadas */}
      {insigniasBloqueadas.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-slate-900)', marginBottom: '1rem' }}>
            🔒 Por Desbloquear
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {insigniasBloqueadas.map(insignia => (
              <InsigniaCard key={insignia.id} insignia={insignia} desbloqueada={false} progreso={insignia.progreso(stats)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const InsigniaCard = ({ insignia, desbloqueada, progreso }) => {
  const Icon = insignia.icon;

  return (
    <div style={{
      backgroundColor: desbloqueada ? 'white' : 'var(--color-slate-50)',
      borderRadius: 'var(--radius-sm)',
      padding: '1rem',
      border: desbloqueada ? `2px solid ${insignia.color}` : '2px solid var(--color-slate-200)',
      textAlign: 'center',
      opacity: desbloqueada ? 1 : 0.6,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={(e) => {
        if (desbloqueada) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 20px ${insignia.color}40`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Ícono */}
      <div style={{
        width: '60px',
        height: '60px',
        margin: '0 auto 0.75rem',
        backgroundColor: desbloqueada ? `${insignia.color}20` : 'var(--color-slate-200)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Icon size={30} color={desbloqueada ? insignia.color : 'var(--color-slate-400)'} />
        {desbloqueada && (
          <div style={{
            position: 'absolute',
            inset: -4,
            border: `2px solid ${insignia.color}`,
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }} />
        )}
      </div>

      {/* Nombre */}
      <h4 style={{
        fontSize: '0.875rem',
        fontWeight: '800',
        marginBottom: '0.5rem',
        color: desbloqueada ? insignia.color : 'var(--color-slate-600)',
      }}>
        {insignia.nombre}
      </h4>

      {/* Descripción */}
      <p style={{
        fontSize: '0.7rem',
        color: 'var(--color-slate-500)',
        marginBottom: '0.75rem',
        lineHeight: '1.3',
      }}>
        {insignia.descripcion}
      </p>

      {/* Progreso si no está desbloqueada */}
      {!desbloqueada && (
        <div>
          <div style={{
            height: '4px',
            backgroundColor: 'var(--color-slate-200)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.25rem',
          }}>
            <div style={{
              height: '100%',
              width: `${progreso}%`,
              backgroundColor: insignia.color,
              borderRadius: '999px',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-slate-500)' }}>
            {Math.round(progreso)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Agregar animación al head
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.05); }
  }
`;
document.head.appendChild(style);
