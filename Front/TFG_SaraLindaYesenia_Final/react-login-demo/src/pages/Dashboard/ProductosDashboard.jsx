import { useState, useMemo , useEffect} from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';
import { apiGet } from '../../api/api';

export default function Productos({
  books,
  papeleria,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onAddPapeleria,
  onEditPapeleria,
  onDeletePapeleria,
}) {



  const [popup, setPopup] = useState(null);
  const [formModal, setFormModal] = useState(null);

  // 筛选器状态
  const [prodCategory, setProdCategory] = useState('Todos');
  const [prodSearch, setProdSearch] = useState('');
  const [prodEstado, setProdEstado] = useState('Todos');

  // 图书筛选器
  const [bookIdioma, setBookIdioma] = useState('Todos');
  const [bookGenero, setBookGenero] = useState('Todos');
  const [bookPrecio, setBookPrecio] = useState('Todos');

  // 文具筛选器
  const [papMarca, setPapMarca] = useState('Todos');
  const [papCategoria, setPapCategoria] = useState('Todos');
  const [papPrecio, setPapPrecio] = useState('Todos');

  const [apiBooks, setApiBooks] = useState([]);
  const [apiPapeleria, setApiPapeleria] = useState([]);
  const [isSearching, setIsSearching] = useState(false); 
  const [idiomasBD, setIdiomasBD] = useState([]);

useEffect(() => {
  const fetchIdiomas = async () => {
    try {
      const data = await apiGet('/idiomas/todos');
      setIdiomasBD(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error cargando idiomas:', e);
      setIdiomasBD([]);
    }
  };

  fetchIdiomas();
}, []);

  //para buscador
useEffect(() => {
  const fetchBuscar = async () => {
    if (!prodSearch || prodSearch.trim().length < 2) {
      setIsSearching(false);  // ← 不在搜索状态
      setApiBooks([]);
      setApiPapeleria([]);
      return;
    }

    setIsSearching(true);  // ← 正在搜索

    try {
      const data = await apiGet(
        `/productos/buscar/todos?texto=${encodeURIComponent(prodSearch)}`
      );

      if (!data || !Array.isArray(data)) {
        setApiBooks([]);
        setApiPapeleria([]);
        return;
      }

      setApiBooks(data.filter(p => p.isbn !== undefined && p.isbn !== null));
      setApiPapeleria(data.filter(p => p.isbn === undefined || p.isbn === null));

    } catch (e) {
      console.error("Error búsqueda:", e);
      setApiBooks([]);
      setApiPapeleria([]);
    }
  };

  const timer = setTimeout(fetchBuscar, 300);
  return () => clearTimeout(timer);

}, [prodSearch]);

//Para filtro de estado
useEffect(() => {
  const fetchEstado = async () => {
    if (!prodEstado || prodEstado === 'Todos') {
      setApiBooks([]);
      setApiPapeleria([]);
      return;
    }

    try {
      const data = await apiGet(
        `/productos/filtro/estado?estadoProducto=${prodEstado}`
      );
      if (!data || !Array.isArray(data)) {
        setApiBooks([]);
        setApiPapeleria([]);
        return;
      }

    setApiBooks(data.filter(p => p.isbn !== undefined && p.isbn !== null));
    setApiPapeleria(data.filter(p => p.isbn === undefined || p.isbn === null));

    } catch (e) {
      console.error("Error:", e);
      setApiBooks([]);
      setApiPapeleria([]);
    }
  };

  fetchEstado();
}, [prodEstado]);

  // 筛选后的数据
const filteredBooks = useMemo(() => 
  (isSearching ? apiBooks : (apiBooks.length ? apiBooks : books)).filter(b => {
  //  ↑ 正在搜索时只用apiBooks，不回退到books
    if (bookIdioma !== 'Todos' && b.idioma?.nombreIdioma !== bookIdioma) return false;
    if (bookGenero !== 'Todos' && b.genero?.nombreGenero !== bookGenero) return false;
    if (bookPrecio === 'Bajo' && b.precio > 15) return false;
    if (bookPrecio === 'Medio' && (b.precio <= 15 || b.precio > 25)) return false;
    if (bookPrecio === 'Alto' && b.precio <= 25) return false;
    return true;
}), [isSearching, apiBooks, books, bookIdioma, bookGenero, bookPrecio]);

const filteredStationery = useMemo(() => 
  (isSearching ? apiPapeleria : (apiPapeleria.length ? apiPapeleria : papeleria)).filter(s => {
  //  ↑ 正在搜索时只用apiPapeleria，不回退到papeleria
    if (papMarca !== 'Todos' && s.marca?.nombreMarca !== papMarca) return false;
    if (papCategoria !== 'Todos' && s.categoria?.nombreCategoria !== papCategoria) return false;
    if (papPrecio === 'Bajo' && s.precio > 5) return false;
    if (papPrecio === 'Medio' && (s.precio <= 5 || s.precio > 20)) return false;
    if (papPrecio === 'Alto' && s.precio <= 20) return false;
    return true;
}), [isSearching, apiPapeleria, papeleria, papMarca, papCategoria, papPrecio]);

  const showBooks = prodCategory === 'Todos' || prodCategory === 'Libro';
  const showPap = prodCategory === 'Todos' || prodCategory === 'Papeleria';

  return (
    <div>
      {/* 标题 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Los productos</h2>
          <p className="text-xs text-secondary">Libros y papelerias</p>
        </div>
        <button 
          onClick={() => setFormModal({ type: 'add-product' })} 
          className="btn btn-primary"
        >
          <Plus size={14} /> Añadir
        </button>
      </div>

      {/* 分类标签 */}
      <div className="tabs">
        {['Todos', 'Libro', 'Papeleria'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setProdCategory(cat);
              setBookIdioma('Todos');
              setBookGenero('Todos');
              setBookPrecio('Todos');
              setPapMarca('Todos');
              setPapCategoria('Todos');
              setPapPrecio('Todos');
            }}
            className={`tab-btn ${prodCategory === cat ? 'active' : ''}`}
          >
            {cat === 'Libro' ? '📚 Libros' : cat === 'Papeleria' ? '📎 Papelerias' : '🗂️ Todos'}
          </button>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="search-wrapper mb-3">
        <Search size={15} className="search-icon" />
        <input
          placeholder="Buscar por nombre, autor, marca..."
          value={prodSearch}
          onChange={e => setProdSearch(e.target.value)}
          className="input-field search-input"
        />
      </div>

      {/* 筛选器 */}
      <div className="filters-row">
        <select 
          value={prodEstado} 
          onChange={e => setProdEstado(e.target.value)} 
          className="input-field filter-select"
        >
          <option value="Todos">Todos</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="AGOTADO">Agotado</option>
        </select>

        {prodCategory === 'Libro' && <>
          {idiomasBD.length > 0 ? (
            <select value={bookIdioma} onChange={e => setBookIdioma(e.target.value)} className="input-field filter-select">
              <option value="Todos">Todos</option>
              {idiomasBD.map(i => (
                <option key={i.idIdioma} value={i.nombreIdioma}>{i.nombreIdioma}</option>
              ))}
            </select>
          ) : (
            <select value={bookIdioma} onChange={e => setBookIdioma(e.target.value)} className="input-field filter-select">
              <option value="Todos">Todos</option>
              <option value="Espa?ol">Espa?ol</option>
              <option value="Ingl?s">Ingles</option>
            </select>
          )}
          <select value={bookGenero} onChange={e => setBookGenero(e.target.value)} className="input-field filter-select">
          <option value="Todos">Todos</option>

          {/**SIN REPETIR */}
            {books
              .map(b => b.genero)
              .filter(Boolean)
              .reduce((acc, curr) => {
                if (!acc.find(g => g.idGenero === curr.idGenero)) acc.push(curr);
                return acc;
              }, [])
              .map(g => (
                <option key={g.idGenero} value={g.nombreGenero}>{g.nombreGenero}</option>
              ))}

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
            {papeleria
              .map(s => s.marca)
              .filter(Boolean)
              .reduce((acc, curr) => {
                if (!acc.find(c => c.idMarca === curr.idMarca)) acc.push(curr);
                return acc;
              }, [])
              .map(s => (
                <option key={s.idMarca} value={s.nombreMarca}>{s.nombreMarca}</option>
              ))}
          </select>
          <select value={papCategoria} onChange={e => setPapCategoria(e.target.value)} className="input-field filter-select">
            <option value="Todos">Categorias: todos</option>
            {papeleria
              .map(s => s.categoria)
              .filter(Boolean)
              .reduce((acc, curr) => {
                if (!acc.find(c => c.idCategoria === curr.idCategoria)) acc.push(curr);
                return acc;
              }, [])
              .map(s => (
                <option key={s.idCategoria} value={s.nombreCategoria}>{s.nombreCategoria}</option>
              ))}
          </select>
          <select value={papPrecio} onChange={e => setPapPrecio(e.target.value)} className="input-field filter-select">
            <option value="Todos">Precios: Todos</option>
            <option value="Bajo">Bajo (&lt;$5)</option>
            <option value="Medio">Medio ($5-20)</option>
            <option value="Alto">Alto (&gt;$20)</option>
          </select>
        </>}
      </div>

      {/* 图书表格 */}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b.id} onClick={() => setPopup({ type: 'book', data: b })} className="cursor-pointer">
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
                    <td>
                      <div className="table-actions">
                        <button onClick={e => { e.stopPropagation(); setFormModal({ type: 'edit-book', data: b }); }} className="btn-icon edit">
                          <Edit size={13} color="#6d96a6" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); onDeleteBook(b.idProducto); }} className="btn-icon delete">
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 文具表格 */}
      {showPap && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span>📎</span>
            <h3 className="text-xs font-bold text-blue">
              Papelerias <span className="font-normal text-muted">({filteredStationery.length})</span>
            </h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredStationery.map(s => (
                  <tr key={s.id} onClick={() => setPopup({ type: 'papeleria', data: s })} className="cursor-pointer">
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
                    <td>
                      <div className="table-actions">
                        <button onClick={e => { e.stopPropagation(); setFormModal({ type: 'edit-papeleria', data: s }); }} className="btn-icon edit">
                          <Edit size={13} color="#3b82f6" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); onDeletePapeleria(s.idProducto); }} className="btn-icon delete">
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 弹窗渲染 */}
      {renderPopup()}
      {renderFormModal()}
    </div>
  );

  // 详情弹窗
  function renderPopup() {
    if (!popup) return null;
    const { type, data } = popup;

    if (type === 'book') {
      return (
        <Modal open width="max-w-md" onClose={() => setPopup(null)} title="📚 Libros">
          <h4 className="font-bold text-base text-primary mb-1">{data.nombreProducto}</h4>
          <p className="text-xs text-secondary mb-3">Autor: {data.autor}</p>
          {[
            ['ISBN', data.isbn],
            ['Editorial', data.editorial],
            ['Idioma', data.idioma?.nombreIdioma],
            ['Genero', data.genero?.nombreGenero],
            ['Precio', `$${(data.precio ?? 0).toFixed(2)}`],
            ['Estado', data.estadoProducto],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Estado' && v === 'AGOTADO' ? 'text-error' : k === 'Precio' ? 'text-green' : 'text-primary'}`}>
                {v}
              </span>
            </div>
          ))}
        </Modal>
      );
    }

    if (type === 'papeleria') {
      return (
        <Modal open width="max-w-md" onClose={() => setPopup(null)} title="📎 Papelerias">
          <h4 className="font-bold text-base text-primary mb-1">{data.nombreProducto}</h4>
          <p className="text-xs text-secondary mb-3">{data.marca?.nombreMarca} · {data.categoria?.nombreCategoria}</p>
          {[
            ['Marca', data.marca?.nombreMarca],
            ['Categoria', data.categoria?.nombreCategoria],
            ['Precio', `$${data.precio.toFixed(2)}`],
            ['Estado', data.estadoProducto],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Estado' && v === 'AGOTADO' ? 'text-error' : k === 'Precio' ? 'text-blue' : 'text-primary'}`}>
                {v}
              </span>
            </div>
          ))}
        </Modal>
      );
    }

    return null;
  }

  // 表单弹窗
  function renderFormModal() {
    if (!formModal) return null;
    const { type, data } = formModal;

    if (type === 'add-product') {
      return <AddProductModal onClose={() => setFormModal(null)} onAddBook={onAddBook} onAddPapeleria={onAddPapeleria} books={books} papeleria={papeleria} />;
    }
    if (type === 'edit-book') {
      return (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title="✏️ Editar">
          <ProductForm type="book" initial={data} onSave={d => { onEditBook(data.idProducto ?? data.id, d); setFormModal(null); }} books={books} papeleria={papeleria} />
        </Modal>
      );
    }
    if (type === 'edit-papeleria') {
      return (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title="✏️ Editar">
          <ProductForm type="papeleria" initial={data} onSave={d => { onEditPapeleria(data.idProducto ?? data.id, d); setFormModal(null); }} books={books} papeleria={papeleria} />
        </Modal>
      );
    }
    return null;
  }
}

