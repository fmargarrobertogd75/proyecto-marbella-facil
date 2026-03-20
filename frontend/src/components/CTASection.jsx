import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="cta-section">
            <div className="cta-pattern"></div>
            <div className="container cta-content">
                <div className="badge" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#fcd34d', marginBottom: '2rem' }}>
                    MARBELLA FÁCIL BUSINESS
                </div>
                <h2 className="cta-title">
                    Impulsa tu negocio en la <br />
                    <span className="cta-grad-text">Era Digital</span>
                </h2>
                <p className="cta-text">
                    Únete a la plataforma líder. Gestiona reservas, publica ofertas
                    y conecta con miles de turistas cada día.
                </p>
                <div className="cta-buttons">
                    <Link to="/empresas" className="btn btn-gold">
                        Registrar mi Negocio
                    </Link>
                    <Link to="/empresas" className="btn btn-outline-light">
                        Ver Planes
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTASection;