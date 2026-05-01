import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Modal from '../../components/Modal_dashboard';

const LIBRO_MES_STORAGE_KEY = 'libro_mes_id';
const DASHBOARD_ACCENT = '#6d96a6';

export default function Dashboard({
  books,
  papeleria,
  clients,
  pedidos,
  mensual,
  mensualTotal,
}) {
  const [popup, setPopup] = useState(null);
  const [libroMesId, setLibroMesId] = useState(
    () => localStorage.getItem(LIBRO_MES_STORAGE_KEY) || '31'
  );
  const [showAllLibroMes, setShowAllLibroMes] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem(LIBRO_MES_STORAGE_KEY);
    if (savedId) {
      setLibroMesId(savedId);
    }
  }, []);

  const totalGanancia = mensual.reduce(
    (acc, item) => {
      acc.libros += item.libros || 0;
      acc.papeleria += item.papeleria || 0;
      return acc;
    },
    { libros: 0, papeleria: 0 }
  );

  const handleLibroMesChange = (book) => {
    const selectedId = String(book.idProducto ?? book.id);
    localStorage.setItem(LIBRO_MES_STORAGE_KEY, selectedId);
    setLibroMesId(selectedId);
  };

  const visibleBooks = showAllLibroMes ? books : books.slice(0, 5);

  const productLookup = [...books, ...papeleria].reduce((acc, product) => {
    const productId = String(product.idProducto ?? product.id);
    acc[productId] = product;
    return acc;
  }, {});

  const topSellingProducts = pedidos
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

  function renderPopup() {
    if (!popup) return null;
    const { type } = popup;

    if (type === 'total') {
      return (
        <Modal
          open
          width="max-w-md"
          onClose={() => setPopup(null)}
          title="RESUMEN DEL TOTAL"
        >
          <div className="flex gap-4 mt-2" style={{ justifyContent: 'center', gap: '16px', padding: '1rem 1rem' }}>
            <div
              className="flex-1 rounded-xl p-4"
              style={{ background: '#edf4f7', border: '1px solid #b8d0da', textAlign: 'center', borderRadius: '16px', flex: '0 0 120px'}}
            >
              <p className="text-xl font-bold" style={{ color: DASHBOARD_ACCENT, paddingTop: '10px'}}>
                ${totalGanancia.libros.toLocaleString()}
              </p>
              <p className="text-sm mt-2" style={{ color: DASHBOARD_ACCENT, paddingBottom: '10px' }}>
                ● Libros
              </p>
            </div>
            <div
              className="flex-1 rounded-xl p-4"
              style={{ background: '#fff8ee', border: '1px solid #efd6a7', textAlign: 'center', borderRadius: '16px', flex: '0 0 120px' }}
            >
              <p className="text-xl font-bold" style={{ color: '#92400e', paddingTop: '10px' }}>
                ${totalGanancia.papeleria.toLocaleString()}
              </p>
              <p className="text-sm mt-2" style={{ color: '#b98928', paddingBottom: '10px' }}>
                ● Papelerías
              </p>
            </div>
          </div>
          <div
            className="mt-5 pt-5"
            style={{ borderTop: '1px solid #d9e6ec' }}
          >
            <div className="flex items-end justify-between" style={{ color: DASHBOARD_ACCENT,  }}>
              <p className="text-xl" style={{ color: DASHBOARD_ACCENT }}>Total</p>
              <p className="text-2xl font-bold" style={{ color: DASHBOARD_ACCENT }}>
                ${Number(mensualTotal || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Modal>
      );
    }

    if (type === 'clients-popup') {
      return (
        <Modal
          open
          width="max-w-4xl"
          onClose={() => setPopup(null)}
          title="Clientes"
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
                  <th>Direccion</th>
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const pedCnt = pedidos.filter((o) => o.email === c.email).length;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="table-avatar bg-green-light">👤</div>
                      </td>
                      <td className="text-xs font-semibold text-primary">{c.nombre}</td>
                      <td className="text-xs font-semibold text-primary">{c.apellidos}</td>
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

    if (type === 'products-popup') {
      const allProducts = [
        ...books.map((b) => ({ ...b, tipoProducto: 'Libro' })),
        ...papeleria.map((s) => ({ ...s, tipoProducto: 'Papeleria' })),
      ];

      return (
        <Modal
          open
          width="max-w-4xl"
          onClose={() => setPopup(null)}
          title="Productos"
        >
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
                {allProducts.map((p) => (
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

    if (type === 'orders-popup') {
      const statusStyle = {
        Pendiente: { bg: '#fef3c7', color: '#92400e' },
        'En camino': { bg: '#dbeafe', color: '#1d4ed8' },
        Completado: { bg: '#dce8ed', color: '#3f6b7c' },
        Cancelado: { bg: '#fee2e2', color: '#991b1b' },
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
          title="Pedidos"
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
              $
              {pedidos
                .filter((o) => o.estadoPedido !== 'Cancelado')
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
      <div className="dashboard-cards">
        <div className="stat-card total" onClick={() => setPopup({ type: 'total' })}>
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

        <div
          className="stat-card white"
          onClick={() => setPopup({ type: 'clients-popup' })}
        >
          <div className="stat-card-header">
            <span className="stat-card-label white">Clientes</span>
            <div className="stat-card-icon bordered">
              <ArrowUpRight size={13} color={DASHBOARD_ACCENT} />
            </div>
          </div>
          <div className="stat-card-value">{clients?.length}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>

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
          <div className="stat-card-value">{books?.length + papeleria?.length}</div>
          <div className="stat-card-footer">
            <div className="stat-card-trend-icon">
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>

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
              <ArrowUpRight size={9} color={DASHBOARD_ACCENT} />
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Ganancia</h3>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: DASHBOARD_ACCENT }} />
              <span className="chart-legend-label">Libros</span>
            </div>
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: '#c6a96c' }} />
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
                fontSize: 12,
              }}
              formatter={(val, name) => [
                `$${val.toLocaleString()}`,
                name === 'libros' ? 'Libros' : 'Papelerias',
              ]}
            />
            <Line
              type="monotone"
              dataKey="libros"
              stroke={DASHBOARD_ACCENT}
              strokeWidth={2.5}
              dot={{ r: 3, fill: DASHBOARD_ACCENT }}
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <div className="chart-card" style={{ marginTop: 0 }}>
          <div className="chart-header">
            <h3 className="chart-title">Libro Del Mes</h3>
            <span className="text-xs text-secondary">
              Elige el libro que aparecera en Home
            </span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Autor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleBooks.map((book) => {
                  const currentId = String(book.idProducto ?? book.id);
                  const isSelected = currentId === libroMesId;

                  return (
                    <tr key={currentId}>
                      <td className="text-xs font-semibold text-primary">
                        {book.nombreProducto}
                      </td>
                      <td className="text-xs text-secondary">
                        {book.autor || 'Autor desconocido'}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleLibroMesChange(book)}
                          className={`btn ${isSelected ? '' : 'btn-primary'}`}
                          style={
                            isSelected
                              ? {
                                  background: '#dce8ed',
                                  color: '#3f6b7c',
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.7rem',
                                }
                              : {
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.7rem',
                                }
                          }
                        >
                          {isSelected ? 'Actual' : 'Seleccionar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {books.length > 5 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAllLibroMes((prev) => !prev)}
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.72rem' }}
              >
                {showAllLibroMes ? 'Mostrar menos' : 'Mas productos'}
              </button>
            </div>
          )}
        </div>

        <div className="chart-card" style={{ marginTop: 0 }}>
          <div className="chart-header">
            <h3 className="chart-title">Productos Mas Vendidos</h3>
            <span className="text-xs text-secondary">
              Top 5 segun cantidad vendida
            </span>
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
                      <td className="text-xs font-semibold text-primary">
                        {item.nombreProducto}
                      </td>
                      <td className="text-xs font-bold text-green">{item.cantidad}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.estadoProducto === 'DISPONIBLE'
                              ? 'badge-success'
                              : item.estadoProducto === 'AGOTADO'
                                ? 'badge-error'
                                : 'badge-pending'
                          }`}
                        >
                          {item.estadoProducto}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-xs text-secondary"
                      style={{ textAlign: 'center', padding: '1rem' }}
                    >
                      Aun no hay ventas registradas.
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
