import { useState, useMemo, useEffect } from 'react';
import Modal from '../../../components/Modal_dashboard';
import { apiGet } from '../../../api/api';
import ProductDashboardSearch from '../../../components/ProductDashboardSearch';

export default function ProductosTrabajador({ books, papeleria }) {
  const [popup, setPopup] = useState(null);

  const [prodCategory, setProdCategory] = useState('Todos');
  const [prodSearch, setProdSearch] = useState('');
  const [prodEstado, setProdEstado] = useState('Todos');

  const [bookIdioma, setBookIdioma] = useState('Todos');
  const [bookGenero, setBookGenero] = useState('Todos');
  const [bookPrecio, setBookPrecio] = useState('Todos');

  const [papMarca, setPapMarca] = useState('Todos');
  const [papCategoria, setPapCategoria] = useState('Todos');
  const [papPrecio, setPapPrecio] = useState('Todos');

  const [apiBooks, setApiBooks] = useState([]);
  const [apiPapeleria, setApiPapeleria] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [idiomasBD, setIdiomasBD] = useState([]);

  useEffect(() => {
    const fetchIdiomas = async () => {
      try {
        const data = await apiGet('/idiomas/todos');
        setIdiomasBD(Array.isArray(data) ? data : []);
      } catch (e) {
        setIdiomasBD([]);
      }
    };
    fetchIdiomas();
  }, []);

  useEffect(() => {
    const fetchBuscar = async () => {
      if (!prodSearch || prodSearch.trim().length < 1) {
        setIsSearching(false);
        setApiBooks([]);
        setApiPapeleria([]);
        setSearchLoading(false);
        return;
      }
      setIsSearching(true);
      setSearchLoading(true);
      try {
        const data = await apiGet(`/productos/buscar/todos?texto=${encodeURIComponent(prodSearch)}`);
        if (!data || !Array.isArray(data)) { setApiBooks([]); setApiPapeleria([]); return; }
        setApiBooks(data.filter(p => p.isbn !== undefined && p.isbn !== null));
        setApiPapeleria(data.filter(p => p.isbn === undefined || p.isbn === null));
      } catch (e) {
        setApiBooks([]); setApiPapeleria([]);
      } finally {
        setSearchLoading(false);
      }
    };
    const timer = setTimeout(fetchBuscar, 300);
    return () => clearTimeout(timer);
  }, [prodSearch]);

  const searchResults = useMemo(
    () => [...apiBooks, ...apiPapeleria],
    [apiBooks, apiPapeleria]
  );

  useEffect(() => {
    const fetchEstado = async () => {
      if (!prodEstado || prodEstado === 'Todos') {
        setApiBooks([]); setApiPapeleria([]); return;
      }
      try {
        const data = await apiGet(`/productos/filtro/estado?estadoProducto=${prodEstado}`);
        if (!data || !Array.isArray(data)) { setApiBooks([]); setApiPapeleria([]); return; }
        setApiBooks(data.filter(p => p.isbn !== undefined && p.isbn !== null));
        setApiPapeleria(data.filter(p => p.isbn === undefined || p.isbn === null));
      } catch (e) {
        setApiBooks([]); setApiPapeleria([]);
      }
    };
    fetchEstado();
  }, [prodEstado]);

  const filteredBooks = useMemo(() =>
    (isSearching ? apiBooks : (apiBooks.length ? apiBooks : books)).filter(b => {
      if (bookIdioma !== 'Todos' && b.idioma?.nombreIdioma !== bookIdioma) return false;
      if (bookGenero !== 'Todos' && b.genero?.nombreGenero !== bookGenero) return false;
      if (bookPrecio === 'Bajo' && b.precio > 15) return false;
      if (bookPrecio === 'Medio' && (b.precio <= 15 || b.precio > 25)) return false;
      if (bookPrecio === 'Alto' && b.precio <= 25) return false;
      return true;
    }), [isSearching, apiBooks, books, bookIdioma, bookGenero, bookPrecio]);

  const filteredStationery = useMemo(() =>
    (isSearching ? apiPapeleria : (apiPapeleria.length ? apiPapeleria : papeleria)).filter(s => {
      if (papMarca !== 'Todos' && s.marca?.nombreMarca !== papMarca) return false;
      if (papCategoria !== 'Todos' && s.categoria?.nombreCategoria !== papCategoria) return false;
      if (papPrecio === 'Bajo' && s.precio > 5) return false;
      if (papPrecio === 'Medio' && (s.precio <= 5 || s.precio > 20)) return false;
      if (papPrecio === 'Alto' && s.precio <= 20) return false;
      return true;
    }), [isSearching, apiPapeleria, papeleria, papMarca, papCategoria, papPrecio]);

  const showBooks = prodCategory === 'Todos' || prodCategory === 'Libro';
  const showPap   = prodCategory === 'Todos' || prodCategory === 'Papeleria';

  return (
    <div>
      {/* Título — sin botón Añadir, sin botones de acción */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Productos</h2>
          <p className="text-xs text-secondary">Consulta de libros y papelerías</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['Todos', 'Libro', 'Papeleria'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setProdCategory(cat);
              setBookIdioma('Todos'); setBookGenero('Todos'); setBookPrecio('Todos');
              setPapMarca('Todos'); setPapCategoria('Todos'); setPapPrecio('Todos');
            }}
            className={`tab-btn ${prodCategory === cat ? 'active' : ''}`}
          >
            {cat === 'Libro' ? '📚 Libros' : cat === 'Papeleria' ? '📎 Papelerías' : '🗂️ Todos'}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <ProductDashboardSearch
        value={prodSearch}
        onChange={setProdSearch}
        results={searchResults}
        loading={searchLoading}
        onSelect={(producto) => {
          setProdSearch(producto.nombreProducto ?? '');
          setPopup({
            type: producto.isbn !== undefined && producto.isbn !== null ? 'book' : 'papeleria',
            data: producto,
          });
        }}
      />

      {/* Filtros */}
      <div className="filters-row">
        <select value={prodEstado} onChange={e => setProdEstado(e.target.value)} className="input-field filter-select">
          <option value="Todos">Todos</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="AGOTADO">Agotado</option>
        </select>

        {prodCategory === 'Libro' && <>
          <select value={bookIdioma} onChange={e => setBookIdioma(e.target.value)} className="input-field filter-select">
            <option value="Todos">Todos</option>
            {idiomasBD.map(i => <option key={i.idIdioma} value={i.nombreIdioma}>{i.nombreIdioma}</option>)}
          </select>
          <select value={bookGenero} onChange={e => setBookGenero(e.target.value)} className="input-field filter-select">
            <option value="Todos">Todos</option>
            {books.map(b => b.genero).filter(Boolean)
              .reduce((acc, curr) => { if (!acc.find(g => g.idGenero === curr.idGenero)) acc.push(curr); return acc; }, [])
              .map(g => <option key={g.idGenero} value={g.nombreGenero}>{g.nombreGenero}</option>)}
          </select>
          <select value={bookPrecio} onChange={e => setBookPrecio(e.target.value)} className="input-field filter-select">
            <option value="Todos">Precios: todos</option>
            <option value="Bajo">Bajo (&lt;$15)</option>
            <option value="Medio">Medio ($15-25)</option>
            <option value="Alto">Alto (&gt;$25)</option>
          </select>
        </>}

        {prodCategory === 'Papeleria' && <>
          <select value={papMarca} onChange={e => setPapMarca(e.target.value)} className="input-field filter-select">
            <option value="Todos">Marcas: Todos</option>
            {papeleria.map(s => s.marca).filter(Boolean)
              .reduce((acc, curr) => { if (!acc.find(c => c.idMarca === curr.idMarca)) acc.push(curr); return acc; }, [])
              .map(s => <option key={s.idMarca} value={s.nombreMarca}>{s.nombreMarca}</option>)}
          </select>
          <select value={papCategoria} onChange={e => setPapCategoria(e.target.value)} className="input-field filter-select">
            <option value="Todos">Categorías: todos</option>
            {papeleria.map(s => s.categoria).filter(Boolean)
              .reduce((acc, curr) => { if (!acc.find(c => c.idCategoria === curr.idCategoria)) acc.push(curr); return acc; }, [])
              .map(s => <option key={s.idCategoria} value={s.nombreCategoria}>{s.nombreCategoria}</option>)}
          </select>
          <select value={papPrecio} onChange={e => setPapPrecio(e.target.value)} className="input-field filter-select">
            <option value="Todos">Precios: Todos</option>
            <option value="Bajo">Bajo (&lt;$5)</option>
            <option value="Medio">Medio ($5-20)</option>
            <option value="Alto">Alto (&gt;$20)</option>
          </select>
        </>}
      </div>

      {/* Tabla libros — sin botones de acción */}
      {showBooks && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span>📚</span>
            <h3 className="text-xs font-bold text-green">
              Libros <span className="font-normal text-muted">({filteredBooks.length})</span>
            </h3>
          </div>
          <div className="table-wrapper mb-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Autor</th>
                  <th>ISBN</th>
                  <th>Editorial</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b.idProducto} onClick={() => setPopup({ type: 'book', data: b })} className="cursor-pointer">
                    <td className="text-xs font-semibold text-primary">{b.nombreProducto}</td>
                    <td className="text-xs text-secondary">{b.autor}</td>
                    <td className="text-xs text-secondary">{b.isbn}</td>
                    <td className="text-xs text-secondary">{b.editorial}</td>
                    <td className="text-xs font-bold text-green">${b.precio.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${b.estadoProducto === 'DISPONIBLE' ? 'badge-success' : 'badge-error'}`}>
                        {b.estadoProducto}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{b.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tabla papelería — sin botones de acción */}
      {showPap && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span>📎</span>
            <h3 className="text-xs font-bold text-blue">
              Papelerías <span className="font-normal text-muted">({filteredStationery.length})</span>
            </h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredStationery.map(s => (
                  <tr key={s.idProducto} onClick={() => setPopup({ type: 'papeleria', data: s })} className="cursor-pointer">
                    <td className="text-xs font-semibold text-primary">{s.nombreProducto}</td>
                    <td className="text-xs text-secondary">{s.marca?.nombreMarca}</td>
                    <td className="text-xs text-secondary">{s.categoria?.nombreCategoria}</td>
                    <td className="text-xs font-bold text-blue">${s.precio.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${s.estadoProducto === 'DISPONIBLE' ? 'badge-success' : 'badge-error'}`}>
                        {s.estadoProducto}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{s.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Popup detalle libro */}
      {popup?.type === 'book' && (
        <Modal open width="max-w-md" onClose={() => setPopup(null)} title="📚 Libro">
          <h4 className="font-bold text-base text-primary mb-1">{popup.data.nombreProducto}</h4>
          <p className="text-xs text-secondary mb-3">Autor: {popup.data.autor}</p>
          {[
            ['ISBN', popup.data.isbn],
            ['Editorial', popup.data.editorial],
            ['Idioma', popup.data.idioma?.nombreIdioma],
            ['Género', popup.data.genero?.nombreGenero],
            ['Precio', `$${(popup.data.precio ?? 0).toFixed(2)}`],
            ['Stock', popup.data.stock],
            ['Estado', popup.data.estadoProducto],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Estado' && v === 'AGOTADO' ? 'text-error' : k === 'Precio' ? 'text-green' : 'text-primary'}`}>{v}</span>
            </div>
          ))}
        </Modal>
      )}

      {/* Popup detalle papelería */}
      {popup?.type === 'papeleria' && (
        <Modal open width="max-w-md" onClose={() => setPopup(null)} title="📎 Papelería">
          <h4 className="font-bold text-base text-primary mb-1">{popup.data.nombreProducto}</h4>
          <p className="text-xs text-secondary mb-3">{popup.data.marca?.nombreMarca} · {popup.data.categoria?.nombreCategoria}</p>
          {[
            ['Marca', popup.data.marca?.nombreMarca],
            ['Categoría', popup.data.categoria?.nombreCategoria],
            ['Precio', `$${popup.data.precio.toFixed(2)}`],
            ['Stock', popup.data.stock],
            ['Estado', popup.data.estadoProducto],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Estado' && v === 'AGOTADO' ? 'text-error' : k === 'Precio' ? 'text-blue' : 'text-primary'}`}>{v}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
