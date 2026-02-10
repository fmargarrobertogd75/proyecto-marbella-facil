import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                    Marbella<span> Fácil</span>
                </Link>

                <div className="nav-menu">
                    <Link to="/">Playas</Link>
                    <Link to="/">Transporte</Link>
                    <Link to="/">Gastronomía</Link>
                    <Link to="/">Agenda</Link> 
                    <Link to="/contacto">Contacto</Link>
                </div>

                <div className="nav-actions">
                    <Link to="/contacto" className="link-empresa">Soy Empresa</Link>
                    <button className="btn btn-primary">Iniciar Sesión</button>
                </div>

                <button className="mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div id="mobile-menu" className={mobileMenuOpen ? 'flex' : 'hidden'}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Playas</Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Transporte</Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Gastronomía</Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Agenda</Link>
                <Link to="/contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
            </div>
        </nav>
    );
};

export default Navbar;