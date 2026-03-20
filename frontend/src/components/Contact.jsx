import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { mensajesApi } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', asunto: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await mensajesApi.send({
        nombre: `${form.nombre} ${form.apellidos}`.trim(),
        email: form.email,
        asunto: form.asunto,
        mensaje: form.mensaje,
      });
      setSuccess(true);
      setForm({ nombre: '', apellidos: '', email: '', asunto: '', mensaje: '' });
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('No hay conexión con el servidor. Verifica que Laravel está corriendo.');
      } else {
        setError('Error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 className="section-title">
            Contacto <span style={{ color: 'var(--color-amber-500)' }}>Marbella Fácil</span>
          </h1>
          <p className="section-desc">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info de contacto */}
          <div className="contact-info-card">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Hablemos</h2>
            <p style={{ color: 'var(--color-slate-400)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Puedes ponerte en contacto con nosotros a través del formulario o directamente por cualquiera de los canales a continuación.
            </p>

            {[
              { icon: Mail, label: 'Email', value: 'hola@marbellafacil.es', href: 'mailto:hola@marbellafacil.es' },
              { icon: Phone, label: 'Teléfono', value: '+34 952 00 00 00', href: 'tel:+34952000000' },
              { icon: MapPin, label: 'Dirección', value: 'Marbella, Málaga, España', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="contact-info-item">
                <div className="contact-info-icon"><Icon size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</div>
                  {href
                    ? <a href={href} style={{ color: 'white', fontSize: '0.95rem' }}>{value}</a>
                    : <span style={{ color: 'white', fontSize: '0.95rem' }}>{value}</span>
                  }
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(245,158,11,0.1)', borderRadius: '0.75rem', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ color: 'var(--color-amber-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                ⏰ Tiempo de respuesta habitual: &lt; 24 horas laborables.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="contact-form-card">
            <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.75rem', color: 'var(--color-slate-900)' }}>
              Envíanos un mensaje
            </h3>

            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f0fdf4', borderRadius: '1rem', border: '1px solid #bbf7d0' }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h4 style={{ fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>¡Mensaje enviado!</h4>
                <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>Nos pondremos en contacto contigo pronto.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn btn-dark"
                  style={{ marginTop: '1.5rem' }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  {['nombre', 'apellidos'].map(field => (
                    <div key={field} className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type="text"
                        name={field}
                        className="form-input"
                        style={{ paddingLeft: '1rem' }}
                        placeholder={field === 'nombre' ? 'Tu nombre' : 'Tus apellidos'}
                        value={form[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Asunto</label>
                  <input
                    type="text"
                    name="asunto"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="¿En qué podemos ayudarte?"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mensaje</label>
                  <textarea
                    name="mensaje"
                    className="textarea-input"
                    placeholder="Escribe tu mensaje aquí..."
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark"
                  style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                >
                  <Send size={16} />
                  {loading ? 'Enviando…' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;