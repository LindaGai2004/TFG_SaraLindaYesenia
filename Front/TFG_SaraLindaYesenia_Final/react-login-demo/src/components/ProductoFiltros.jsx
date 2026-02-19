import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductoFiltros.css";

export default function ProductoFiltros({ onFiltrar }) {
    const [tipo, setTipo] = useState("");
    const [precio, setPrecio] = useState({ min: 0, max: 200 });
    const [estado, setEstado] = useState("");
    const [idioma, setIdioma] = useState("");
    const [genero, setGenero] = useState([]);
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState([]);

    const [idiomasBD, setIdiomasBD] = useState([]);
    const [generosBD, setGenerosBD] = useState([]);
    const [marcasBD, setMarcasBD] = useState([]); 
    const [categoriasBD, setCategoriasBD] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:9001/idiomas/todos")
            .then(res => setIdiomasBD(res.data));

        axios.get("http://localhost:9001/generos/todos")
            .then(res => setGenerosBD(res.data));

        axios.get("http://localhost:9001/marcas/todos")
            .then(res => setMarcasBD(res.data));

        axios.get("http://localhost:9001/categorias/todos")
            .then(res => setCategoriasBD(res.data));
    }, []);

    const aplicarFiltros = () => {
        const filtros = {};
    
        if (tipo) filtros.tipo = tipo;
        if (estado) filtros.estado = estado;
        if (idioma) filtros.idioma = idioma;
    
        if (genero.length > 0) filtros.genero = genero;
    
        filtros.precioMin = precio.min;
        filtros.precioMax = precio.max;
    
        if (marca) filtros.marca = marca;
        if (categoria.length > 0) filtros.categoria = categoria;
    
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
                            {generosBD.map((g, index) => (
                            <label key={g.idGenero} className="genero-checkbox">
                                <input
                                type="checkbox"
                                value={g.nombreGenero}
                                checked={genero.includes(g.nombreGenero)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (e.target.checked) {
                                    setGenero(prev => [...prev, value]);
                                    } else {
                                    setGenero(prev => prev.filter(g => g !== value));
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
                                                setCategoria(prev => [...prev, value]);
                                            } else {
                                                setCategoria(prev => prev.filter(cat => cat !== value));
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
                    onChange={(e) => setPrecio(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />

                    <input
                    type="range"
                    min="0"
                    max="200"
                    value={precio.max}
                    onChange={(e) => setPrecio(prev => ({ ...prev, max: Number(e.target.value) }))}
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