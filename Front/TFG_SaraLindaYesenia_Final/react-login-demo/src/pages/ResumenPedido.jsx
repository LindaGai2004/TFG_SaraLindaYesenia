import { useNavigate, useLocation } from "react-router-dom";
import './ResumenPedido.css';

function ResumenPedido() {
  const { state: pedido } = useLocation();
  const navigate = useNavigate();
  if (!pedido) {
    return <p>No hay info del pedido</p>;
  }
  return (
    <div className="order-success-page">

      {/* LEFT COLUMN */}
      <section className="order-success-left">

        <h1 className="order-success-title">
          ¡Gracias por tu compra!
        </h1>

        <p className="order-success-text">
          Tu orden será procesada dentro de 24 horas en horario laboral.
          Te confirmaremos mediante correo cuando tu orden haya sido enviada.
          La factura ha sido enviada a tu correo.
        </p>

        <div className="order-customer-box">
          <h2 className="order-customer-title">Datos de pedido</h2>

          <div className="order-customer-row">
            <span className="label">Nombre</span>
            <span className="value">{pedido.nombre}</span>
          </div>

          <div className="order-customer-row">
            <span className="label">Dirección</span>
            <span className="value">{pedido.direccion}</span>
          </div>
          <div className="order-customer-row">
            <span className="label">Email</span>
            <span className="value">{pedido.email}</span>
          </div>
        </div>

        <button className="order-back-btn" onClick={() => navigate("/productos")}>
          Regresar a la tienda
        </button>
      </section>

      {/* RIGHT COLUMN */}
      <section className="order-success-right">

        <h2 className="order-summary-title">
          Resumen de Pedido
        </h2>

        <div className="order-meta">
          <div className="order-meta-item">
            <span className="meta-label">Fecha</span>
            <span className="meta-value">{pedido.fechaVenta}</span>
          </div>

          <div className="order-meta-item">
            <span className="meta-label">Nro. de Orden</span>
            <span className="meta-value">{pedido.idPedido}</span>
          </div>

          <div className="order-meta-item">
            <span className="meta-label">Método de pago</span>
            <span className="meta-value">{pedido.metodoPago}</span>
          </div>
        </div>

        <div className="order-items">
          {pedido.items.map(item => {
            const imgPrincipal = item.imagenes?.find(img => img.tipo === "PRINCIPAL")?.ruta;
            return (
              <div className="order-item" key={item.idProducto}>
                <div className="order-item-image">
                  {imgPrincipal ? (
                    <img
                      src={`http://localhost:9001/uploads/${imgPrincipal}`}
                      alt={item.nombreProducto}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#e8e8e4", borderRadius: "8px" }} />
                  )}
                </div>
                <div className="order-item-info">
                  <div className="order-item-author">{item.autor}</div>
                  <div className="order-item-name">{item.nombreProducto}</div>
                  <div className="order-item-price">€{item.precioUnidad.toFixed(2)}</div>
                </div>
                <div className="order-item-total">€{item.totalPorItem.toFixed(2)}</div>
              </div>
            );
          })}


          {/* Repeat order-item for each product */}
        </div>

        <div className="order-totals">
          <div className="order-total-row">
            <span>Subtotal</span>
            <span>€{pedido.subtotal.toFixed(2)}</span>
          </div>

          <div className="order-total-row">
            <span>Delivery</span>
            <span>€2.00</span>
          </div>

          <div className="order-total-row">
            <span>IVA</span>
            <span>€{pedido.iva.toFixed(2)}</span>
          </div>

          <div className="order-total-row total">
            <span>Total</span>
            <span>€{pedido.total.toFixed(2)}</span>
          </div>
        </div>

      </section>

    </div>
  );
}

export default ResumenPedido;
