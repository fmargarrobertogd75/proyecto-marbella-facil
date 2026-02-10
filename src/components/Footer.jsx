import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-flex">
                <div>
                    <a href="#" className="logo" style={{fontSize:'1.5rem'}}>Marbella<span>.Fácil</span></a>
                    <div style={{color:'#64748b', fontSize:'0.85rem', marginTop:'0.5rem'}}>© 2025 Proyecto Fin de Grado.</div>
                </div>
                <div className="footer-links">
                    <a href="#">Privacidad</a>
                    <a href="#">Cookies</a>
                    <a href="#">Contacto</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;