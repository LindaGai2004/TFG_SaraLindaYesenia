import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "../api/api";
import ProductoFiltros from "../components/Productos/ProductoFiltros.jsx";
import ProductoLista from "../components//Productos/ProductoLista.jsx";
import "./Productos.css";


export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [orden, setOrden] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const [searchParams] = useSearchParams();
    const productosPorPagina = 24;

    // Función para el buscador de los productos
    const manejarBusqueda = async (e) => {
        const texto = e.target.value;
        setBusqueda(texto);
        setPaginaActual(1);
        if (texto.trim().length > 0) {
            try {
                const data = await apiGet(`/productos/buscar/todos?texto=${texto}`);
                setProductos(Array.isArray(data) ? data : []);
            } catch (error) {
                setProductos([]);
            }
        } else {
            cargarTodos();
        }
    };

    // Mueve filtrarProductos ANTES del useEffect para que pueda usarla
    const filtrarProductos = async (filtros) => {
        try {
            const params = new URLSearchParams(filtros).toString();
            const data = await apiGet(`/productos/filtrar?${params}`);
            setProductos(data);
            setPaginaActual(1);
        } catch (error) {
            console.error("Error al filtrar:", error);
        }
    };

    async function cargarTodos() {
        try {
            const data = await apiGet("/productos/todos");
            setProductos(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    // Un solo useEffect
    useEffect(() => {
        const genero = searchParams.get("genero");
        const categoria = searchParams.get("categoria");
        const tipo = searchParams.get("tipo");

        if (genero || categoria || tipo) {
            const params = {};
            if (tipo) params.tipo = tipo;
            if (genero) params.genero = genero;
            if (categoria) params.categoria = categoria;

            apiGet(`/productos/filtrar-chatbot?${new URLSearchParams(params).toString()}`)
                .then(data => setProductos(data))
                .catch(err => console.error("Error:", err));
        } else {
            cargarTodos();
        }
    }, [searchParams]);

    const productosOrdenados = [...productos];

    if (orden === "alfbAsc") {
        productosOrdenados.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
    }
    if (orden === "alfbDesc") {
        productosOrdenados.sort((a, b) => b.nombreProducto.localeCompare(a.nombreProducto));
    }
    if (orden === "precioAsc") {
        productosOrdenados.sort((a, b) => a.precio - b.precio);
    }
    if (orden === "precioDesc") {
        productosOrdenados.sort((a, b) => b.precio - a.precio);
    }

    const indexInicio = (paginaActual - 1) * productosPorPagina;
    const indexFin = indexInicio + productosPorPagina;
    const productosPaginados = productosOrdenados.slice(indexInicio, indexFin);
    const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

    return (
        <div className="productos-container">
            <aside className="filtros">
                <h3>Filtro por:</h3>
                <ProductoFiltros
                    onFiltrar={filtrarProductos}
                    initialTipo={searchParams.get("tipo") || ""}
                    initialGenero={searchParams.get("genero") || ""}
                    initialCategoria={searchParams.get("categoria") || ""}
                />
            </aside>

            <main className="resultados">
                <div className="resultados-header">
                    {/* Buscador de productos */}
                    <div className="buscador-tienda">
                        <input
                            type="text"
                            placeholder="Buscar libros o papelería..."
                            value={busqueda}
                            onChange={manejarBusqueda}
                            className="input-busqueda"
                        />
                    </div>

                    {/* Ordenar */}
                    <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                        <option value="">Ordenar por: </option>
                        <option value="alfbAsc">Alfabéticamente: a - z</option>
                        <option value="alfbDesc">Alfabéticamente: z - a</option>
                        <option value="precioAsc">Precio: Menor a mayor</option>
                        <option value="precioDesc">Precio: Mayor a menor</option>
                    </select>
                </div>

                <ProductoLista productos={productosPaginados} />

                <div className="paginacion">
                    <button disabled={paginaActual === 1}
                        onClick={() => setPaginaActual(paginaActual - 1)}>
                        ← Anterior
                    </button>
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button key={i}
                            className={paginaActual === i + 1 ? "pagina-activa" : ""}
                            onClick={() => setPaginaActual(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                    <button disabled={paginaActual === totalPaginas}
                        onClick={() => setPaginaActual(paginaActual + 1)}>
                        Siguiente →
                    </button>
                </div>
            </main>
        </div>
    );
}