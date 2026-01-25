import ProductoTarjeta from "./ProductoTarjeta.jsx";
import "./ProductoLista.css";

export default function ProductoLista({ productos }) {

    if (!productos || productos.length === 0) {
        return <p>No hay productos que coincidan con los filtros.</p>;
    }

    return (
        <div className="grid-productos">
        {productos.map((producto) => (
            <ProductoTarjeta key={producto.idProducto} producto={producto} />
        ))}
        </div>
    );
}