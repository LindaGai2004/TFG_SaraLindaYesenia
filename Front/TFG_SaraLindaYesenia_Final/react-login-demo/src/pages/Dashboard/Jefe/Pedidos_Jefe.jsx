import { useState, useMemo } from 'react';
import Modal from '../../../components/Modal_dashboard';

const statusStyle = {
  'CANCELADO': { bg: '#fef3c7', color: '#92400e' },
  'CARRITO':   { bg: '#dbeafe', color: '#1d4ed8' },
  'REALIZADO': { bg: '#dce8ed', color: '#3f6b7c' },
  'DEVUELTO':  { bg: '#fee2e2', color: '#991b1b' },
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Fecha inválida';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}Min antes`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H antes`;
  return `${Math.floor(diff / 86400)} Día antes`;
}

function formatFecha(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Fecha inválida';
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PedidosJefe({ pedidos }) {
  const [pedidoEstado, setPedidoEstado] = useState('Todos');
  const [popup, setPopup] = useState(null);

  const filteredPedidos = useMemo(() =>
    (pedidos ?? []).filter(o => pedidoEstado === 'Todos' || o.estadoPedido === pedidoEstado),
    [pedidos, pedidoEstado]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Consulta de pedidos</h2>
      <p className="text-xs text-secondary mb-4">Historial completo de pedidos de la plataforma</p>

      <div className="mb-4">
        <select
          value={pedidoEstado}
          onChange={e => setPedidoEstado(e.target.value)}
          className="input-field filter-select"
        >
          <option value="Todos">Estado: Todos</option>
          <option value="CARRITO">Carrito</option>
          <option value="REALIZADO">Realizado</option>
          <option value="DEVUELTO">Devuelto</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº Pedido</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Precio Total</th>
              <th>Fecha Venta</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(o => {
              const ss = statusStyle[o.estadoPedido];
              return (
                <tr
                  key={o.idPedido}
                  onClick={() => setPopup({ type: 'pedido', data: o })}
                  className="cursor-pointer"
                >
                  <td className="text-xs font-bold text-green">#{o.idPedido}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-green-light">👤</div>
                      <span className="text-xs font-semibold text-primary">{o.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={ss}>
                      {o.estadoPedido}
                    </span>
                  </td>
                  <td className="text-xs font-bold text-primary">${(o.total ?? 0).toFixed(2)}</td>
                  <td>
                    <div className="text-xs text-secondary">
                      {o.fechaVenta ? formatFecha(o.fechaVenta) : 'En carrito'}
                    </div>
                    <div className="text-xs text-muted">
                      {o.fechaVenta ? timeAgo(o.fechaVenta) : '—'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detalle pedido — solo lectura, sin botón cancelar */}
      {popup?.type === 'pedido' && (
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="🛒 Detalle del pedido">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green">#{popup.data.idPedido}</span>
            <span
              className="text-xs font-bold px-3 py-0.5 rounded-full"
              style={statusStyle[popup.data.estadoPedido]}
            >
              {popup.data.estadoPedido}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-green-light">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-green-light">👤</div>
            <div>
              <p className="text-xs font-bold text-primary">{popup.data.nombre}</p>
              <p className="text-xs text-secondary">{popup.data.email}</p>
            </div>
          </div>

          {[
            ['Fecha Compra', popup.data.fechaVenta ? new Date(popup.data.fechaVenta).toLocaleDateString('es-ES') : 'En carrito'],
            ['Precio Total', `$${(popup.data.total ?? 0).toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Precio Total' ? 'text-green' : 'text-primary'}`}>{v}</span>
            </div>
          ))}

          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">Productos</h5>
          {(popup.data.items ?? []).map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-sm"
              style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-primary">{p.nombreProducto}</span>
              <span className="text-secondary">x{p.cantidad} · ${p.precioUnidad.toFixed(2)}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
