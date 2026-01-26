import { Link } from "react-router-dom";

export default function ProductoTarjeta({ producto }) {
    return (
        <div className="tarjeta-producto">
        <Link to={`/producto/${producto.id}`}>
            <img
            src={producto.imagen}
            alt={producto.nombre}
            className="imagen-producto"
            />
            <h3 className="nombre-producto">{producto.nombre}</h3>
        </Link>
        </div>
    );
}