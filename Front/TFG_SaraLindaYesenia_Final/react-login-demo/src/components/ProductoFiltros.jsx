import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductoFiltros.css";

export default function ProductoFiltros({ onFiltrar }) {
    const [tipo, setTipo] = useState("");
    const [precio, setPrecio] = useState("");
    const [estado, setEstado] = useState("");
    const [idioma, setIdioma] = useState("");
    const [genero, setGenero] = useState("");
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState("");

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
        if (precio) filtros.precio = precio;
        if (estado) filtros.estado = estado;
        if (idioma) filtros.idioma = idioma;
        if (genero) filtros.genero = genero;
        if (marca) filtros.marca = marca;
        if (categoria) filtros.categoria = categoria;

        // Enviar solo filtros con valor
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
                        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <option value="">Todos</option>
                            {generosBD.map(g => (
                                <option key={g.idGenero} value={g.nombreGenero}>
                                    {g.nombreGenero}
                                </option>
                            ))}
                        </select>
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
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                            <option value="">Todas</option>
                            {categoriasBD.map(c => (
                                <option key={c.idCategoria} value={c.nombreCategoria}>
                                    {c.nombreCategoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* PRECIO */}
            <div className="filtro">
                <label>Precio máximo</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
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