import { useState } from "react";
import axios from "axios";
import ProductoFiltros from "../components/ProductoFiltros.jsx";
import ProductoLista from "../components/ProductoLista.jsx";
import "./Productos.css";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [orden, setOrden] = useState("");

    const filtrarProductos = async (filtros) => {
        try {
            const response = await axios.get(
                "http://localhost:9001/productos/filtrar",
                { params: filtros }
            );
            setProductos(response.data);
        } catch (error) {
            console.error("Error al filtrar productos:", error);
        }
    };

    // Ordenar según precio o alfabéticamente
    const productosOrdenados = [...productos];

    if (orden) {
        if (orden === "alfbAsc") {
            productosOrdenados.sort((a, b) =>
                a.nombreProducto.localeCompare(b.nombreProducto)
            );
        }

        if (orden === "alfbDesc") {
            productosOrdenados.sort((a, b) =>
                b.nombreProducto.localeCompare(a.nombreProducto)
            );
        }

        if (orden === "precioAsc") {
            productosOrdenados.sort((a, b) => a.precio - b.precio);
        }

        if (orden === "precioDesc") {
            productosOrdenados.sort((a, b) => b.precio - a.precio);
        }
    }


    return (
        <div className="productos-container">
            <aside className="filtros">
                <h3>Filtro por:</h3>
                <ProductoFiltros onFiltrar={filtrarProductos} />
            </aside>

            <main className="resultados">
                <div className="resultados-header">
                    <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                        <option value="">Sin orden</option>
                        <option value="alfbAsc">Alfabéticamente: a - z</option>
                        <option value="alfbDesc">Alfabéticamente: z - a</option>
                        <option value="precioAsc">Precio: Menor a mayor</option>
                        <option value="precioDesc">Precio: Mayor a menor</option>
                    </select>
                </div>

                <ProductoLista productos={productosOrdenados} />
            </main>
        </div>
    );
}