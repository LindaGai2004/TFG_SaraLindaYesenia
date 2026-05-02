import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Modal from '../../../components/Modal_dashboard';

export default function ClientesJefe({ clients, pedidos }) {
  const [clientSearch, setClientSearch] = useState('');
  const [popup, setPopup] = useState(null);

  const filteredClients = useMemo(() =>
    clients.filter(c =>
      `${c.nombre} ${c.apellidos} ${c.email} ${c.username}`
        .toLowerCase()
        .includes(clientSearch.toLowerCase())
    ), [clients, clientSearch]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Clientes</h2>
      <p className="text-xs text-secondary mb-4">Consulta de usuarios registrados</p>

      <div className="search-wrapper mb-4">
        <Search size={15} className="search-icon" />
        <input
          placeholder="Buscar por nombre, apellidos, email, username..."
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
              <th>Username</th>
              <th>Dirección</th>
              <th>Fecha registro</th>
              <th>Fecha nacimiento</th>
              <th>Pedidos</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(c => {
              const pedCnt = (pedidos ?? []).filter(p => p.email === c.email).length;
              return (
                <tr
                  key={c.idUsuario}
                  onClick={() => setPopup({ type: 'client', data: c })}
                  className="cursor-pointer"
                >
                  <td>
                    <div className="table-avatar bg-green-light">👤</div>
                  </td>
                  <td className="text-xs font-semibold text-primary">{c.nombre}</td>
                  <td className="text-xs text-primary">{c.apellidos}</td>
                  <td className="text-xs text-secondary">{c.email}</td>
                  <td className="text-xs text-secondary">{c.username}</td>
                  <td className="text-xs text-secondary">{c.direccion}</td>
                  <td className="text-xs text-secondary">{c.fechaRegistro}</td>
                  <td className="text-xs text-secondary">{c.fechaNacimiento}</td>
                  <td>
                    <span className="badge badge-shipping">{pedCnt}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detalle cliente — solo lectura */}
      {popup?.type === 'client' && (
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="👤 Cliente">
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
            ['Fecha Registro', popup.data.fechaRegistro],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className="font-semibold text-primary">{v}</span>
            </div>
          ))}

          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">Pedidos</h5>
          {(pedidos ?? []).filter(p => p.email === popup.data.email).length === 0 ? (
            <p className="text-xs text-muted">Sin pedidos registrados</p>
          ) : (
            (pedidos ?? []).filter(p => p.email === popup.data.email).map(p => {
              const statusStyle = {
                'CANCELADO': { bg: '#fef3c7', color: '#92400e' },
                'CARRITO':   { bg: '#dbeafe', color: '#1d4ed8' },
                'REALIZADO': { bg: '#dce8ed', color: '#3f6b7c' },
                'DEVUELTO':  { bg: '#fee2e2', color: '#991b1b' },
              }[p.estadoPedido];
              return (
                <div key={p.idPedido} className="flex items-center justify-between py-2 text-sm"
                  style={{ borderTop: '1px solid #f1f5f9' }}>
                  <span className="font-semibold text-green">#{p.idPedido}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={statusStyle}>
                    {p.estadoPedido}
                  </span>
                  <span className="font-semibold text-primary">${(p.total ?? 0).toFixed(2)}</span>
                </div>
              );
            })
          )}
        </Modal>
      )}
    </div>
  );
}
