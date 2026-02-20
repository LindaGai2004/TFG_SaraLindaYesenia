import { useEffect, useRef, useState, useCallback } from "react";
import { apiPost } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./PayPalButton.css";

export default function PayPalButton({ idPedido, mode, total }) {
  const navigate = useNavigate();
  const [cardReady, setCardReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const hostedFieldsRef = useRef(null);
  const buttonsRef = useRef(null);

  // ── MODO POPUP — callback ref garantiza que el div ya existe en el DOM ──
  const paypalContainerRef = useCallback((node) => {
    if (!node || !idPedido || !window.paypal) return;
    if (buttonsRef.current) return; // ya renderizado

    const buttons = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",  // solo muestra "Pay with PayPal"
        tagline: false,
        height: 48,
      },
      // Deshabilita el botón de tarjeta de crédito del SDK
      fundingSource: window.paypal.FUNDING.PAYPAL,
      createOrder: async () => {
        const data = await apiPost(`/api/paypal/crear-pedido/${idPedido}`);
        return data.paypalIdPedido;
      },
      onApprove: async (data) => {
        try {
          const pedido = await apiPost(`/api/paypal/capturar-pedido/${data.orderID}`);
          navigate("/resumen", { state: pedido });
        } catch {
          alert("Error confirmando el pago");
        }
      },
      onError: (err) => console.error("PayPal error:", err),
    });

    buttons.render(node);
    buttonsRef.current = buttons;
  }, [idPedido]);

  // ── MODO TARJETA (Hosted Fields) ────────────────────────────────────────
  useEffect(() => {
    if (mode !== "card") return;
    if (!idPedido || !window.paypal?.HostedFields) return;

    window.paypal.HostedFields.render({
      createOrder: async () => {
        const data = await apiPost(`/api/paypal/crear-pedido/${idPedido}`);
        return data.paypalIdPedido;
      },
      fields: {
        number: { selector: "#card-number", placeholder: "1234 5678 9012 3456" },
        cvv: { selector: "#card-cvv", placeholder: "•••" },
        expirationDate: { selector: "#card-expiry", placeholder: "MM / AA" },
      },
      styles: {
        input: { "font-size": "14px", "font-family": "inherit", color: "#1a1a1a" },
        ":focus": { color: "#1a1a1a" },
        ".invalid": { color: "#e53e3e" },
      },
    }).then((hf) => {
      hostedFieldsRef.current = hf;
      setCardReady(true);
    });
  }, [idPedido, mode]);

  const handleCardSubmit = async () => {
    if (!hostedFieldsRef.current || processing) return;
    setProcessing(true);
    try {
      const { orderId } = await hostedFieldsRef.current.submit({
        cardholderName: document.getElementById("card-name")?.value,
      });
      const pedido = await apiPost(`/api/paypal/capturar-pedido/${orderId}`);
      navigate("/resumen", { state: pedido });
    } catch (err) {
      console.error(err);
      alert("Error procesando la tarjeta");
    } finally {
      setProcessing(false);
    }
  };

  // ── RENDER POPUP ────────────────────────────────────────────────────────
  if (mode === "popup") {
    return (
      <div className="paypal-popup-wrapper">
        {/* callback ref — se ejecuta cuando el nodo existe en el DOM */}
        <div ref={paypalContainerRef} />
        <div className="secure-note">🔒 Pago seguro con cifrado SSL</div>
      </div>
    );
  }

  // ── RENDER TARJETA ──────────────────────────────────────────────────────
  return (
    <div className="card-form">
      <div className="field-group">
        <label>Nombre en la tarjeta</label>
        <input id="card-name" type="text" placeholder="Como aparece en la tarjeta" />
      </div>
      <div className="field-group">
        <label>Número de tarjeta</label>
        <div id="card-number" className="hosted-field" />
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>Fecha de expiración</label>
          <div id="card-expiry" className="hosted-field" />
        </div>
        <div className="field-group">
          <label>CVV</label>
          <div id="card-cvv" className="hosted-field" />
        </div>
      </div>
      <button
        className="pay-btn"
        onClick={handleCardSubmit}
        disabled={!cardReady || processing}
      >
        {processing ? "Procesando..." : `Pagar €${total?.toFixed(2) ?? "—"}`}
      </button>
      <div className="secure-note">🔒 Pago seguro con cifrado SSL</div>
    </div>
  );
}