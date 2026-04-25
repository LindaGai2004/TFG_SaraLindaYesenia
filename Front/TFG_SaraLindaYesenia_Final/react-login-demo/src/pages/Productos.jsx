import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductoFiltros from "../components/Productos/ProductoFiltros.jsx";
import ProductoLista from "../components//Productos/ProductoLista.jsx";
import "./Productos.css";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [searchParams] = useSearchParams();
    const [orden, setOrden] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 18;
    const searchText = searchParams.get("search") ?? "";

    const initialFilters = useMemo(() => ({
        tipo: searchParams.get("tipo") ?? "",
        genero: searchParams.get("genero") ?? "",
        categoria: searchParams.get("categoria") ?? "",
        idioma: searchParams.get("idioma") ?? "",
        estado: searchParams.get("estado") ?? "",
    }), [searchParams]);

    const hasInitialFilters = useMemo(
        () => Object.values(initialFilters).some(Boolean),
        [initialFilters]
    );
    const hasSearchText = searchText.trim().length > 0;

    useEffect(() => {
        async function cargarInicial() {
            try {
                let response;

                if (hasSearchText) {
                    response = await axios.get("http://localhost:9001/productos/buscar/todos", {
                        params: { texto: searchText.trim() }
                    });
                } else if (hasInitialFilters) {
                    response = await axios.get("http://localhost:9001/productos/filtrar", { params: initialFilters });
                } else {
                    response = await axios.get("http://localhost:9001/productos/todos");
                }

                setProductos(Array.isArray(response.data) ? response.data : []);
                setPaginaActual(1);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setProductos([]);
            }
        }

        cargarInicial();
    }, [hasInitialFilters, initialFilters, hasSearchText, searchText]);

    const filtrarProductos = async (filtros) => {
        try {
            const response = await axios.get(
                "http://localhost:9001/productos/filtrar",
                { params: filtros }
            );
            setProductos(response.data);
            setPaginaActual(1);
        } catch (error) {
            console.error("Error al filtrar productos:", error);
        }
    };

    const productosOrdenados = [...productos];

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

    const indexInicio = (paginaActual - 1) * productosPorPagina;
    const indexFin = indexInicio + productosPorPagina;
    const productosPaginados = productosOrdenados.slice(indexInicio, indexFin);
    const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

    return (
        <div className="productos-container">
            <aside className="filtros">
                <h3>Filtro por:</h3>
                <ProductoFiltros onFiltrar={filtrarProductos} initialFilters={initialFilters} />
            </aside>

            <main className="resultados">
                <div className="resultados-header">
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
                    <button
                        disabled={paginaActual === 1}
                        onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                        ← Anterior
                    </button>

                    {[...Array(totalPaginas)].map((_, i) => (
                        <button
                            key={i}
                            className={paginaActual === i + 1 ? "pagina-activa" : ""}
                            onClick={() => setPaginaActual(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                        Siguiente →
                    </button>
                </div>
            </main>
        </div>
    );
}
