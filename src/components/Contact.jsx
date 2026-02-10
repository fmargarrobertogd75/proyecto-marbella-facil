import React from 'react';

const Contact = () => {
  return (
    <div className="container section center-text" style={{ paddingTop: '150px' }}>
      <h2 className="section-title">Contacto <span>Marbella Fácil</span></h2>
      <p className="section-desc">Página de contacto del portal Smart City.</p>
      <div className="filter-box" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>Para cualquier consulta sobre el proyecto:</p>
        <p><strong>Email:</strong> contacto@marbellafacil.es</p>
      </div>
    </div>
  );
};

export default Contact;