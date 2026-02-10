import React from 'react';

const GastronomySection = () => {
  return (
    <section className="section center-text">
      <div className="container">
        <h2 className="section-title">Gastronomía Selecta</h2>
        <p className="section-desc" style={{ marginBottom: '2.5rem' }}>
          Descubre los mejores restaurantes de la zona.
        </p>
        <a href="gastronomia.html" className="btn btn-dark">
          Ver Directorio Completo
        </a>
      </div>
    </section>
  );
};

export default GastronomySection;