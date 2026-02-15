import { useState, useMemo } from 'react';
import { XCircle, Clock } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

const statusStyle = {
  'CANCELADO': { bg: '#fef3c7', color: '#92400e' },
  'CARRITO': { bg: '#dbeafe', color: '#1d4ed8' },
  'REALIZADO': { bg: '#d1fae5', color: '#065f46' },
  'DEVUELTO': { bg: '#fee2e2', color: '#991b1b' }
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}Min antes`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H antes`;
  return `${Math.floor(diff / 86400)}Dia antes`;
}

function canCancel(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) < 24 * 3600000;
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
      <h2 className="text-xl font-bold text-primary mb-1">订单管理</h2>
      <p className="text-xs text-secondary mb-4">订单历史 · 只读 · 24小时内可取消</p>

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
              const client = (clients??[]).find(c => c.id === o.id_cliente);
              const canCan = canCancel(o.fechaVenta) && o.estadoPedido !== 'CANCELADO';
              const ss = statusStyle[o.estadoPedido];

              return (
                <tr key={o.id} onClick={() => setPopup({ type: 'pedido', data: o })} className="cursor-pointer">
                  <td className="text-xs font-bold text-green">#{o.idPedido}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-green-light">👤</div>
                      <span className="text-xs font-semibold text-primary">{client?.nombre} {client?.apellidos}</span>
                    </div>
                  </td>
                  <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={ss}>{o.estadoPedido}</span></td>
                  <td className="text-xs font-bold text-primary">${(o.total??0).toFixed(2)}</td>
                  <td className="text-xs text-secondary">{timeAgo(o.fechaVenta)}</td>
                  <td>
                    {canCan ? (
                      <button onClick={e => { e.stopPropagation(); onCancelPedido(o.id); }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition hover:bg-red-100 text-error">
                        <XCircle size={11} /> Cancelar
                      </button>
                    ) : o.estado !== 'Cancelado' && (
                      <span className="flex items-center gap-1 text-xs text-muted"><Clock size={10} /> 已过期</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3 text-muted">⏰ 订单只能在前24小时内取消</p>

      {popup?.type === 'pedido' && (
        
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="🛒 订单详情">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green">#{popup.data.idPedido}</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full" style={statusStyle[popup.data.estadoPedido]}>{popup.data.estadoPedido}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-green-light">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-green-light">👤</div>
            <div>
              <p className="text-xs font-bold text-primary">{clients.find(c => c.id === popup.data.id_cliente)?.nombre} {clients.find(c => c.id === popup.data.id_cliente)?.apellidos}</p>
              <p className="text-xs text-secondary">{clients.find(c => c.id === popup.data.id_cliente)?.email}</p>
            </div>
          </div>
          {[
            ['日期', new Date(popup.data.fechaVenta).toLocaleString()],
            ['总价', `$${(popup.data.total??0).toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === '总价' ? 'text-green' : 'text-primary'}`}>{v}</span>
            </div>
          ))}
          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">Pruductos</h5>
          {(popup.data.items?? []).map((p, i) => (
            
            <div key={i} className="flex items-center justify-between py-2 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-primary">{p.nombreProducto}</span>
              <span className="text-secondary">x{p.cantidad} · ${p.precioUnidad.toFixed(2)}</span>
            </div>
            
          ))}
          {canCancel(popup.data.fechaVenta) && popup.data.estado !== 'Cancelado' && (
            <button onClick={() => { onCancelPedido(popup.data.idPedido); setPopup(null); }} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition hover:opacity-80" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <XCircle size={14} /> 取消订单 (24小时内)
            </button>
          )}
          
        </Modal>
      )}
    </div>
  );
}
