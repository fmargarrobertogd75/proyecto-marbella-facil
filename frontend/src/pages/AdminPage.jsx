import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, Search, Plus, Pencil, Trash2, Key,
    X, Check, Loader2, AlertTriangle, Eye, EyeOff, ChevronLeft, ChevronRight
} from 'lucide-react';
import { adminApi, authApi } from '../services/api';

/* ─── CONSTANTES ─────────────────────────────────── */
const ROLES = ['admin', 'usuario', 'empresa'];
const NIVELES = ['Turista Novato', 'Explorador', 'Conocedor', 'Embajador', 'Élite'];
const ROW_BG = { admin: '#fef3c7', empresa: '#eff6ff', usuario: 'white' };

/* ─── MODAL GENÉRICO ─────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
    <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
    >
        <div style={{
            background: 'white', borderRadius: '1.25rem', boxShadow: 'var(--shadow-xl)',
            width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
        }}>
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--color-slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-slate-900)' }}>{title}</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.5rem' }}>
                    <X size={20} color="var(--color-slate-500)" />
                </button>
            </div>
            <div style={{ padding: '1.5rem 1.75rem' }}>{children}</div>
        </div>
    </div>
);

/* ─── CAMPO DE FORMULARIO ────────────────────────── */
const Field = ({ label, children, hint }) => (
    <div style={{ marginBottom: '1.1rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-slate-700)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
        </label>
        {children}
        {hint && <p style={{ fontSize: '0.73rem', color: 'var(--color-slate-400)', marginTop: '0.25rem' }}>{hint}</p>}
    </div>
);

const inputStyle = {
    width: '100%', padding: '0.65rem 0.875rem', border: '1.5px solid var(--color-slate-200)',
    borderRadius: '0.6rem', fontSize: '0.9rem', color: 'var(--color-slate-800)',
    fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};
const selectStyle = { ...inputStyle, background: 'white' };

/* ────────────────────────────────────────────────── */
const AdminPage = () => {
    const navigate = useNavigate();

    /* Estado global */
    const [usuario, setUsuario] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [meta, setMeta] = useState({ total: 0, per_page: 15, current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    /* Modales */
    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState(null);   // usuario a editar
    const [modalPass, setModalPass] = useState(null);   // usuario a cambiar clave
    const [modalBorrar, setModalBorrar] = useState(null);   // usuario a borrar
    const [modalVer, setModalVer] = useState(null);   // usuario detallado

    /* Formularios */
    const blankForm = { nombre: '', email: '', password: '', rol: 'usuario', nivel_usuario: 'Turista Novato', puntos_fidelidad: 0, acepta_terminos: true, activo: true, marketing_consent: false };
    const [form, setForm] = useState(blankForm);
    const [newPass, setNewPass] = useState({ password: '', password_confirmation: '' });
    const [showPass, setShowPass] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    /* ── Verificar autenticación ── */
    useEffect(() => {
        const stored = localStorage.getItem('marbella_usuario');
        if (!stored) { navigate('/login'); return; }
        const u = JSON.parse(stored);
        if (u.rol !== 'admin') { navigate('/'); return; }
        setUsuario(u);
        setAuthLoading(false);
    }, []);

    /* ── Cargar usuarios ── */
    const loadUsuarios = useCallback(async (page = 1, q = search) => {
        setLoading(true);
        setError('');
        try {
            const res = await adminApi.getUsuarios({ page, search: q, per_page: 12 });
            const body = res.data;
            if (body.data) {
                setUsuarios(body.data);
                setMeta({ total: body.total, per_page: body.per_page, current_page: body.current_page, last_page: body.last_page });
            } else {
                setUsuarios(Array.isArray(body) ? body : []);
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Error al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => { if (!authLoading) loadUsuarios(); }, [authLoading]);

    /* ── Búsqueda con debounce ── */
    useEffect(() => {
        const t = setTimeout(() => { if (!authLoading) loadUsuarios(1, search); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    /* ── Helpers formulario ── */
    const handleFormChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    /* ── CREAR usuario ── */
    const handleCrear = async e => {
        e.preventDefault();
        setSaving(true); setFormError('');
        try {
            await adminApi.createUsuario(form);
            setModalCrear(false);
            setForm(blankForm);
            loadUsuarios();
        } catch (e) {
            const errs = e.response?.data?.errors;
            setFormError(errs ? Object.values(errs).flat().join(' ') : e.response?.data?.message || 'Error al crear usuario.');
        } finally { setSaving(false); }
    };

    /* ── EDITAR usuario ── */
    const abrirEditar = u => { setForm({ ...blankForm, ...u, password: '' }); setModalEditar(u); setFormError(''); };
    const handleEditar = async e => {
        e.preventDefault();
        setSaving(true); setFormError('');
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        try {
            await adminApi.updateUsuario(modalEditar.id, payload);
            setModalEditar(null);
            loadUsuarios();
        } catch (e) {
            const errs = e.response?.data?.errors;
            setFormError(errs ? Object.values(errs).flat().join(' ') : e.response?.data?.message || 'Error al actualizar usuario.');
        } finally { setSaving(false); }
    };

    /* ── CAMBIAR CONTRASEÑA ── */
    const handleCambiarPass = async e => {
        e.preventDefault();
        setSaving(true); setFormError('');
        try {
            await adminApi.changePassword(modalPass.id, newPass);
            setModalPass(null);
            setNewPass({ password: '', password_confirmation: '' });
        } catch (e) {
            const errs = e.response?.data?.errors;
            setFormError(errs ? Object.values(errs).flat().join(' ') : e.response?.data?.message || 'Error al cambiar contraseña.');
        } finally { setSaving(false); }
    };

    /* ── BORRAR usuario ── */
    const handleBorrar = async () => {
        setSaving(true);
        try {
            await adminApi.deleteUsuario(modalBorrar.id);
            setModalBorrar(null);
            loadUsuarios();
        } catch { setError('No se pudo eliminar el usuario.'); }
        finally { setSaving(false); }
    };

    /* ─────────────── RENDER ─────────────────────── */
    if (authLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--marbella-gold)' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-slate-50)', paddingTop: '6rem' }}>
            <div className="container" style={{ maxWidth: 1200 }}>

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 44, height: 44, background: 'var(--marbella-gold)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={22} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-slate-900)', lineHeight: 1.1 }}>Panel de Administración</h1>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>Marbella Fácil · {usuario?.nombre}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)' }}>
                            {meta.total} usuario{meta.total !== 1 ? 's' : ''} totales
                        </span>
                        <button
                            onClick={() => { setForm(blankForm); setFormError(''); setModalCrear(true); }}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.87rem', padding: '0.6rem 1.1rem' }}
                        >
                            <Plus size={16} /> Nuevo usuario
                        </button>
                    </div>
                </div>

                {/* ── BUSCADOR ── */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre, email o rol…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '2.5rem', maxWidth: 420 }}
                    />
                </div>

                {error && (
                    <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#b91c1c', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}

                {/* ── TABLA ── */}
                <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid var(--color-slate-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
                            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                            Cargando usuarios…
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-slate-400)' }}>
                            <Users size={40} style={{ marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem', opacity: 0.4 }} />
                            No se encontraron usuarios{search ? ` para "${search}"` : ''}.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-slate-100)', background: 'var(--color-slate-50)' }}>
                                        {['#', 'Nombre', 'Email', 'Rol', 'Nivel', 'Puntos', 'Estado', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '0.875rem 1rem', textAlign: h === '#' || h === 'Puntos' || h === 'Estado' ? 'center' : 'left', fontWeight: 700, color: 'var(--color-slate-600)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-slate-100)', background: ROW_BG[u.rol] || 'white', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = ROW_BG[u.rol] || 'white'}
                                        >
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--color-slate-400)', fontWeight: 600, fontSize: '0.8rem' }}>{u.id}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--marbella-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: 'white', flexShrink: 0 }}>
                                                        {(u.nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: 'var(--color-slate-800)' }}>{u.nombre}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--color-slate-600)' }}>{u.email}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: u.rol === 'admin' ? '#fde68a' : u.rol === 'empresa' ? '#bfdbfe' : '#e2e8f0', color: u.rol === 'admin' ? '#92400e' : u.rol === 'empresa' ? '#1e40af' : '#475569' }}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', color: 'var(--color-slate-600)', fontSize: '0.82rem' }}>{u.nivel_usuario || '—'}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--marbella-gold)' }}>{u.puntos_fidelidad ?? 0}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: u.activo ? '#dcfce7' : '#fee2e2', color: u.activo ? '#166534' : '#991b1b' }}>
                                                    {u.activo ? <><Check size={10} /> Activo</> : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => setModalVer(u)} title="Ver detalles" style={{ border: 'none', background: 'var(--color-slate-100)', borderRadius: '0.45rem', padding: '0.35rem 0.6rem', cursor: 'pointer', color: 'var(--color-slate-600)' }}>
                                                        <Eye size={14} />
                                                    </button>
                                                    <button onClick={() => abrirEditar(u)} title="Editar" style={{ border: 'none', background: '#eff6ff', borderRadius: '0.45rem', padding: '0.35rem 0.6rem', cursor: 'pointer', color: '#2563eb' }}>
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => { setFormError(''); setNewPass({ password: '', password_confirmation: '' }); setModalPass(u); }} title="Cambiar contraseña" style={{ border: 'none', background: '#fef9c3', borderRadius: '0.45rem', padding: '0.35rem 0.6rem', cursor: 'pointer', color: '#ca8a04' }}>
                                                        <Key size={14} />
                                                    </button>
                                                    {u.id !== usuario?.id && (
                                                        <button onClick={() => setModalBorrar(u)} title="Eliminar" style={{ border: 'none', background: '#fef2f2', borderRadius: '0.45rem', padding: '0.35rem 0.6rem', cursor: 'pointer', color: '#dc2626' }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {meta.last_page > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', borderTop: '1px solid var(--color-slate-100)' }}>
                            <button
                                disabled={meta.current_page === 1}
                                onClick={() => loadUsuarios(meta.current_page - 1)}
                                style={{ padding: '0.4rem 0.7rem', border: '1px solid var(--color-slate-200)', borderRadius: '0.5rem', cursor: 'pointer', background: 'white', opacity: meta.current_page === 1 ? 0.4 : 1 }}
                            ><ChevronLeft size={16} /></button>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                                Página {meta.current_page} de {meta.last_page}
                            </span>
                            <button
                                disabled={meta.current_page === meta.last_page}
                                onClick={() => loadUsuarios(meta.current_page + 1)}
                                style={{ padding: '0.4rem 0.7rem', border: '1px solid var(--color-slate-200)', borderRadius: '0.5rem', cursor: 'pointer', background: 'white', opacity: meta.current_page === meta.last_page ? 0.4 : 1 }}
                            ><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>

                {/* ─── MODAL: VER USUARIO ─── */}
                {modalVer && (
                    <Modal title="Detalle de usuario" onClose={() => setModalVer(null)}>
                        {[
                            ['ID', modalVer.id],
                            ['Nombre', modalVer.nombre],
                            ['Email', modalVer.email],
                            ['Rol', modalVer.rol],
                            ['Nivel', modalVer.nivel_usuario],
                            ['Puntos', modalVer.puntos_fidelidad],
                            ['Estado', modalVer.activo ? 'Activo' : 'Inactivo'],
                            ['Acepta términos', modalVer.acepta_terminos ? 'Sí' : 'No'],
                            ['Marketing', modalVer.marketing_consent ? 'Sí' : 'No'],
                            ['Creado', modalVer.created_at ? new Date(modalVer.created_at).toLocaleString('es-ES') : '—'],
                            ['Último acceso', modalVer.last_login ? new Date(modalVer.last_login).toLocaleString('es-ES') : '—'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--color-slate-100)', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--color-slate-600)' }}>{k}</span>
                                <span style={{ color: 'var(--color-slate-800)' }}>{String(v ?? '—')}</span>
                            </div>
                        ))}
                    </Modal>
                )}

                {/* ─── MODAL: CREAR ─── */}
                {modalCrear && (
                    <Modal title="Nuevo Usuario" onClose={() => setModalCrear(false)}>
                        <form onSubmit={handleCrear}>
                            {formError && <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', color: '#b91c1c', marginBottom: '1rem', fontSize: '0.85rem' }}>⚠️ {formError}</div>}
                            <Field label="Nombre completo">
                                <input style={inputStyle} name="nombre" value={form.nombre} onChange={handleFormChange} required placeholder="Ej: Ana García" />
                            </Field>
                            <Field label="Email">
                                <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleFormChange} required placeholder="usuario@ejemplo.com" />
                            </Field>
                            <Field label="Contraseña" hint="Mínimo 6 caracteres">
                                <input style={inputStyle} type="password" name="password" value={form.password} onChange={handleFormChange} required minLength={6} placeholder="••••••••" />
                            </Field>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Field label="Rol">
                                    <select style={selectStyle} name="rol" value={form.rol} onChange={handleFormChange}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </Field>
                                <Field label="Nivel">
                                    <select style={selectStyle} name="nivel_usuario" value={form.nivel_usuario} onChange={handleFormChange}>
                                        {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <Field label="Puntos de fidelidad">
                                <input style={inputStyle} type="number" name="puntos_fidelidad" value={form.puntos_fidelidad} onChange={handleFormChange} min={0} />
                            </Field>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                                {[['activo', 'Cuenta activa'], ['acepta_terminos', 'Acepta términos'], ['marketing_consent', 'Acepta marketing']].map(([k, label]) => (
                                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name={k} checked={form[k]} onChange={handleFormChange} />
                                        {label}
                                    </label>
                                ))}
                            </div>
                            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                                {saving ? 'Creando…' : 'Crear usuario'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* ─── MODAL: EDITAR ─── */}
                {modalEditar && (
                    <Modal title={`Editar — ${modalEditar.nombre}`} onClose={() => setModalEditar(null)}>
                        <form onSubmit={handleEditar}>
                            {formError && <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', color: '#b91c1c', marginBottom: '1rem', fontSize: '0.85rem' }}>⚠️ {formError}</div>}
                            <Field label="Nombre completo">
                                <input style={inputStyle} name="nombre" value={form.nombre} onChange={handleFormChange} required />
                            </Field>
                            <Field label="Email">
                                <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleFormChange} required />
                            </Field>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Field label="Rol">
                                    <select style={selectStyle} name="rol" value={form.rol} onChange={handleFormChange}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </Field>
                                <Field label="Nivel">
                                    <select style={selectStyle} name="nivel_usuario" value={form.nivel_usuario} onChange={handleFormChange}>
                                        {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <Field label="Puntos de fidelidad">
                                <input style={inputStyle} type="number" name="puntos_fidelidad" value={form.puntos_fidelidad} onChange={handleFormChange} min={0} />
                            </Field>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                                {[['activo', 'Cuenta activa'], ['acepta_terminos', 'Acepta términos'], ['marketing_consent', 'Acepta marketing']].map(([k, label]) => (
                                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name={k} checked={!!form[k]} onChange={handleFormChange} />
                                        {label}
                                    </label>
                                ))}
                            </div>
                            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                {saving ? 'Guardando…' : 'Guardar cambios'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* ─── MODAL: CAMBIAR CONTRASEÑA ─── */}
                {modalPass && (
                    <Modal title={`Cambiar contraseña — ${modalPass.nombre}`} onClose={() => setModalPass(null)}>
                        <form onSubmit={handleCambiarPass}>
                            {formError && <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', color: '#b91c1c', marginBottom: '1rem', fontSize: '0.85rem' }}>⚠️ {formError}</div>}
                            <Field label="Nueva contraseña">
                                <div style={{ position: 'relative' }}>
                                    <input
                                        style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                        type={showPass ? 'text' : 'password'}
                                        value={newPass.password}
                                        onChange={e => setNewPass(p => ({ ...p, password: e.target.value }))}
                                        required minLength={6}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)' }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </Field>
                            <Field label="Confirmar contraseña">
                                <input
                                    style={inputStyle}
                                    type="password"
                                    value={newPass.password_confirmation}
                                    onChange={e => setNewPass(p => ({ ...p, password_confirmation: e.target.value }))}
                                    required
                                    placeholder="Repite la contraseña"
                                />
                            </Field>
                            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Key size={16} />}
                                {saving ? 'Guardando…' : 'Cambiar contraseña'}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* ─── MODAL: ELIMINAR ─── */}
                {modalBorrar && (
                    <Modal title="Confirmar eliminación" onClose={() => setModalBorrar(null)}>
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
                            <p style={{ fontSize: '1rem', color: 'var(--color-slate-700)', marginBottom: '0.5rem' }}>
                                ¿Eliminar el usuario <strong>{modalBorrar.nombre}</strong>?
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-400)', marginBottom: '2rem' }}>
                                Esta acción no se puede deshacer. Se eliminarán todos sus datos.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                <button onClick={() => setModalBorrar(null)} className="btn btn-outline">Cancelar</button>
                                <button onClick={handleBorrar} disabled={saving} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.6rem', padding: '0.65rem 1.25rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                                    {saving ? 'Eliminando…' : 'Sí, eliminar'}
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

            </div>
        </div>
    );
};

export default AdminPage;
