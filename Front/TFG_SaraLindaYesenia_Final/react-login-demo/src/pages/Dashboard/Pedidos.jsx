import { useState, useMemo } from 'react';
import { XCircle, Clock } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

const statusStyle = {
  'Pendiente': { bg: '#fef3c7', color: '#92400e' },
  'En camino': { bg: '#dbeafe', color: '#1d4ed8' },
  'Completado': { bg: '#d1fae5', color: '#065f46' },
  'Cancelado': { bg: '#fee2e2', color: '#991b1b' }
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

function canCancel(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) < 24 * 3600000;
}

export default function Pedidos({ orders, clients, onCancelOrder }) {
  const [orderEstado, setOrderEstado] = useState('Todos');
  const [popup, setPopup] = useState(null);

  const filteredOrders = useMemo(() => 
    orders.filter(o => orderEstado === 'Todos' || o.estado === orderEstado),
    [orders, orderEstado]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">订单管理</h2>
      <p className="text-xs text-secondary mb-4">订单历史 · 只读 · 24小时内可取消</p>

      <div className="mb-4">
        <select value={orderEstado} onChange={e => setOrderEstado(e.target.value)} className="input-field filter-select">
          <option value="Todos">状态: 全部</option>
          <option value="Pendiente">待处理</option>
          <option value="En camino">配送中</option>
          <option value="Completado">已完成</option>
          <option value="Cancelado">已取消</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>状态</th>
              <th>总价</th>
              <th>日期</th>
              <th>支付方式</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => {
              const client = clients.find(c => c.id === o.id_cliente);
              const canCan = canCancel(o.fecha) && o.estado !== 'Cancelado';
              const ss = statusStyle[o.estado];

              return (
                <tr key={o.id} onClick={() => setPopup({ type: 'order', data: o })} className="cursor-pointer">
                  <td className="text-xs font-bold text-green">#{o.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-green-light">👤</div>
                      <span className="text-xs font-semibold text-primary">{client?.nombre} {client?.apellido}</span>
                    </div>
                  </td>
                  <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={ss}>{o.estado}</span></td>
                  <td className="text-xs font-bold text-primary">${o.precio_total.toFixed(2)}</td>
                  <td className="text-xs text-secondary">{timeAgo(o.fecha)}</td>
                  <td className="text-xs text-secondary">{o.metodo_pago}</td>
                  <td>
                    {canCan ? (
                      <button onClick={e => { e.stopPropagation(); onCancelOrder(o.id); }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition hover:bg-red-100 text-error">
                        <XCircle size={11} /> 取消
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

      {popup?.type === 'order' && (
        <Modal open width="max-w-lg" onClose={() => setPopup(null)} title="🛒 订单详情">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green">#{popup.data.id}</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full" style={statusStyle[popup.data.estado]}>{popup.data.estado}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-green-light">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-green-light">👤</div>
            <div>
              <p className="text-xs font-bold text-primary">{clients.find(c => c.id === popup.data.id_cliente)?.nombre} {clients.find(c => c.id === popup.data.id_cliente)?.apellido}</p>
              <p className="text-xs text-secondary">{clients.find(c => c.id === popup.data.id_cliente)?.email}</p>
            </div>
          </div>
          {[
            ['客户ID', popup.data.id_cliente],
            ['支付方式', popup.data.metodo_pago],
            ['日期', new Date(popup.data.fecha).toLocaleString()],
            ['总价', `$${popup.data.precio_total.toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === '总价' ? 'text-green' : 'text-primary'}`}>{v}</span>
            </div>
          ))}
          <h5 className="text-xs font-bold mt-4 mb-2 text-secondary">商品</h5>
          {popup.data.productos.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-primary">{p.nombre}</span>
              <span className="text-secondary">x{p.cantidad} · ${p.precio.toFixed(2)}</span>
            </div>
          ))}
          {canCancel(popup.data.fecha) && popup.data.estado !== 'Cancelado' && (
            <button onClick={() => { onCancelOrder(popup.data.id); setPopup(null); }} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition hover:opacity-80" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <XCircle size={14} /> 取消订单 (24小时内)
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
