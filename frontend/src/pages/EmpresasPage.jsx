import React from 'react';
import { Check, X, Zap, Building2, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    icon: Building2,
    name: 'Básico',
    price: 'Gratis',
    period: '',
    color: 'var(--color-slate-300)',
    features: [
      { ok: true, text: 'Perfil de Negocio' },
      { ok: true, text: 'Ubicación en Mapa' },
      { ok: true, text: 'Horarios y Contacto' },
      { ok: false, text: 'Gestión de Ofertas' },
      { ok: false, text: 'Galería de Imágenes' },
      { ok: false, text: 'Prioridad en Búsquedas' },
    ],
    cta: 'Empezar Gratis',
    popular: false,
  },
  {
    icon: Zap,
    name: 'Profesional',
    price: '29,99€',
    period: '/mes',
    color: 'var(--color-amber-400)',
    features: [
      { ok: true, text: 'Todo lo de Básico' },
      { ok: true, text: 'Galería (hasta 15 fotos)' },
      { ok: true, text: 'Gestión de Ofertas' },
      { ok: true, text: 'Prioridad en Búsquedas' },
      { ok: true, text: 'Estadísticas de visitas' },
      { ok: false, text: 'Soporte premium 24/7' },
    ],
    cta: 'Seleccionar Plan',
    popular: true,
  },
  {
    icon: Crown,
    name: 'Premium',
    price: '79,99€',
    period: '/mes',
    color: '#c0a060',
    features: [
      { ok: true, text: 'Todo lo de Profesional' },
      { ok: true, text: 'Galería ilimitada' },
      { ok: true, text: 'Reservas integradas' },
      { ok: true, text: 'Posición destacada #1' },
      { ok: true, text: 'Soporte premium 24/7' },
      { ok: true, text: 'Integración con redes sociales' },
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
];

const EmpresasPage = () => {
  return (
    <div className="bg-dark" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '5rem' }}>
      <div className="container">

        {/* Cabecera */}
        <div className="pricing-header">
          <div className="badge" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--color-amber-400)', marginBottom: '1.5rem', display: 'inline-flex' }}>
            MARBELLA FÁCIL BUSINESS
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'white', marginBottom: '1rem', lineHeight: 1.15 }}>
            Digitaliza tu negocio local
          </h1>
          <p className="section-desc" style={{ color: 'var(--color-slate-400)' }}>
            Únete a más de 500 empresas en Marbella. Elige el plan que mejor se adapta a tu negocio.
          </p>
        </div>

        {/* Grid de planes */}
        <div className="pricing-grid">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">MÁS POPULAR</div>}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: `rgba(255,255,255,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={plan.color} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: plan.popular ? 'var(--color-amber-400)' : 'white' }}>
                    {plan.name}
                  </h3>
                </div>

                <div className="price" style={{ color: 'white' }}>
                  {plan.price}
                  {plan.period && <span>{plan.period}</span>}
                </div>

                <ul className="feature-list" style={{ marginBottom: '2rem' }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ color: f.ok ? 'var(--color-slate-300)' : 'var(--color-slate-600)' }}>
                      {f.ok
                        ? <Check size={16} color={plan.popular ? 'var(--color-amber-500)' : 'var(--color-emerald-500)'} />
                        : <X size={16} color="var(--color-slate-600)" />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contacto"
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', borderRadius: '0.5rem', color: plan.popular ? 'white' : 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ note */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
            ¿Tienes dudas? <Link to="/contacto" style={{ color: 'var(--color-amber-500)', fontWeight: 700 }}>Contáctanos</Link> y te ayudamos a elegir el plan ideal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpresasPage;