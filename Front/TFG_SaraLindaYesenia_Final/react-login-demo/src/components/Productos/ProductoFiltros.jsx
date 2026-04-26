import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductoFiltros.css";

// He añadido 'initialFilters' a los props para que el useEffect no de error
export default function ProductoFiltros({ 
    onFiltrar, 
    initialFilters = null, // Propiedad añadida
    initialTipo = "", 
    initialGenero = "", 
    initialCategoria = "" 
}) {
    const [tipo, setTipo] = useState(initialTipo);
    const [precio, setPrecio] = useState({ min: 0, max: 200 });
    const [estado, setEstado] = useState("");
    const [idioma, setIdioma] = useState("");
    const [genero, setGenero] = useState(initialGenero ? [initialGenero] : []);
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState(initialCategoria ? [initialCategoria] : []);

    const [idiomasBD, setIdiomasBD] = useState([]);
    const [generosBD, setGenerosBD] = useState([]);
    const [marcasBD, setMarcasBD] = useState([]); 
    const [categoriasBD, setCategoriasBD] = useState([]);

    // Carga inicial de datos desde la BD
    useEffect(() => {
        axios.get("http://localhost:9001/idiomas/todos")
            .then(res => setIdiomasBD(res.data))
            .catch(err => console.error("Error idiomas:", err));

        axios.get("http://localhost:9001/generos/todos")
            .then(res => setGenerosBD(res.data))
            .catch(err => console.error("Error géneros:", err));

        axios.get("http://localhost:9001/marcas/todos")
            .then(res => setMarcasBD(res.data))
            .catch(err => console.error("Error marcas:", err));

        axios.get("http://localhost:9001/categorias/todos")
            .then(res => setCategoriasBD(res.data))
            .catch(err => console.error("Error categorías:", err));
    }, []);

    // Sincronizar estados si cambian los filtros iniciales desde el padre
    useEffect(() => {
        if (!initialFilters) return;

        setTipo(initialFilters.tipo ?? "");
        setEstado(initialFilters.estado ?? "");
        setIdioma(initialFilters.idioma ?? "");
        setGenero(initialFilters.genero ? [initialFilters.genero] : []);
        setMarca(initialFilters.marca ?? "");
        setCategoria(initialFilters.categoria ? [initialFilters.categoria] : []);
        setPrecio({
            min: initialFilters.precioMin ?? 0,
            max: initialFilters.precioMax ?? 200,
        });
    }, [initialFilters]);

    const aplicarFiltros = () => {
        const filtros = {};
    
        if (tipo) filtros.tipo = tipo;
        if (estado) filtros.estado = estado;
        if (idioma) filtros.idioma = idioma;

        if (genero.length > 0) filtros.genero = genero.join(",");
        if (categoria.length > 0) filtros.categoria = categoria.join(",");

        filtros.precioMin = precio.min;
        filtros.precioMax = precio.max;

        if (marca) filtros.marca = marca;

        onFiltrar(filtros);
    };

    return (
        <div className="filtros-container">

            {/* TIPO */}
            <div className="filtro">
                <label>Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="libro">Libro</option>
                    <option value="papeleria">Papelería</option>
                </select>
            </div>

            {/* FILTROS DE LIBRO */}
            {tipo === "libro" && (
                <>
                    <div className="filtro">
                        <label>Idioma</label>
                        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                            <option value="">Todos</option>
                            {idiomasBD.map(i => (
                                <option key={i.idIdioma} value={i.nombreIdioma}>
                                    {i.nombreIdioma}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filtro">
                        <label>Género</label>
                        <div className="genero-checkboxes">
                            {generosBD.map((g) => (
                                <label key={g.idGenero} className="genero-checkbox">
                                    <input
                                        type="checkbox"
                                        value={g.nombreGenero}
                                        checked={genero.includes(g.nombreGenero)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (e.target.checked) {
                                                setGenero([value]); // Solo permite uno según tu lógica actual
                                            } else {
                                                setGenero([]);
                                            }
                                        }}
                                    />
                                    {g.nombreGenero}
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* FILTROS DE PAPELERÍA */}
            {tipo === "papeleria" && (
                <>
                    <div className="filtro">
                        <label>Marca</label>
                        <select value={marca} onChange={(e) => setMarca(e.target.value)}>
                            <option value="">Todas</option>
                            {marcasBD.map(m => (
                                <option key={m.idMarca} value={m.nombreMarca}>
                                    {m.nombreMarca}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filtro">
                        <label>Categoría</label>
                        <div className="genero-checkboxes">
                            {categoriasBD.map(c => (
                                <label key={c.idCategoria} className="genero-checkbox">
                                    <input
                                        type="checkbox"
                                        value={c.nombreCategoria}
                                        checked={categoria.includes(c.nombreCategoria)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (e.target.checked) {
                                                setCategoria([value]);
                                            } else {
                                                setCategoria([]);
                                            }
                                        }}
                                    />
                                    {c.nombreCategoria}
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* PRECIO */}
            <div className="filtro">
                <label>Precio</label>
                <div className="price-slider">
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={precio.min}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val < precio.max) {
                                setPrecio(prev => ({ ...prev, min: val }));
                            }
                        }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={precio.max}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > precio.min) {
                                setPrecio(prev => ({ ...prev, max: val }));
                            }
                        }}
                    />
                </div>
                <div className="price-values">
                    <span>{precio.min} €</span>
                    <span>{precio.max} €</span>
                </div>
            </div>

            {/* ESTADO */}
            <div className="filtro">
                <label>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="AGOTADO">Agotado</option>
                </select>
            </div>

            <button className="btn-filtrar" onClick={aplicarFiltros}>
                Aplicar filtros
            </button>
        </div>
    );
}