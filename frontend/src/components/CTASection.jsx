import React from 'react';

const CTASection = () => {
    return (
        <section className="cta-section">
            <div className="cta-pattern"></div>
            <div className="container cta-content">
                <div className="badge" style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#fcd34d', marginBottom: '2rem' }}>
                    MARBELLA FÁCIL BUSINESS
                </div>
                <h2 className="cta-title">Impulsa tu negocio en la <br /> <span className="cta-grad-text">Era Digital</span></h2>
                <p className="cta-text">Únete a la plataforma líder. Gestiona reservas, publica ofertas y conecta con miles de turistas.</p>
                <div className="cta-buttons">
                    <a href="empresas.html" className="btn btn-gold">Registrar mi Negocio</a>
                    <a href="empresas.html" className="btn btn-outline-light">Ver Planes</a>
                </div>
            </div>
        </section>
    );
};

export default CTASection;