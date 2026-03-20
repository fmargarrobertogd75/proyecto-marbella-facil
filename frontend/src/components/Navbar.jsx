import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { authApi } from '../services/api';

const NAV_LINKS = [
    { to: '/playas', label: 'Playas' },
    { to: '/transporte', label: 'Transporte' },
    { to: '/gastronomia', label: 'Gastronomía' },
    { to: '/agenda', label: 'Agenda' },
    { to: '/recompensas', label: 'Recompensas' },
    { to: '/contacto', label: 'Contacto' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenu] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Detectar sesión activa desde localStorage
    useEffect(() => {
        const stored = localStorage.getItem('marbella_usuario');
        if (stored) {
            try { setUsuario(JSON.parse(stored)); }
            catch { localStorage.removeItem('marbella_usuario'); }
        }
        // Escuchar cambios de sesión (misma pestaña y otras pestañas)
        const handler = () => {
            const s = localStorage.getItem('marbella_usuario');
            setUsuario(s ? JSON.parse(s) : null);
        };
        window.addEventListener('storage', handler);
        window.addEventListener('marbella:auth:changed', handler);
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener('marbella:auth:changed', handler);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try { await authApi.logout(); } catch { /* silencioso */ }
        localStorage.removeItem('marbella_token');
        localStorage.removeItem('marbella_usuario');
        setUsuario(null);
        setUserMenuOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const initials = (nombre = '') =>
        nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${location.pathname !== '/' && !scrolled ? 'navbar-dark' : ''}`}>
            <div className="container navbar-content">

                {/* Logo */}
                <Link to="/" className="logo">Marbella<span> Fácil</span></Link>

                {/* Menú escritorio */}
                <div className="nav-menu">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link key={to} to={to} className={isActive(to) ? 'nav-link-active' : ''}>{label}</Link>
                    ))}
                </div>

                {/* Acciones */}
                <div className="nav-actions">
                    <Link to="/empresas" className="link-empresa">Soy Empresa</Link>

                    {usuario ? (
                        /* Usuario logueado */
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '2rem', padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                                    cursor: 'pointer', color: 'inherit', fontFamily: 'var(--font-sans)',
                                }}
                                aria-label="Menú de usuario"
                            >
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%', background: 'var(--marbella-gold)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.7rem', color: 'white',
                                }}>
                                    {initials(usuario.nombre)}
                                </div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {usuario.nombre}
                                </span>
                                <ChevronDown size={13} />
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                                    background: 'white', border: '1px solid var(--color-slate-200)',
                                    borderRadius: '0.75rem', boxShadow: 'var(--shadow-lg)',
                                    minWidth: 200, zIndex: 1000, overflow: 'hidden',
                                }}>
                                    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-slate-100)', background: 'var(--color-slate-50)' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)' }}>{usuario.nombre}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>{usuario.email}</div>
                                        <span style={{ fontSize: '0.65rem', background: 'var(--marbella-gold)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 700, marginTop: '0.3rem', display: 'inline-block' }}>
                                            {usuario.rol}
                                        </span>
                                    </div>
                                    <Link
                                        to="/perfil"
                                        onClick={() => setUserMenuOpen(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: 'var(--color-slate-700)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}
                                    >
                                        <User size={15} color="var(--marbella-gold)" /> Mi Perfil
                                    </Link>
                                    {usuario.rol === 'empresa' && (
                                        <Link
                                            to="/negocio/dashboard"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: 'var(--color-slate-700)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}
                                        >
                                            <Shield size={15} color="var(--marbella-gold)" /> Panel Negocio
                                        </Link>
                                    )}
                                    {usuario.rol === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: 'var(--color-slate-700)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}
                                        >
                                            <Shield size={15} color="var(--marbella-gold)" /> Panel Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, borderTop: '1px solid var(--color-slate-100)' }}
                                    >
                                        <LogOut size={15} /> Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* No logueado */
                        <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
                    )}
                </div>

                {/* Botón mobile */}
                <button
                    className="mobile-btn"
                    onClick={() => setMobileMenu(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Menú móvil */}
            <div id="mobile-menu" className={mobileMenuOpen ? 'flex' : 'hidden'} onClick={() => setMobileMenu(false)}>
                {NAV_LINKS.map(({ to, label }) => (
                    <Link key={to} to={to} className={isActive(to) ? 'nav-link-active' : ''}>{label}</Link>
                ))}
                <Link to="/empresas" style={{ color: 'var(--color-amber-400)', fontWeight: 700 }}>Soy Empresa</Link>
                {usuario ? (
                    <>
                        {usuario.rol === 'admin' && (
                            <Link to="/admin" style={{ color: 'var(--color-slate-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Shield size={14} /> Admin
                            </Link>
                        )}
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                            <LogOut size={14} /> Cerrar sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', textAlign: 'center', borderRadius: '0.5rem' }}>
                        Iniciar Sesión
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;