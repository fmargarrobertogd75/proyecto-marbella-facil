import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ id, message, type, onRemove }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'var(--color-emerald-50)',
      border: 'var(--color-emerald-500)',
      iconColor: 'var(--color-emerald-500)',
      textColor: 'var(--color-emerald-900)',
    },
    error: {
      icon: AlertCircle,
      bg: '#fee2e2',
      border: '#ef4444',
      iconColor: '#ef4444',
      textColor: '#991b1b',
    },
    warning: {
      icon: AlertTriangle,
      bg: '#fef3c7',
      border: '#f59e0b',
      iconColor: '#f59e0b',
      textColor: '#92400e',
    },
    info: {
      icon: Info,
      bg: 'var(--color-blue-50)',
      border: 'var(--color-blue-500)',
      iconColor: 'var(--color-blue-500)',
      textColor: 'var(--color-blue-900)',
    },
  };

  const { icon: Icon, bg, border, iconColor, textColor } = config[type] || config.info;

  return (
    <div style={{
      backgroundColor: bg,
      border: `2px solid ${border}`,
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.5rem',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      pointerEvents: 'auto',
      animation: 'slideInRight 0.3s ease',
      minWidth: '300px',
    }}>
      <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
      <p style={{
        flex: 1,
        fontSize: '0.9rem',
        fontWeight: '600',
        margin: 0,
        color: textColor,
        lineHeight: '1.4',
      }}>
        {message}
      </p>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.25rem',
          transition: 'background 0.2s',
          color: textColor,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Agregar animaciones al index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
