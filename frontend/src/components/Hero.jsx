import React from 'react';
import { Search } from 'lucide-react';

const Hero = () => {
    return (
        <header className="hero">
            <div className="hero-bg">
                <img src="/arc_19643_g.webp" alt="Marbella" />
                <div className="hero-overlay"></div>
            </div>
            <div className="hero-content">
                <span className="hero-subtitle" style={{color: 'var(--color-amber-400)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '1.5rem'}}>La Guía Oficial</span>
                <h1 className="hero-title">
                    Bienvenido a <br />
                    <span>Marbella</span>
                </h1>
                <div className="search-container">
                    <Search color="rgba(255,255,255,0.7)" style={{ marginLeft: '1rem' }} />
                    <input type="text" className="search-input" placeholder="Encuentra restaurantes, playas o eventos..." />
                    <button className="search-btn">Explorar</button>
                </div>
            </div>
        </header>
    );
};

export default Hero;