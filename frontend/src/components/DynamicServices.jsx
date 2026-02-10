import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicServices = () => {
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    // Llamada a API pública para completar el requisito dinámico
    axios.get('https://jsonplaceholder.typicode.com/users?_limit=3')
      .then(res => setColaboradores(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="section bg-gray center-text">
      <div className="container">
        <h2 className="section-title">Colaboradores <span>Oficiales</span></h2>
        <p className="section-desc">Entidades colaboradoras cargadas dinámicamente vía API.</p>
        
        <div className="grid-3" style={{ marginTop: '2rem' }}>
          {colaboradores.map(user => (
            <div key={user.id} className="restaurant-card" style={{ padding: '1.5rem', border: '1px solid var(--color-slate-200)' }}>
              <div style={{ background: 'var(--color-slate-900)', color: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{user.name}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>Especialidad en {user.company.bs}</p>
              <div style={{ marginTop: '1rem', color: 'var(--color-amber-600)', fontWeight: '700' }}>{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicServices;