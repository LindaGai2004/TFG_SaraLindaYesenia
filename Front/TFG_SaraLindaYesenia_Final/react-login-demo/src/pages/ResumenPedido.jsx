import { useCart }  from "../context/CartContext";
import { useAuth }  from "../context/AuthContext";

import './ResumenPedido.css';

function ResumenPedido() {
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
            <span className="value">Jane Smith</span>
          </div>

          <div className="order-customer-row">
            <span className="label">Dirección</span>
            <span className="value">Calle Eduardo Barreiros, 122, Madrid</span>
          </div>

          <div className="order-customer-row">
            <span className="label">Teléfono</span>
            <span className="value">+34 614242991</span>
          </div>

          <div className="order-customer-row">
            <span className="label">Email</span>
            <span className="value">jane.smith@gmail.com</span>
          </div>
        </div>

        <button className="order-back-btn">
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
            <span className="meta-value">07 Ene 2026</span>
          </div>

          <div className="order-meta-item">
            <span className="meta-label">Nro. de Orden</span>
            <span className="meta-value">024-125478956</span>
          </div>

          <div className="order-meta-item">
            <span className="meta-label">Método de pago</span>
            <span className="meta-value">Mastercard</span>
          </div>
        </div>

        <div className="order-items">

          <div className="order-item">
            <div className="order-item-image"></div>

            <div className="order-item-info">
              <div className="order-item-author">Jordan Avery</div>
              <div className="order-item-name">Sinister Solitude Book</div>
              <div className="order-item-price">
                $10.00 <span className="old-price">$20.00</span>
              </div>
            </div>

            <div className="order-item-total">$10.00</div>
          </div>

          {/* Repeat order-item for each product */}
        </div>

        <div className="order-totals">
          <div className="order-total-row">
            <span>Subtotal</span>
            <span>$20.00</span>
          </div>

          <div className="order-total-row">
            <span>Delivery</span>
            <span>$2.00</span>
          </div>

          <div className="order-total-row">
            <span>IVA</span>
            <span>$5.00</span>
          </div>

          <div className="order-total-row total">
            <span>Total</span>
            <span>$27.00</span>
          </div>
        </div>

      </section>

    </div>
  );
}

export default ResumenPedido;
