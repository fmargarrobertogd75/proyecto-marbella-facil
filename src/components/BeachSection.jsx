import React from 'react';
import { Flag, Thermometer, User, CheckCircle, AlertCircle } from 'lucide-react';

const BeachCard = ({ name, img, temp, occupancy, status, icon: Icon, iconColor }) => (
  <div className="card-playa">
    <img src={img} alt={name} />
    <div className="card-gradient"></div>
    <div className="flag-icon" style={{color: name.includes('Nikki') ? '#fbbf24' : '#10b981'}}>
      <Flag fill="currentColor" size={18} />
    </div>
    <div className="card-info">
      <h3 className="card-name">{name}</h3>
      <div className="stats-row">
        <div className="stat-item">
          <Thermometer color="#fbbf24" size={18} />
          <span className="stat-val">{temp}</span>
        </div>
        <div className="stat-item">
          <User color="#60a5fa" size={18} />
          <span className="stat-val">{occupancy}</span>
        </div>
        <div className="stat-item">
          <Icon color={iconColor} size={18} />
          <span className="stat-val">{status}</span>
        </div>
      </div>
    </div>
  </div>
);

const BeachSection = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Estado de las Playas</h2>
          <p className="section-desc">Datos destacados. <a href="#" className="link-arrow">Ver mapa completo →</a></p>
        </div>
        <div className="grid-3">
          <BeachCard name="Playa de Nagüeles" img="/arc_19643_g.webp" temp="21°C" occupancy="Media" status="Limpio" icon={CheckCircle} iconColor="#10b981" />
          <BeachCard name="Nikki Beach" img="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800" temp="22°C" occupancy="Alta" status="Limpio" icon={CheckCircle} iconColor="#10b981" />
          <BeachCard name="Dunas de Cabopino" img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" temp="20.5°C" occupancy="Baja" status="Medusas" icon={AlertCircle} iconColor="#f87171" />
        </div>
      </div>
    </section>
  );
};

export default BeachSection;