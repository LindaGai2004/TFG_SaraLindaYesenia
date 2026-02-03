import { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal_dashboard';

export default function Productos({
  books,
  stationery,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onAddStationery,
  onEditStationery,
  onDeleteStationery,
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

  // 筛选后的数据
  const filteredBooks = useMemo(() => books.filter(b => {
    if (prodSearch && !`${b.nombre} ${b.autor} ${b.isbn} ${b.editorial}`.toLowerCase().includes(prodSearch.toLowerCase())) return false;
    if (prodEstado !== 'Todos' && b.estado !== prodEstado) return false;
    if (bookIdioma !== 'Todos' && b.idioma !== bookIdioma) return false;
    if (bookGenero !== 'Todos' && b.genero !== bookGenero) return false;
    if (bookPrecio === 'Bajo' && b.precio > 15) return false;
    if (bookPrecio === 'Medio' && (b.precio <= 15 || b.precio > 25)) return false;
    if (bookPrecio === 'Alto' && b.precio <= 25) return false;
    return true;
  }), [books, prodSearch, prodEstado, bookIdioma, bookGenero, bookPrecio]);

  const filteredStationery = useMemo(() => stationery.filter(s => {
    if (prodSearch && !`${s.nombreProducto} ${s.marca?.nombreMarca} ${s.categoria?.nombreCategoria}`.toLowerCase().includes(prodSearch.toLowerCase())) return false;
    if (prodEstado !== 'Todos' && s.estado !== prodEstado) return false;
    if (papMarca !== 'Todos' && s.marca?.nombreMarca !== papMarca) return false;
    if (papCategoria !== 'Todos' && s.categoria?.nombreCategoria !== papCategoria) return false;
    if (papPrecio === 'Bajo' && s.precio > 5) return false;
    if (papPrecio === 'Medio' && (s.precio <= 5 || s.precio > 20)) return false;
    if (papPrecio === 'Alto' && s.precio <= 20) return false;
    return true;
  }), [stationery, prodSearch, prodEstado, papMarca, papCategoria, papPrecio]);

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
            {cat === 'Libro' ? '📚 Libros' : cat === 'Papeleria' ? '📎 Pepelerias' : '🗂️ Todos'}
          </button>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="search-wrapper mb-3">
        <Search size={15} className="search-icon" />
        <input
          placeholder="Buscar por nombre..."
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
          <option value="Todos">Estado: Todos</option>
          <option value="DISPONIBLE">Dispobnible</option>
          <option value="Agotado">Agotado</option>
        </select>

        {prodCategory === 'Libro' && <>
          <select value={bookIdioma} onChange={e => setBookIdioma(e.target.value)} className="input-field filter-select">
            <option value="Todos">Lenguaje: Todos</option>
            <option value="Español">Español</option>
            <option value="Inglés">Ingles</option>
          </select>
          <select value={bookGenero} onChange={e => setBookGenero(e.target.value)} className="input-field filter-select">
            <option value="Todos">Genero: TOdos</option>
            {[...new Set(books.map(b => b.genero))].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select value={bookPrecio} onChange={e => setBookPrecio(e.target.value)} className="input-field filter-select">
            <option value="Todos">Precios: todos</option>
            <option value="Bajo">低 (&lt;$15)</option>
            <option value="Medio">中 ($15-25)</option>
            <option value="Alto">高 (&gt;$25)</option>
          </select>
        </>}

        {prodCategory === 'Papeleria' && <>
          <select value={papMarca} onChange={e => setPapMarca(e.target.value)} className="input-field filter-select">
            <option value="Todos">Marcas: Todos</option>
            {[...new Set(stationery.map(s => s.marca?.nombreMarca))].map(m => (
              <option key={m + index} value={m}>{m}</option>
            ))}
          </select>
          <select value={papCategoria} onChange={e => setPapCategoria(e.target.value)} className="input-field filter-select">
            <option value="Todos">Categorias: todos</option>
            {[...new Set(stationery.map(s => s.categoria?.nombreCategoria))].map(c => (
              <option key={c + index} value={c}>{c}</option>
            ))}
          </select>
          <select value={papPrecio} onChange={e => setPapPrecio(e.target.value)} className="input-field filter-select">
            <option value="Todos">Precios: Todos</option>
            <option value="Bajo">低 (&lt;$5)</option>
            <option value="Medio">中 ($5-20)</option>
            <option value="Alto">高 (&gt;$20)</option>
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
                      <span className={`badge ${b.estadoProducto === 'Disponible' ? 'badge-success' : 'badge-error'}`}>
                        {b.estadoProducto}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{b.stock}</td>
                    <td>
                      <div className="table-actions">
                        <button onClick={e => { e.stopPropagation(); setFormModal({ type: 'edit-book', data: b }); }} className="btn-icon edit">
                          <Edit size={13} color="#2d6a4f" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); onDeleteBook(b.id); }} className="btn-icon delete">
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
                  <tr key={s.id} onClick={() => setPopup({ type: 'stationery', data: s })} className="cursor-pointer">
                    <td className="text-xs font-semibold text-primary">{s.nombreProducto}</td>
                    <td className="text-xs text-secondary">{s.marca?.nombreMarca}</td>
                    <td className="text-xs text-secondary">{s.categoria?.nombreCategoria}</td>
                    <td className="text-xs font-bold text-blue">${s.precio.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${s.estadoProducto === 'Disponible' ? 'badge-success' : 'badge-error'}`}>
                        {s.estadoProducto}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{s.stock}</td>
                    <td>
                      <div className="table-actions">
                        <button onClick={e => { e.stopPropagation(); setFormModal({ type: 'edit-stationery', data: s }); }} className="btn-icon edit">
                          <Edit size={13} color="#3b82f6" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); onDeleteStationery(s.id); }} className="btn-icon delete">
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
            ['Lenguaje', data.nombreIdioma],
            ['Genero', data.genero],
            ['Precio', `$${data.precio.toFixed(2)}`],
            ['Estado', data.estadoProducto],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-secondary">{k}</span>
              <span className={`font-semibold ${k === 'Estado' && v === 'Agotado' ? 'text-error' : k === 'Precio' ? 'text-green' : 'text-primary'}`}>
                {v}
              </span>
            </div>
          ))}
        </Modal>
      );
    }

    if (type === 'stationery') {
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
              <span className={`font-semibold ${k === 'Estado' && v === 'Agotado' ? 'text-error' : k === 'Precio' ? 'text-blue' : 'text-primary'}`}>
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
      return <AddProductModal onClose={() => setFormModal(null)} onAddBook={onAddBook} onAddStationery={onAddStationery} />;
    }
    if (type === 'edit-book') {
      return (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title="✏️ Editar">
          <ProductForm type="book" initial={data} onSave={d => { onEditBook(data.id, d); setFormModal(null); }} />
        </Modal>
      );
    }
    if (type === 'edit-stationery') {
      return (
        <Modal open width="max-w-lg" onClose={() => setFormModal(null)} title="✏️ Editar">
          <ProductForm type="stationery" initial={data} onSave={d => { onEditStationery(data.id, d); setFormModal(null); }} />
        </Modal>
      );
    }
    return null;
  }
}

// 添加产品弹窗
function AddProductModal({ onClose, onAddBook, onAddStationery }) {
  const [subType, setSubType] = useState('book');
  return (
    <Modal open width="max-w-lg" onClose={onClose} title="➕ Añadir">
      <div className="flex gap-2 mb-4">
        {[['book', '📚 Libros'], ['stationery', '📎 Papelerias']].map(([v, l]) => (
          <button key={v} onClick={() => setSubType(v)} className={`tab-btn flex-1 ${subType === v ? 'active' : ''}`}>
            {l}
          </button>
        ))}
      </div>
      <ProductForm type={subType} onSave={d => { subType === 'book' ? onAddBook(d) : onAddStationery(d); onClose(); }} />
    </Modal>
  );
}

// 产品表单
function ProductForm({ type, initial, onSave }) {
  const isBook = type === 'book';
  const [form, setForm] = useState(initial || (isBook
    ? { nombreProducto: '', autor: '', isbn: '', editorial: '', precio: '', idioma: '', genero: '', estadoProducto: '' }
    : { nombreProducto: '', nombreMarca: '', categoria: '', precio: '', estadoProducto: '' }
  ));
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      {isBook ? (
        <>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input value={form.nombreProducto} onChange={e => set('nombre', e.target.value)} className="input-field" />
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
              <select value={form.idioma?.nombreIdioma} onChange={e => set('idioma', e.target.value)} className="input-field">
                <option value="Español">Español</option>
                <option value="Inglés">Ingles</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Genero</label>
              <select value={form.genero?.nombreGenro} onChange={e => set('genero', e.target.value)} className="input-field">
                {['Ficción', 'Distopía', 'Histórica', 'Fantasía', 'Sci-Fi'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select value={form.estadoProducto} onChange={e => set('estado', e.target.value)} className="input-field">
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input value={form.nombreProducto} onChange={e => set('nombre', e.target.value)} className="input-field" />
          </div>
          <div className="form-group">
            <label className="form-label">Marca</label>
            <input value={form.marca?.nombreMarca} onChange={e => set('marca', e.target.value)} className="input-field" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio</label>
              <input type="number" value={form.precio} onChange={e => set('precio', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select value={form.categoria?.nombreCategoria} onChange={e => set('categoria', e.target.value)} className="input-field">
                {['Cuadernos', 'Coloreados', 'Accesorios', 'Bolígrafos', 'Carpetas', 'Herramientas'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select value={form.estadoProducto} onChange={e => set('estado', e.target.value)} className="input-field">
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
        </>
      )}
      <button onClick={() => onSave({ ...form, precio: parseFloat(form.precio) || 0 })} className="btn btn-primary w-full mt-2">
        {initial ? 'Guardar' : 'Añadir'}
      </button>
    </div>
  );
}