// 添加产品弹窗
function AddProductModal({ onClose, onAddBook, onAddPapeleria, books, papeleria }) {
  const [subType, setSubType] = useState('book');
  const handleSave = async (data) => {
    if (subType === 'book') {
      await onAddBook(data);
    } else {
      await onAddPapeleria(data);
    }
    onClose();
  };
  return (
    <Modal open width="max-w-lg" onClose={onClose} title="➕ Añadir">
      <div className="flex gap-2 mb-4">
        {[['book', '📚 Libros'], ['stationery', '📎 Papelerias']].map(([v, l]) => (
          <button key={v} onClick={() => setSubType(v)} className={`tab-btn flex-1 ${subType === v ? 'active' : ''}`}>
            {l}
          </button>
        ))}
      </div>
      <ProductForm type={subType} onSave={handleSave} books={books} papeleria={papeleria} />
    </Modal>
  );
}

// 产品表单
function ProductForm({ type, initial, onSave, books = [], papeleria = [] }) {
  const isBook = type === 'book';
  const [form, setForm] = useState(initial || (isBook
    ? { nombreProducto: '', autor: '', ISBN: '', editorial: '', precio: '', idioma: null, genero: null, estadoProducto: 'DISPONIBLE', stock: '', costoReal: '', fechaPublicacion: '', numeroPagina: '', descripcion: ''  }
    : { nombreProducto: '', marca: null, categoria: null, precio: '', estadoProducto: 'DISPONIBLE', stock: '', costoReal: '', descripcion: ''  }
  ));
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const idiomas = books
    .map((b) => b.idioma)
    .filter(Boolean)
    .reduce((acc, curr) => {
      if (!acc.find((i) => i.idIdioma === curr.idIdioma)) acc.push(curr);
      return acc;
    }, []);
  const generos = books
    .map((b) => b.genero)
    .filter(Boolean)
    .reduce((acc, curr) => {
      if (!acc.find((g) => g.idGenero === curr.idGenero)) acc.push(curr);
      return acc;
    }, []);
  const marcas = papeleria
    .map((p) => p.marca)
    .filter(Boolean)
    .reduce((acc, curr) => {
      if (!acc.find((m) => m.idMarca === curr.idMarca)) acc.push(curr);
      return acc;
    }, []);
  const categorias = papeleria
    .map((p) => p.categoria)
    .filter(Boolean)
    .reduce((acc, curr) => {
      if (!acc.find((c) => c.idCategoria === curr.idCategoria)) acc.push(curr);
      return acc;
    }, []);

  const handleSubmit = async () => {

    if (isBook && !form.idioma) {
      alert('Selecciona un idioma para el libro.');
      return;
    }
    if (isBook && !form.genero) {
      alert('Selecciona un genero para el libro.');
      return;
    }
    if (!isBook && !form.marca) {
      alert('Selecciona una marca para papeleria.');
      return;
    }
    if (!isBook && !form.categoria) {
      alert('Selecciona una categoria para papeleria.');
      return;
    }
    await onSave({ 
      ...form, 
      precio: parseFloat(form.precio) || 0,
      costoReal: parseFloat(form.costoReal) || 0,
      stock: parseInt(form.stock) || 0,
      numeroPagina: parseInt(form.numeroPagina) || 0,
    });
  };

  return (
    <div className="space-y-3">
      {isBook ? (
        <>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input value={form.nombreProducto} onChange={e => set('nombreProducto', e.target.value)} className="input-field" />
          </div>
          <div className="form-group">
            <label className="form-label">Autor</label>
            <input value={form.autor} onChange={e => set('autor', e.target.value)} className="input-field" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ISBN</label>
              <input value={form.isbn} onChange={e => set('isbn', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Editorial</label>
              <input value={form.editorial} onChange={e => set('editorial', e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio</label>
              <input type="number" value={form.precio} onChange={e => set('precio', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Idioma</label>
              <select  value={form.idioma?.idIdioma ?? ''}  onChange={e =>  
              {const selected = idiomas.find(x => x.idIdioma === parseInt(e.target.value));
                set('idioma', selected || null);}} className="input-field">
                  <option value="">Selecciona idioma</option>
                {idiomas.map(i => (
                  <option key={i.idIdioma} value={i.idIdioma}>{i.nombreIdioma}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Genero</label>
              <select value={form.genero ?.idGenero?? ''} onChange={e => {
                const selected = generos.find(g => g.idGenero === parseInt(e.target.value));
                set('genero', selected || null);
              }} className="input-field" >
              <option value="">Selecciona genero</option>
              {generos.map(g => (
                <option key={g.idGenero} value={g.idGenero}>{g.nombreGenero}</option>   
              ))}
            </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select value={form.estadoProducto} onChange={e => set('estadoProducto', e.target.value)} className="input-field">
                <option value="DISPONIBLE">Disponible</option>
                <option value="AGOTADO">Agotado</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input 
              type="number" 
              value={form.stock} 
              onChange={e => set('stock', parseInt(e.target.value) || 0)} 
              className="input-field" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Costo Real</label>
            <input 
              type="number" 
              value={form.costoReal} 
              onChange={e => set('costoReal', parseFloat(e.target.value) || 0)} 
              className="input-field" 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha publicación</label>
              <input 
                type="date" 
                value={form.fechaPublicacion} 
                onChange={e => set('fechaPublicacion', e.target.value)} 
                className="input-field" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nº páginas</label>
              <input 
                type="number" 
                value={form.numeroPagina} 
                onChange={e => set('numeroPagina', parseInt(e.target.value) || 0)} 
                className="input-field" 
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea 
              value={form.descripcion} 
              onChange={e => set('descripcion', e.target.value)} 
              className="input-field" 
              rows={3}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input value={form.nombreProducto} onChange={e => set('nombreProducto', e.target.value)} className="input-field" />
          </div>
          <div className="form-group">
            <label className="form-label">Marca</label>
            <select value={form.marca?.idMarca ?? ''} onChange={e => {
              const selected = marcas.find(m => m.idMarca === parseInt(e.target.value));
              set('marca', selected || null);
            }} className="input-field">
              <option value="">Selecciona marca</option>
              {marcas.map(m => (
                <option key={m.idMarca} value={m.idMarca}>{m.nombreMarca}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio</label>
              <input type="number" value={form.precio} onChange={e => set('precio', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select value={form.categoria?.idCategoria ?? ''} onChange={e => {
                const selected = categorias.find(c => c.idCategoria === parseInt(e.target.value));
                set('categoria', selected || null);
              }} className="input-field">
                <option value="">Selecciona categoria</option>
                {categorias.map(c => (
                  <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
              <select value={form.estadoProducto} onChange={e => set('estadoProducto', e.target.value)} className="input-field">
                <option value="DISPONIBLE">Disponible</option>
                <option value="AGOTADO">Agotado</option>
              </select>
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input 
              type="number" 
              value={form.stock} 
              onChange={e => set('stock', parseInt(e.target.value) || 0)} 
              className="input-field" 
            />
          </div>
           <div className="form-group">
            <label className="form-label">Costo Real</label>
            <input 
              type="number" 
              value={form.costoReal} 
              onChange={e => set('costoReal', parseFloat(e.target.value) || 0)} 
              className="input-field" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea 
              value={form.descripcion} 
              onChange={e => set('descripcion', e.target.value)} 
              className="input-field" 
              rows={3}
            />
          </div>
        </>
      )}
      <button type="button" onClick={handleSubmit} className="btn btn-primary w-full mt-2">
        {initial ? 'Guardar' : 'Añadir'}
      </button>
    </div>
  );
}
