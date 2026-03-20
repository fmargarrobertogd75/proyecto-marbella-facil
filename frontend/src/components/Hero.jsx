import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const Hero = () => {
    return (
        <header className="hero">
            {/* Fondo con zoom sutil */}
            <div className="hero-bg">
                <img src="/marbella-hero-oscuro.jpg" alt="Vista aérea de Marbella" />
                <div className="hero-overlay"></div>
            </div>

            {/* Contenido */}
            <div className="hero-content">
                <span className="hero-subtitle animate-fade-in">
                    ✦ La Guía Oficial de la Costa del Sol
                </span>

                <h1 className="hero-title animate-fade-in-up animate-delay-1">
                    Bienvenido a <br />
                    <span>Marbella</span>
                </h1>

                {/* Barra de búsqueda */}
                <div className="search-container animate-fade-in-up animate-delay-2">
                    <Search color="rgba(255,255,255,0.6)" size={20} style={{ marginLeft: '0.75rem', flexShrink: 0 }} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Encuentra restaurantes, playas o eventos..."
                    />
                    <button className="search-btn">Explorar</button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll-indicator">
                <div className="scroll-line"></div>
                <ChevronDown size={16} />
            </div>
        </header>
    );
};

export default Hero;