import { useState } from "react";

export default function ProductoFiltros({ onFiltrar }) {
    const [tipo, setTipo] = useState("");
    const [precio, setPrecio] = useState("");
    const [estado, setEstado] = useState("");
    const [idioma, setIdioma] = useState("");
    const [genero, setGenero] = useState("");
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState("");

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
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                </select>
            </div>

            <div className="filtro">
                <label>Género</label>
                <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="">Todos</option>
                <option value="Fantasia">Fantasía</option>
                <option value="Terror">Terror</option>
                <option value="Romance">Romance</option>
                </select>
            </div>
            </>
        )}

        {/* FILTROS DE PAPELERÍA */}
        {tipo === "papeleria" && (
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
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
            </select>
        </div>

        <button className="btn-filtrar" onClick={aplicarFiltros}>
            Aplicar filtros
        </button>
        </div>
    );
}