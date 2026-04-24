import { useNavigate } from "react-router-dom";

function PaypalCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Pago cancelado</h2>
      <p>Has cancelado el pago con PayPal.</p>
      <button onClick={() => navigate("/checkout")}>
        Volver al pago
      </button>
    </div>
  );
}

export default PaypalCancel;