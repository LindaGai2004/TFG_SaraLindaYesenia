import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Modal from '../../../components/Modal_dashboard';

const DASHBOARD_ACCENT = '#6d96a6';

export default function DashboardTrabajador({
  books,
  papeleria,
  clients,
  pedidos,
}) {
  const [popup, setPopup] = useState(null);

  const productLookup = [...(books ?? []), ...(papeleria ?? [])].reduce((acc, product) => {
    const productId = String(product.idProducto ?? product.id);
    acc[productId] = product;
    return acc;
  }, {});

  const topSellingProducts = (pedidos ?? [])
    .flatMap((pedido) => pedido.items ?? [])
    .reduce((acc, item) => {
      const itemId = String(item.idProducto);
      const current = acc[itemId] ?? {
        id: itemId,
        nombreProducto: item.nombreProducto,
        cantidad: 0,
        total: 0,
      };
      current.cantidad += Number(item.cantidad ?? 0);
      current.total += Number(item.precioUnidad ?? 0) * Number(item.cantidad ?? 0);
      acc[itemId] = current;
      return acc;
    }, {});

  const topSellingList = Object.values(topSellingProducts)
    .sort((a, b) => b.cantidad - a.cantidad || b.total - a.total)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      estadoProducto: productLookup[item.id]?.estadoProducto ?? 'N/D',
    }));

  // Pedidos realizados (no carrito)
  const pedidosRealizados = (pedidos ?? []).filter(o => o.estadoPedido === 'REALIZADO');

  const statusStyle = {
    CANCELADO: { background: '#fef3c7', color: '#92400e' },
    CARRITO:   { background: '#dbeafe', color: '#1d4ed8' },
    REALIZADO: { background: '#dce8ed', color: '#3f6b7c' },
    DEVUELTO:  { background: '#fee2e2', color: '#991b1b' },
  };

  function renderPopup() {
    if (!popup) return null;
    const { type } = popup;

    if (type === 'clients-popup') {
      return (
        <Modal open width="max-w-4xl" onClose={() => setPopup(null)} title="Clientes">
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
                {(clients ?? []).map((c) => {
                  const pedCnt = (pedidos ?? []).filter((o) => o.email === c.email).length;
                  return (
                    <tr key={c.idUsuario ?? c.id}>
                      <td><div className="table-avatar bg-green-light">👤</div></td>
                      <td className="text-xs font-semibold text-primary">{c.nombre}</td>
                      <td className="text-xs font-semibold text-primary">{c.apellidos}</td>
                      <td className="text-xs text-secondary">{c.email}</td>
                      <td className="text-xs text-secondary">{c.username}</td>
                      <td className="text-xs text-secondary">{c.direccion}</td>
                      <td><span className="badge badge-shipping">{pedCnt}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      );
    }

    if (type === 'products-popup') {
      const allProducts = [
        ...(books ?? []).map((b) => ({ ...b, tipoProducto: 'Libro' })),
        ...(papeleria ?? []).map((s) => ({ ...s, tipoProducto: 'Papelería' })),
      ];
      return (
        <Modal open width="max-w-4xl" onClose={() => setPopup(null)} title="Productos">
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
                {allProducts.map((p, i) => (
                  <tr key={p.idProducto ?? i}>
                    <td className="text-xs text-primary">{p.nombreProducto}</td>
                    <td className="text-xs text-secondary">{p.stock}</td>
                    <td>
                      <span className={`badge ${p.estadoProducto === 'DISPONIBLE' ? 'badge-success' : 'badge-error'}`}>
                        {p.estadoProducto}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{p.tipoProducto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      );
    }

    if (type === 'orders-popup') {
      const counts = (pedidos ?? []).reduce((a, o) => {
        a[o.estadoPedido] = (a[o.estadoPedido] || 0) + 1;
        return a;
      }, {});
      return (
        <Modal open width="max-w-md" onClose={() => setPopup(null)} title="Pedidos">
          <div className="text-3xl font-bold mb-3 text-green">{pedidos?.length} Pedidos</div>
          {Object.entries(counts).map(([estado, count]) => (
            <div key={estado} className="flex items-center justify-between py-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={statusStyle[estado]}>
                {estado}
              </span>
              <span className="text-sm font-bold text-primary">{count}</span>
            </div>
          ))}
        </Modal>
      );
    }

    if (type === 'realizados-popup') {
      return (
        <Modal open width="max-w-4xl" onClose={() => setPopup(null)} title="Pedidos Realizados">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRealizados.map(o => (
                  <tr key={o.idPedido}>
                    <td className="text-xs font-bold text-green">#{o.idPedido}</td>
                    <td className="text-xs text-primary">{o.nombre}</td>
                    <td className="text-xs font-bold text-primary">${(o.total ?? 0).toFixed(2)}</td>
                    <td className="text-xs text-secondary">
                      {o.fechaVenta ? new Date(o.fechaVenta).toLocaleDateString('es-ES') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      );
    }

    return null;
  }

  return (
    <div>
      {/* ── 4张统计卡片 ── */}
      <div className="dashboard-cards">

        {/* Clientes */}
        <div className="stat-card total" onClick={() => setPopup({ type: 'clients-popup' })}>
          <div className="stat-card-header">
            <span className="stat-card-label green">Clientes</span>
            <div className="stat-card-icon white">
              <ArrowUpRight size={14} color="#fff" />
            </div>
          </div>
          <div className="stat-card-value white-text">
            {clients?.length ?? 0}
          </div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon white-bg">
              <ArrowUpRight size={10} color="#fff" />
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="stat-card white" onClick={() => setPopup({ type: 'products-popup' })}>
          <div className="stat-card-header">
            <span className="stat-card-label white">Productos</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color="#3b82f6" />
            </div>
          </div>
          <div className="stat-card-value">{(books?.length ?? 0) + (papeleria?.length ?? 0)}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>

        {/* Pedidos totales */}
        <div className="stat-card white" onClick={() => setPopup({ type: 'orders-popup' })}>
          <div className="stat-card-header">
            <span className="stat-card-label white">Pedidos</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color="#f59e0b" />
            </div>
          </div>
          <div className="stat-card-value">{pedidos?.length ?? 0}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>

        {/* Pedidos realizados */}
        <div className="stat-card white" onClick={() => setPopup({ type: 'realizados-popup' })}>
          <div className="stat-card-header">
            <span className="stat-card-label white">Realizados</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color={DASHBOARD_ACCENT} />
            </div>
          </div>
          <div className="stat-card-value">{pedidosRealizados.length}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Productos más vendidos ── */}
      <div style={{ marginTop: '1rem' }}>
        <div className="chart-card" style={{ marginTop: 0 }}>
          <div className="chart-header">
            <h3 className="chart-title">Productos Más Vendidos</h3>
            <span className="text-xs text-secondary">Top 5 según cantidad vendida</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidades</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {topSellingList.length > 0 ? (
                  topSellingList.map((item) => (
                    <tr key={item.id}>
                      <td className="text-xs font-semibold text-primary">{item.nombreProducto}</td>
                      <td className="text-xs font-bold text-green">{item.cantidad}</td>
                      <td>
                        <span className={`badge ${
                          item.estadoProducto === 'DISPONIBLE' ? 'badge-success' :
                          item.estadoProducto === 'AGOTADO' ? 'badge-error' : 'badge-pending'
                        }`}>
                          {item.estadoProducto}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-xs text-secondary" style={{ textAlign: 'center', padding: '1rem' }}>
                      Aún no hay ventas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {renderPopup()}
    </div>
  );
}
