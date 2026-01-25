import { useState } from "react";
import axios from "axios";

import ProductoFiltros from "../components/ProductoFiltros.jsx";
import ProductoLista from "../components/ProductoLista.jsx";

export default function Productos() {
    
    const [productos, setProductos] = useState([]);

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
        <div className="productos">
            <h2>Página de productos</h2>

            <ProductoFiltros onFiltrar={filtrarProductos} />

            <ProductoLista productos={productos} />
        </div>
    );
}