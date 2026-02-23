import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../../components/Modal_dashboard';

export default function Dashboard({ 
  books, 
  papeleria, 
  clients , 
  pedidos, 
  mensual,
  mensualTotal 
}) {

  const [popup, setPopup] = useState(null);

  //bucle
  const totalGanancia = mensual.reduce(
    (acc, item) => {
      acc.libros += item.libros || 0;
      acc.papeleria += item.papeleria || 0;
      return acc;
    },
    { libros: 0, papeleria: 0 }
  );
  
  
function renderPopup() {
    if (!popup) return null;
    const { type } = popup;

    // PopUp-total
    if (type === 'total') {
      return (
        <Modal 
          open 
          width="max-w-md" 
          onClose={() => setPopup(null)} 
          title="💰 Total"
        >
          <div className="flex gap-4 mt-2">
            <div className="flex-1 rounded-xl p-3 text-center bg-green-light">
              <p className="text-xl font-bold text-success">
                ${totalGanancia.libros.toLocaleString()}
              </p>
              <p className="text-xs mt-1 text-success">📚 Libros</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center bg-amber-light">
              <p className="text-xl font-bold" style={{ color: '#92400e' }}>
                ${totalGanancia.papeleria.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: '#92400e' }}>
                📎 Papelerias
              </p>
            </div>
          </div>
          <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
            <p className="text-xs text-secondary">Total</p>
            <p className="text-2xl font-bold text-primary">
              ${Number(mensualTotal || 0).toLocaleString()}
            </p>
          </div>
        </Modal>
      );
    }

    // PopUp-clientes
    if (type === 'clients-popup') {
      return (
        <Modal 
          open 
          width="max-w-4xl" 
          onClose={() => setPopup(null)} 
          title="👥 Clientes"
        >
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
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => {
                  const pedCnt = pedidos.filter(o => o.id_cliente === c.id).length;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="table-avatar bg-green-light">👤</div>
                      </td>
                      <td className="text-xs font-semibold text-primary">
                        {c.nombre}
                      </td>
                      <td className="text-xs font-semibold text-primary">
                        {c.apellidos}
                      </td>
                      <td className="text-xs text-secondary">{c.email}</td>
                      <td className="text-xs text-secondary">{c.username}</td>
                      <td className="text-xs text-secondary">{c.direccion}</td>
                      <td>
                        <span className="badge badge-shipping">{pedCnt}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      );
    }
    
    // PopUp-productos
    if (type === 'products-popup') {
      const allProducts = [
      ...books.map(b => ({ ...b, tipoProducto: 'Libro' })),
      ...papeleria.map(s => ({ ...s, tipoProducto: 'Papeleria' }))
      ];
      return (
        <Modal open width="max-w-4xl" onClose={() => setPopup(null)} title="📦 Productos">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombreProducto}</td>
                    <td>{p.stock}</td>
                    <td>{p.estadoProducto}</td>
                    <td>{p.tipoProducto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      );
    }

    // PopUp-pedidos
    if (type === 'orders-popup') {
      const statusStyle = {
        'Pendiente': { bg: '#fef3c7', color: '#92400e' },
        'En camino': { bg: '#dbeafe', color: '#1d4ed8' },
        'Completado': { bg: '#d1fae5', color: '#065f46' },
        'Cancelado': { bg: '#fee2e2', color: '#991b1b' }
      };
      const counts = pedidos.reduce((a, o) => { 
        a[o.estadoPedido] = (a[o.estadoPedido] || 0) + 1; 
        return a; 
      }, {});
      
      return (
        <Modal 
          open 
          width="max-w-md" 
          onClose={() => setPopup(null)} 
          title="🛒 Pedidos"
        >
          <div className="text-3xl font-bold mb-3 text-green">
            {pedidos?.length} Pedidos
          </div>
          {Object.entries(counts).map(([estado, count]) => (
            <div 
              key={estado} 
              className="flex items-center justify-between py-2"
              style={{ borderTop: '1px solid #f1f5f9' }}
            >
              <span 
                className="text-xs font-semibold px-2 py-0.5 rounded-full" 
                style={statusStyle[estado]}
              >
                {estado}
              </span>
              <span className="text-sm font-bold text-primary">{count}</span>
            </div>
          ))}
          <div 
            className="flex items-center justify-between py-2 mt-2"
            style={{ borderTop: '1px solid #e2e8f0' }}
          >
            <span className="text-xs font-semibold text-secondary">Total</span>
            <span className="text-sm font-bold text-green">
              ${pedidos
                .filter(o => o.estadoPedido !== 'Cancelado')
                .reduce((s, o) => s + o.total, 0)
                .toFixed(2)}
            </span>
          </div>
        </Modal>
      );
    }

    return null;
  }
  
  return (
    <div>
      
      {/* Cards*/}
      <div className="dashboard-cards">
        {/* Card-total: verde */}
        <div 
          className="stat-card total" 
          onClick={() => setPopup({ type: 'total' })}
        >
          <div className="stat-card-header">
            <span className="stat-card-label green">Total</span>
            <div className="stat-card-icon white">
              <ArrowUpRight size={14} color="#fff" />
            </div>
          </div>
          <div className="stat-card-value white-text">
            {Number(mensualTotal ?? 0).toLocaleString()}
            
          </div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon white-bg">
              <ArrowUpRight size={10} color="#fff" />
            </div>
          </div>
          
        </div>

        {/* Crad-cliente */}
        <div 
          className="stat-card white" 
          onClick={() => setPopup({ type: 'clients-popup' })}
        >
          <div className="stat-card-header">
            <span className="stat-card-label white">Clientes</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color="#2d6a4f" />
            </div>
          </div>
          <div className="stat-card-value">{clients?.length}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color="#2d6a4f" />
            </div>
          </div>
        </div>

        {/* Card-productos */}
        <div 
          className="stat-card white" 
          onClick={() => setPopup({ type: 'products-popup' })}
        >
          <div className="stat-card-header">
            <span className="stat-card-label white">Productos</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color="#3b82f6" />
            </div>
          </div>
          <div className="stat-card-value">
            {books?.length + papeleria?.length}
          </div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color="#2d6a4f" />
            </div>
          </div>
        </div>

        {/* Card-pedidos */}
        <div 
          className="stat-card white" 
          onClick={() => setPopup({ type: 'orders-popup' })}
        >
          <div className="stat-card-header">
            <span className="stat-card-label white">Pedidos</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color="#f59e0b" />
            </div>
          </div>
          <div className="stat-card-value">{pedidos?.length}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color="#2d6a4f" />
            </div>
          </div>
        </div>
      </div>

      {/* Grafica */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Ganancia</h3>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div 
                className="chart-legend-dot" 
                style={{ background: '#2d6a4f' }}
              />
              <span className="chart-legend-label">Libros</span>
            </div>
            <div className="chart-legend-item">
              <div 
                className="chart-legend-dot" 
                style={{ background: '#c6a96c' }}
              />
              <span className="chart-legend-label">Papelerias</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mensual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12, 
                border: 'none', 
                boxShadow: '0 4px 14px rgba(0,0,0,.1)', 
                fontSize: 12 
              }}
              formatter={(val, name) => [
                `$${val.toLocaleString()}`, 
                name === 'libros' ? 'Libros' : 'Papelerias'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="libros" 
              stroke="#2d6a4f" 
              strokeWidth={2.5} 
              dot={{ r: 3, fill: '#2d6a4f' }} 
            />
            <Line 
              type="monotone" 
              dataKey="papeleria" 
              stroke="#c6a96c" 
              strokeWidth={2.5} 
              dot={{ r: 3, fill: '#c6a96c' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PopUp */}
      {renderPopup()}
    </div>
  );
}