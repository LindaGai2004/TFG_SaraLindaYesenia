import { useState, useMemo } from 'react';
import { XCircle, Clock } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

const statusStyle = {
  'CANCELADO': { bg: '#fef3c7', color: '#92400e' },
  'CARRITO': { bg: '#dbeafe', color: '#1d4ed8' },
  'REALIZADO': { bg: '#dce8ed', color: '#3f6b7c' },
  'DEVUELTO': { bg: '#fee2e2', color: '#991b1b' }
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Fecha inválida';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}Min antes`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H antes`;
  return `${Math.floor(diff / 86400)} Dia antes`;
}

function formatFecha(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function canCancel(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  return (Date.now() - date.getTime()) < 24 * 3600000;
}

export default function Pedidos({ pedidos, clients, onCancelPedido }) {
  const [pedidoEstado, setPedidoEstado] = useState('Todos');
  const [popup, setPopup] = useState(null);

  const filteredPedidos = useMemo(() => 
    (pedidos ?? []).filter(o => pedidoEstado === 'Todos' || o.estadoPedido === pedidoEstado),
    [pedidos, pedidoEstado]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Gestión de pedidos</h2>
      <p className="text-xs text-secondary mb-4">Pedidos historicos: cancelables dentro de 24 horas</p>

      <div className="mb-4">
        <select value={pedidoEstado} onChange={e => setPedidoEstado(e.target.value)} className="input-field filter-select">
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
              <th>Cleinte</th>
              <th>Estado</th>
              <th>Precio Total</th>
              <th>Fecha Venta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(o => {
              const canCan = canCancel(o.fechaVenta) && o.estadoPedido !== 'CANCELADO';
              const ss = statusStyle[o.estadoPedido];

              return (
                <tr key={o.idPedido} onClick={() => setPopup({ type: 'pedido', data: o })} className="cursor-pointer">
                  <td className="text-xs font-bold text-green">#{o.idPedido}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-green-light">👤</div>
                      <span className="text-xs font-semibold text-primary">{o.nombre}</span>
                    </div>
                  </td>
                  <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={ss}>{o.estadoPedido}</span></td>
                  <td className="text-xs font-bold text-primary">${(o.total??0).toFixed(2)}</td>
                  <td>
                    <div className="text-xs text-secondary">
                      {o.fechaVenta ? formatFecha(o.fechaVenta) : 'En carrito'}
                    </div>
                    <div className="text-xs text-muted">
                      {o.fechaVenta ? timeAgo(o.fechaVenta) : '—'}
                    </div>
                  </td>
                  <td>
                    {canCan ? (
                      <button onClick={e => { e.stopPropagation(); onCancelPedido(o.idPedido); }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition hover:bg-red-100 text-error">
                        <XCircle size={11} /> Cancelar
                      </button>
                    ) : o.estado !== 'Cancelado' && (
                      <span className="flex items-center gap-1 text-xs text-muted"><Clock size={10} />  Pedido Caducado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3 text-muted">⏰ Los pedidos solo se puede cancelar dentro de las primeras 24 horas.</p>

      {popup?.type === 'pedido' && (
        
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="🛒 Detalle del pedido">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green">#{popup.data.idPedido}</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full" style={statusStyle[popup.data.estadoPedido]}>{popup.data.estadoPedido}</span>
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
            ['Precio Total', `$${(popup.data.total??0).toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Precio Total' ? 'text-green' : 'text-primary'}`}>{v}</span>
            </div>
          ))}
          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">Pruductos</h5>
          {(popup.data.items?? []).map((p, i) => (
            
            <div key={i} className="flex items-center justify-between py-2 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-primary">{p.nombreProducto}</span>
              <span className="text-secondary">x{p.cantidad} · ${p.precioUnidad.toFixed(2)}</span>
            </div>
            
          ))}
          {canCancel(popup.data.fechaVenta) && popup.data.estadoPedido !== 'CANCELADO' && (
            <button onClick={() => { onCancelPedido(popup.data.idPedido); setPopup(null); }} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition hover:opacity-80" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <XCircle size={14} /> Cancelar Pedido (Dentro de 24 horas)
            </button>
          )}
          
        </Modal>
      )}
    </div>
  );
}
