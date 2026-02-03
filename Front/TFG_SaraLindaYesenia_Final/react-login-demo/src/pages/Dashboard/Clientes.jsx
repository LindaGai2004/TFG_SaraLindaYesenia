import { useState, useMemo } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

export default function Clientes({ clients, orders, onEditClient, onDeleteClient }) {
  const [clientSearch, setClientSearch] = useState('');
  const [popup, setPopup] = useState(null);
  const [formModal, setFormModal] = useState(null);

  const filteredClients = useMemo(() => 
    clients.filter(c =>
      `${c.nombre} ${c.apellidos} ${c.email} ${c.username}`.toLowerCase().includes(clientSearch.toLowerCase())
    ), [clients, clientSearch]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Clientes</h2>
      <p className="text-xs text-secondary mb-4">管理注册客户</p>

      <div className="search-wrapper mb-4">
        <Search size={15} className="search-icon" />
        <input
          placeholder="Buscar por nombre, apellidos, email, username ..."
          value={clientSearch}
          onChange={e => setClientSearch(e.target.value)}
          className="input-field search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Usarname</th>
              <th>Dirección</th>
              <th>Fecha registro</th>
              <th>Pedidos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(c => {
              const pedCnt = orders.filter(o => o.id_cliente === c.id).length;
              return (
                <tr key={c.id} onClick={() => setPopup({ type: 'client', data: c })} className="cursor-pointer">
                  <td>
                    <div className="table-avatar bg-green-light">👤</div>
                  </td>
                  <td className="text-xs font-semibold text-primary">{c.nombre}</td>
                  <td className="text-xs text-primary">{c.apellidos}</td>
                  <td className="text-xs text-secondary">{c.email}</td>
                  <td className="text-xs text-secondary">{c.username}</td>
                  <td className="text-xs text-secondary">{c.direccion}</td>
                  <td className="text-xs text-secondary">{c.fechaRegistro}</td>
                  <td>
                    <span className="badge badge-shipping">{pedCnt}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={e => { e.stopPropagation(); setFormModal({ type: 'edit', data: c }); }} className="btn-icon edit">
                        <Edit size={13} color="#2d6a4f" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); onDeleteClient(c.id); }} className="btn-icon delete">
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 客户详情弹窗 */}
      {popup?.type === 'client' && (
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="👤 Clientes">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-green-light">👤</div>
            <div>
              <p className="font-bold text-primary">{popup.data.nombre} {popup.data.apellidos}</p>
              <p className="text-xs text-secondary">{popup.data.username} · {popup.data.email}</p>
            </div>
          </div>
          {[
            ['Dirección', popup.data.direccion],
            ['Fecha Nacimiento', popup.data.fechaNacimiento],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className="font-semibold text-primary">{v}</span>
            </div>
          ))}
          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">Pedidos</h5>
          {orders.filter(o => o.id_cliente === popup.data.id).length === 0 ? (
            <p className="text-xs text-muted">De momento no tienes pedido</p>
          ) : (
            orders.filter(o => o.id_cliente === popup.data.id).map(o => {
              const statusStyle = {
                'Pendiente': { bg: '#fef3c7', color: '#92400e' },
                'En camino': { bg: '#dbeafe', color: '#1d4ed8' },
                'Completado': { bg: '#d1fae5', color: '#065f46' },
                'Cancelado': { bg: '#fee2e2', color: '#991b1b' }
              }[o.estado];
              return (
                <div key={o.id} className="flex items-center justify-between py-2 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <span className="font-semibold text-green">#{o.id}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={statusStyle}>{o.estado}</span>
                  <span className="font-semibold text-primary">${o.precio_total.toFixed(2)}</span>
                </div>
              );
            })
          )}
        </Modal>
      )}

      {/* 编辑客户弹窗 */}
      {formModal?.type === 'edit' && (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title="✏️ Modificar Datos">
          <ClientForm initial={formModal.data} onSave={d => { onEditClient(formModal.data.id, d); setFormModal(null); }} />
        </Modal>
      )}
    </div>
  );
}

// 客户表单
function ClientForm({ initial, onSave }) {
  const [form, setForm] = useState(initial || { nombre: '', apellidos: '', email: '', username: '', direccion: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input value={form.nombre} onChange={e => set('nombre', e.target.value)} className="input-field" />
        </div>
        <div className="form-group">
          <label className="form-label">Apellidos</label>
          <input value={form.apellidos} onChange={e => set('apellidos', e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input value={form.email} onChange={e => set('email', e.target.value)} className="input-field" />
      </div>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input value={form.username} onChange={e => set('username', e.target.value)} className="input-field" />
      </div>
      <div className="form-group">
        <label className="form-label">Dirección</label>
        <input value={form.direccion} onChange={e => set('telefono', e.target.value)} className="input-field" />
      </div>
      <button onClick={() => onSave(form)} className="btn btn-primary w-full mt-2">
        Guardar
      </button>
    </div>
  );
}
