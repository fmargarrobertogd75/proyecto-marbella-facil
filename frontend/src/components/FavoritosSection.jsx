import { useState, useEffect } from 'react';
import { Heart, Trash2, Share2, MapPin, Clock } from 'lucide-react';

export default function FavoritosSection() {
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [mostrarVacio, setMostrarVacio] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('marbella_usuario');
    if (stored) setUsuario(JSON.parse(stored));

    // Cargar favoritos del localStorage
    const favSaved = localStorage.getItem('marbella_favoritos');
    if (favSaved) {
      setFavoritos(JSON.parse(favSaved));
      setMostrarVacio(false);
    }
  }, []);

  const eliminarFavorito = (id) => {
    const updated = favoritos.filter(f => f.id !== id);
    setFavoritos(updated);
    localStorage.setItem('marbella_favoritos', JSON.stringify(updated));
    if (updated.length === 0) setMostrarVacio(true);
  };

  const compartir = (favorito) => {
    const text = `Mira este lugar en Marbella Fácil: ${favorito.nombre} - ${favorito.municipio}`;
    if (navigator.share) {
      navigator.share({ title: 'Marbella Fácil', text });
    } else {
      alert(text);
    }
  };

  if (!usuario) {
    return (
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'var(--color-slate-50)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Heart size={60} color="var(--color-slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-slate-700)' }}>
            Inicia sesión para ver tus favoritos
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate-500)', marginBottom: '2rem' }}>
            Guarda tus lugares favoritos y accede a ellos en cualquier momento
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: 'white',
      borderTop: '1px solid var(--color-slate-200)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: 'var(--color-slate-900)',
          }}>
            ❤️ Mis Favoritos
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-slate-500)' }}>
            {favoritos.length} lugar{favoritos.length !== 1 ? 'es' : ''} guardado{favoritos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {mostrarVacio ? (
          <div style={{
            backgroundColor: 'var(--color-slate-50)',
            borderRadius: 'var(--radius-md)',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '2px dashed var(--color-slate-300)',
          }}>
            <Heart size={48} color="var(--color-slate-400)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.125rem', color: 'var(--color-slate-500)', fontWeight: '600' }}>
              Aún no tienes favoritos. ¡Empieza a guardar lugares!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {favoritos.map((fav, idx) => (
              <div key={fav.id} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-slate-200)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'linear-gradient(135deg, var(--color-amber-50) 0%, var(--color-blue-50) 100%)',
                  borderBottom: '1px solid var(--color-slate-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--color-slate-900)' }}>
                      {fav.nombre}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} /> {fav.municipio}
                    </p>
                  </div>
                  <Heart size={20} color="var(--color-red-500)" fill="var(--color-red-500)" />
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.5rem' }}>
                  {fav.descripcion && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {fav.descripcion.substring(0, 100)}...
                    </p>
                  )}

                  {fav.tipo && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--color-amber-100)',
                        color: 'var(--color-amber-800)',
                        textTransform: 'capitalize',
                      }}>
                        📌 {fav.tipo}
                      </span>
                    </div>
                  )}

                  {/* Meta agregada */}
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> Guardado hace poco
                  </p>
                </div>

                {/* Acciones */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--color-slate-200)',
                  backgroundColor: 'var(--color-slate-50)',
                }}>
                  <button
                    onClick={() => compartir(fav)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '2px solid var(--color-blue-300)',
                      backgroundColor: 'white',
                      color: 'var(--color-blue-600)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-blue-50)';
                      e.currentTarget.style.borderColor = 'var(--color-blue-500)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = 'var(--color-blue-300)';
                    }}
                  >
                    <Share2 size={16} /> Compartir
                  </button>
                  <button
                    onClick={() => eliminarFavorito(fav.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '2px solid var(--color-red-300)',
                      backgroundColor: 'white',
                      color: 'var(--color-red-600)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-red-50)';
                      e.currentTarget.style.borderColor = 'var(--color-red-500)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = 'var(--color-red-300)';
                    }}
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
