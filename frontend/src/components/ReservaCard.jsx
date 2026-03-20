import { Calendar, Clock, Users, MapPin, Check, X, Pencil, Ban } from 'lucide-react';

export default function ReservaCard({ reserva, onConfirmar, onRechazar, onCancelar, onModificar, tipo = 'usuario' }) {
  const estadoColors = {
    pendiente: { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
    confirmada: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    cancelada: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    finalizada: { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1' },
  };

  const colors = estadoColors[reserva.estado] || estadoColors.pendiente;

  const puedeUsuarioCancelar = tipo === 'usuario' && ['pendiente', 'confirmada'].includes(reserva.estado);
  const puedeUsuarioModificar = tipo === 'usuario' && reserva.estado === 'pendiente';

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {tipo === 'negocio' ? reserva.usuario?.nombre : reserva.negocio?.nombre}
          </h3>
          {reserva.tipo_reserva && (
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {reserva.tipo_reserva.nombre}
            </p>
          )}
        </div>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.8125rem',
          fontWeight: '600',
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}>
          {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
          <Calendar size={16} style={{ marginRight: '0.5rem' }} />
          {reserva.fecha_reserva}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
          <Clock size={16} style={{ marginRight: '0.5rem' }} />
          {reserva.hora_reserva}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
          <Users size={16} style={{ marginRight: '0.5rem' }} />
          {reserva.num_personas} persona{reserva.num_personas > 1 ? 's' : ''}
        </div>
        {tipo === 'usuario' && reserva.negocio?.direccion && (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
            <MapPin size={16} style={{ marginRight: '0.5rem' }} />
            {reserva.negocio.direccion}
          </div>
        )}
      </div>

      {reserva.observaciones && (
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', fontStyle: 'italic' }}>
          Observaciones: {reserva.observaciones}
        </p>
      )}

      {reserva.motivo_cancelacion && (
        <p style={{ fontSize: '0.875rem', color: '#991b1b', marginBottom: '1rem' }}>
          Motivo de cancelación: {reserva.motivo_cancelacion}
        </p>
      )}

      {tipo === 'negocio' && reserva.estado === 'pendiente' && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onConfirmar(reserva.id)}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Check size={16} />
            Confirmar
          </button>
          <button
            onClick={() => onRechazar(reserva.id)}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <X size={16} />
            Rechazar
          </button>
        </div>
      )}

      {(puedeUsuarioCancelar || puedeUsuarioModificar) && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          {puedeUsuarioModificar && (
            <button
              onClick={() => onModificar(reserva)}
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Pencil size={16} />
              Cambiar fecha
            </button>
          )}
          {puedeUsuarioCancelar && (
            <button
              onClick={() => onCancelar(reserva)}
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                backgroundColor: 'white',
                color: '#ef4444',
                border: '1.5px solid #ef4444',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Ban size={16} />
              Cancelar reserva
            </button>
          )}
        </div>
      )}
    </div>
  );
}
