import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiPost, apiGet } from "../../api/api";

export default function PaypalSuccess() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = searchParams.get("token");

    if (!token) {
      navigate("/productos");
      return;
    }

    const capturar = async () => {
      try {
        await apiPost(`/paypal/capture?token=${token}`);

        const pedido = await apiGet("/carrito");

        navigate("/resumen", { state: pedido });

      } catch (error) {
        console.error(error);
        alert("Error confirmando el pago");
        navigate("/productos");
      }
    };

    capturar();

  }, []);

  return <p>Procesando pago...</p>;
}