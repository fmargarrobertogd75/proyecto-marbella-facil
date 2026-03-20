import { useState, useEffect } from 'react';

// Gráfico de líneas simple
export const LineChart = ({ data, color = '#f59e0b', height = 200 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-slate-400)' }}>Sin datos</div>;
  }

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  const width = 100;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: ((max - d.value) / range) * 80 + 10,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg
        viewBox={`0 0 ${width} 100`}
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        {/* Área bajo la curva */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${width} 100 L 0 100 Z`}
          fill="url(#gradient)"
          style={{
            opacity: animated ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
        {/* Línea */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: animated ? 0 : 1000,
            strokeDashoffset: animated ? 0 : 1000,
            transition: 'stroke-dashoffset 1.5s ease',
          }}
        />
        {/* Puntos */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2"
            fill={color}
            style={{
              opacity: animated ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 0.1}s`,
            }}
          />
        ))}
      </svg>

      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: 'var(--color-slate-500)',
      }}>
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

// Gráfico de barras
export const BarChart = ({ data, color = '#10b981' }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-slate-400)' }}>Sin datos</div>;
  }

  const max = Math.max(...data.map(d => d.value));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', padding: '1rem 0' }}>
      {data.map((d, i) => {
        const percentage = (d.value / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
              <div style={{
                height: animated ? `${percentage}%` : '0%',
                backgroundColor: color,
                borderRadius: '0.5rem 0.5rem 0 0',
                transition: `height 0.8s ease ${i * 0.1}s`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '0.5rem',
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '800',
                  color: 'white',
                  opacity: animated ? 1 : 0,
                  transition: `opacity 0.4s ease ${i * 0.1 + 0.5}s`,
                }}>
                  {d.value}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-slate-600)', textAlign: 'center' }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Gráfico circular (donut)
export const DonutChart = ({ percentage, size = 120, color = '#f59e0b', label }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? (percentage / 100) * circumference : 0);

  const center = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Círculo de fondo */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-slate-200)"
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progreso */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: 'stroke-dashoffset 1s ease',
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-slate-900)' }}>
          {animated ? percentage : 0}%
        </span>
        {label && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textAlign: 'center', marginTop: '0.25rem' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// Stat visualizada con tendencia
export const TrendStat = ({ value, label, trend, trendValue, icon: Icon, color = '#f59e0b' }) => {
  const isPositive = trend === 'up';

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-slate-200)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          backgroundColor: `${color}15`,
          borderRadius: 'var(--radius-sm)',
        }}>
          {Icon && <Icon size={24} color={color} />}
        </div>
        {trendValue && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: isPositive ? 'var(--color-emerald-600)' : '#dc2626',
          }}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-slate-900)', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
        {label}
      </div>
    </div>
  );
};
