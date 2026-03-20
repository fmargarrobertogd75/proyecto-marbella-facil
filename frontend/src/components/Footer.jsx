import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, MapPin, Mail, Phone } from 'lucide-react';

const NAV_DISCOVER = [
    { to: '/playas', label: 'Playas' },
    { to: '/gastronomia', label: 'Gastronomía' },
    { to: '/transporte', label: 'Transporte' },
    { to: '/agenda', label: 'Agenda Cultural' },
];

const NAV_COMPANY = [
    { to: '/empresas', label: 'Para Empresas' },
    { to: '/login', label: 'Iniciar Sesión' },
    { to: '/contacto', label: 'Contacto' },
];

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Columna — Marca */}
                    <div className="footer-brand">
                        <Link to="/" className="logo" style={{ fontSize: '1.6rem' }}>
                            Marbella<span> Fácil</span>
                        </Link>
                        <p>
                            La guía oficial de la Costa del Sol. Descubre playas, restaurantes,
                            transporte y eventos en Marbella de forma rápida y sencilla.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Columna — Descubrir */}
                    <div className="footer-col">
                        <h4>Descubrir</h4>
                        <ul>
                            {NAV_DISCOVER.map(({ to, label }) => (
                                <li key={to}><Link to={to}>{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna — Empresa */}
                    <div className="footer-col">
                        <h4>Empresa</h4>
                        <ul>
                            {NAV_COMPANY.map(({ to, label }) => (
                                <li key={to}><Link to={to}>{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna — Contacto */}
                    <div className="footer-col">
                        <h4>Contacto</h4>
                        <ul style={{ gap: '0.75rem' }}>
                            <li>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-slate-400)' }}>
                                    <MapPin size={14} style={{ flexShrink: 0 }} />
                                    Marbella, Málaga, España
                                </span>
                            </li>
                            <li>
                                <a
                                    href="mailto:hola@marbellafacil.es"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-slate-400)' }}
                                >
                                    <Mail size={14} style={{ flexShrink: 0 }} />
                                    hola@marbellafacil.es
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barra inferior */}
            <div className="footer-bottom">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p>© 2025 Marbella Fácil — Proyecto Fin de Grado.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Cookies</a>
                        <a href="#">Aviso Legal</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;