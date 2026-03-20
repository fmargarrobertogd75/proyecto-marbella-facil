import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { authApi } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(form);
      // Guardar token y datos de usuario
      localStorage.setItem('marbella_token', res.data.token);
      localStorage.setItem('marbella_usuario', JSON.stringify(res.data.usuario));
      // Notificar al resto de la app (misma pestaña) del cambio de sesión
      window.dispatchEvent(new Event('marbella:auth:changed'));
      navigate('/perfil');
    } catch (err) {
      if (err.response?.status === 422) {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.status === 403) {
        setError('Cuenta suspendida. Contacta con el administrador.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('No se puede conectar con el servidor. ¿Está Laravel ejecutándose?');
      } else {
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-slate-900)' }}>
            Marbella <span style={{ color: 'var(--marbella-gold)' }}>Fácil</span>
          </h1>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Accede a tu cuenta
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem',
            padding: '0.875rem 1rem', color: '#b91c1c', marginBottom: '1.5rem',
            fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="form-input"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)', padding: 0 }}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Olvidé contraseña */}
          <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Iniciando sesión…' : <><LogIn size={16} /> Iniciar sesión</>}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0', color: 'var(--color-slate-300)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-slate-200)' }} />
          ¿No tienes cuenta?
          <div style={{ flex: 1, height: '1px', background: 'var(--color-slate-200)' }} />
        </div>

        <Link
          to="/contacto"
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Regístrate gratis
        </Link>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--color-slate-400)' }}>
          ¿Eres empresa? <Link to="/empresas" style={{ color: 'var(--marbella-gold)', fontWeight: 700 }}>Ver planes de negocio</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;