import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PayPalButton from "../components/PayPalButton";
import './Checkout.css';

export default function Checkout() {
  const { idPedido } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [metodoPago, setMetodoPago] = useState("PAYPAL");

  // Datos que vienen del carrito via navigate state
  const pedido = location.state ?? null;
  const items = pedido?.items ?? [];
  const subtotal = pedido?.subtotal ?? 0;
  const iva = pedido?.iva ?? 0;
  const delivery = pedido?.delivery ?? 2.00;
  const total = pedido?.total ?? 0;

  return (
    <div className="checkout-wrapper">
      <div className="checkout-page"><div className="checkout-page-left">
        {/* IZQUIERDA */}
        <div className="checkout-left">
          <h2 className="checkout-title">Método de pago</h2>
          <p className="checkout-subtitle">Selecciona cómo quieres pagar tu pedido</p>

          <div className="method-cards">
           
            <div
              className={`method-card ${metodoPago === "PAYPAL" ? "selected" : ""}`}
              onClick={() => setMetodoPago("PAYPAL")}
            >
              <div className="radio-dot">{metodoPago === "PAYPAL" && <div className="radio-fill" />}</div>
              <div className="method-icon paypal-logo">Pay<span>Pal</span></div>
              <div>
                <div className="method-label">PayPal</div>
                <div className="method-desc">Paga con tu cuenta PayPal de forma segura</div>
              </div>
            </div>
           {/*
            <div
              className={`method-card ${metodoPago === "CARD" ? "selected" : ""}`}
              onClick={() => setMetodoPago("CARD")}
            >
              <div className="radio-dot">{metodoPago === "CARD" && <div className="radio-fill" />}</div>
              <div className="method-icon">💳</div>
              <div>
                <div className="method-label">Tarjeta de crédito / débito</div>
                <div className="method-desc">Visa, Mastercard, American Express</div>
              </div>
            </div> */}
          </div>

          {metodoPago === "PAYPAL" && (
            <div className="paypal-section">
              <div className="paypal-info">
                <strong>Serás redirigido a PayPal</strong> para completar el pago de
                forma segura. Una vez aprobado, volverás automáticamente a confirmar
                tu pedido.
              </div>
              <PayPalButton idPedido={idPedido} mode="popup" />
            </div>
          )}
        </div>
      </div>


        {/* DERECHA — Resumen */}
        <div className="checkout-page-right">
          <div className="checkout-right">
            <h3 className="summary-title">Resumen del pedido</h3>

            {items.length === 0 ? (
              <p className="summary-loading">Sin productos</p>
            ) : (
              <>
                <div className="order-items">
                  {items.map((item, i) => {
                    const imgPrincipal = item.imagenes?.find(img => img.tipo === "PRINCIPAL")?.ruta;
                    return (
                      <div key={i} className="order-item">
                        <div className="order-item-img">
                          <span className="item-badge">{item.cantidad}</span>
                          {imgPrincipal && (
                            <img
                              src={`http://localhost:9001/uploads/${imgPrincipal}`}
                              alt={item.nombreProducto}
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                            />
                          )}
                        </div>
                        <div className="order-item-info">
                          <div className="order-item-name">{item.nombreProducto}</div>
                          <div className="order-item-variant">{item.autor}</div>
                        </div>
                        <div className="order-item-price">€{item.totalPorItem?.toFixed(2)}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="summary-divider" />

                <div className="price-line">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="price-line">
                  <span>Delivery</span>
                  <span>€{delivery.toFixed(2)}</span>
                </div>
                <div className="price-line">
                  <span>IVA</span>
                  <span>€{iva.toFixed(2)}</span>
                </div>

                <div className="summary-divider" />

                <div className="price-line total">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </>
            )}

            <button className="edit-cart-btn" onClick={() => navigate("/carrito")}>
              ✏️ Editar carrito
            </button>
          </div>
        </div></div>


    </div>
  );
}