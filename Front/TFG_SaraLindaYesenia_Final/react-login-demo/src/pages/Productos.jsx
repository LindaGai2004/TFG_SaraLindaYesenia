import { useState } from "react";
import axios from "axios";
import ProductoFiltros from "../components/ProductoFiltros.jsx";
import ProductoLista from "../components/ProductoLista.jsx";
import "./Productos.css"; // Asegúrate de tener estilos

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [orden, setOrden] = useState("destacados");

    const filtrarProductos = async (filtros) => {
        try {
            const response = await axios.get("http://localhost:9001/productos/filtrar", {
                params: filtros
            });
            setProductos(response.data);
        } catch (error) {
            console.error("Error al filtrar productos:", error);
        }
    };

    return (
        <div className="productos-container">
            <aside className="filtros">
                <h3>Filtro por:</h3>
                <ProductoFiltros onFiltrar={filtrarProductos} />
            </aside>

            <main className="resultados">
                <div className="resultados-header">
                    <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                        <option value="destacados">Ordenado por: Destacados</option>
                        <option value="precioAsc">Precio: Menor a mayor</option>
                        <option value="precioDesc">Precio: Mayor a menor</option>
                    </select>
                </div>

                <ProductoLista productos={productos} orden={orden} />
            </main>
        </div>
    );
}