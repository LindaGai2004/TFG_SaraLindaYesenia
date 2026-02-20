import { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

export default function Jefes({ 
  jefes, 
  onAddJefe, 
  onEditJefe, 
  onDeleteJefe }) 
  {
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState(null);

  const filtered = useMemo(() => 
    jefes.filter(j =>
      `${j.nombre} ${j.apellidos} ${j.email} ${j.username}`.toLowerCase().includes(search.toLowerCase())
    ), [jefes, search]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Jefe</h2>
        </div>
        <button 
        onClick={() => setFormModal({ type: 'add' })} 
        className="btn btn-primary">
          <Plus size={14} /> Añadir
        </button>
      </div>

      <div className="search-wrapper mb-4">
        <Search size={15} className="search-icon" />
        <input 
        placeholder="Buscar por nombre, apellidos, email, usarname..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="input-field search-input" />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Username</th>
              <th>Dirección</th>
              <th>Fecha registro</th>
              <th>Fecha nacimiento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id}>
                <td><div className="table-avatar bg-amber-light">👔</div></td>
                <td className="text-xs font-semibold text-primary">{j.nombre}</td>
                <td className="text-xs text-primary">{j.apellidos}</td>
                <td className="text-xs text-secondary">{j.email}</td>
                <td className="text-xs text-secondary">{j.username}</td>
                <td className="text-xs text-secondary">{j.direccion}</td>
                <td className="text-xs text-secondary">{j.fechaRegistro}</td>
                <td className="text-xs text-secondary">{j.fechaNacimiento}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => setFormModal({ type: 'edit', data: j })} className="btn-icon edit">
                      <Edit size={16} color="#2d6a4f" />
                    </button>
                    <button onClick={() => onDeleteJefe(j.idUsuario)} className="btn-icon delete">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formModal && (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title={formModal.type === 'add' ? '➕ Añadir' : '✏️ Modificar'}>
          <StaffForm initial={formModal.data} onSave={d => { formModal.type === 'add' ? onAddJefe(d) : onEditJefe(formModal.data.email, d); setFormModal(null); }} />
        </Modal>
      )}
    </div>
  );
}

function StaffForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || { 
      nombre: '', 
      apellidos: '', 
      email: '', 
      username: '', 
      password: '',
      direccion: '', 
      fechaNacimiento:''});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="form-row">

        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input 
          value={form.nombre} 
          onChange={e => set('nombre', e.target.value)} 
          className="input-field" /></div>

        <div className="form-group">
          <label className="form-label">Apellidos</label>
          <input 
          value={form.apellidos} 
          onChange={e => set('apellidos', e.target.value)} 
          className="input-field" /></div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input 
        value={form.email} 
        onChange={e => set('email', e.target.value)} 
        className="input-field" /></div>

      <div className="form-group">
        <label className="form-label">Username</label>
        <input 
        value={form.username} 
        onChange={e => set('username', e.target.value)} 
        className="input-field" /></div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          value={form.password || ''}
          onChange={e => set('password', e.target.value)}
          className="input-field"
          placeholder="Introduce contraseña"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Dirección</label>
        <input 
        value={form.direccion} 
        onChange={e => set('direccion', e.target.value)} 
        className="input-field" /></div>

      <div className="form-group">
        <label className="form-label">Fecha nacimiento</label>
        <input 
        type="date" 
        value={form.fechaNacimiento} 
        onChange={e => set('fechaNacimiento', e.target.value)} 
        className="input-field" /></div>
      <button 
      onClick={() => onSave(form)} 
      className="btn btn-primary w-full mt-2">{initial ? 'Guardar' : 'Añadir'}</button>
    </div>
  );
}