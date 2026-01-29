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

    useEffect(() => {
        axios.get("http://localhost:9001/idiomas")
            .then(res => setIdiomasBD(res.data))
            .catch(err => console.error("Error cargando idiomas:", err));

        axios.get("http://localhost:9001/generos")
            .then(res => setGenerosBD(res.data))
            .catch(err => console.error("Error cargando géneros:", err));
    }, []);

    const aplicarFiltros = () => {
        onFiltrar({
            tipo_producto: tipo,
            precio: precio,
            estado: estado,
            idioma: idioma,
            genero: genero,
            marca: marca,
            categoria: categoria
        });
    };

    return (
        <div className="filtros-container">

            {/* TIPO */}
            <div className="filtro">
                <label>Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="LIBRO">Libro</option>
                    <option value="PAPELERIA">Papelería</option>
                </select>
            </div>

            {/* FILTROS DE LIBRO */}
            {tipo === "LIBRO" && (
                <>
                    <div className="filtro">
                        <label>Idioma</label>
                        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                            <option value="">Todos</option>
                            {idiomasBD.map(i => (
                                <option key={i.id_idioma} value={i.nombre_idioma}>
                                    {i.nombre_idioma}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filtro">
                        <label>Género</label>
                        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <option value="">Todos</option>
                            {generosBD.map(g => (
                                <option key={g.id_genero} value={g.nombre_genero}>
                                    {g.nombre_genero}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* FILTROS DE PAPELERÍA */}
            {tipo === "PAPELERIA" && (
                <>
                    <div className="filtro">
                        <label>Marca</label>
                        <input
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                        />
                    </div>

                    <div className="filtro">
                        <label>Categoría</label>
                        <input
                            type="text"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        />
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