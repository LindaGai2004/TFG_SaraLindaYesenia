import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPut, apiPost, getApiUrl, getUploadUrl } from '../api/api';
import Favoritos from './Favoritos';
import SeguimientoCliente from './SeguimientoCliente';
import { crearItemHistorial, getHistorial, getProductoImagen } from '../utils/historialProductos';
import './Cliente.css';

const MINI_BOOK_COLORS = [
  'linear-gradient(135deg,#4a7c45,#7ec47a)',
  'linear-gradient(135deg,#8b2020,#d94f4f)',
  'linear-gradient(135deg,#2d3a6e,#7c8dcf)',
];

const GENERO_PORTADAS_PREFERIDAS = {
  'Histórico': 'Guerra y paz',
  'Infantil': 'Anna Karénina',
  'Juvenil': 'Madame Bovary',
  'Misterio': 'El retrato de Dorian Gray',
  'Novela': '1984',
  'Poesía': 'Juego de tronos',
  'Romance': 'Cien años de soledad',
  'Teatro': 'La rueda del tiempo',
  'Terror': 'Pedro Páramo',
  'Viajes': 'Ficciones',
};

const Icon = ({ d, size = 22, sw = 1.8, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56l1.65-8.44H6" /></>,
  chevR: <polyline points="9 18 15 12 9 6" />,
  chevL: <polyline points="15 18 9 12 15 6" />,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></>,
};

export default function Portfolio() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const historialRef = useRef(null);
  const searchBlurTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [page, setPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [historial, setHistorial] = useState(() => getHistorial());
  const [generos, setGeneros] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    direccion: '',
    fechaNacimiento: '',
    password: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');

  const statusStyle = {
    CARRITO: { bg: '#dbeafe', color: '#1d4ed8', label: 'Añadido' },
    REALIZADO: { bg: '#dce8ed', color: '#3f6b7c', label: 'Realizado' },
    DEVUELTO: { bg: '#fee2e2', color: '#991b1b', label: 'Devuelto' },
    CANCELADO: { bg: '#fef3c7', color: '#92400e', label: 'Cancelado' },
  };

  const formatOrderDate = (value) => {
    if (!value) return 'Sin fecha';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sin fecha';

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserId = () =>
    user?.idUsuario ??
    user?.id ??
    user?.usuario?.idUsuario ??
    user?.usuario?.id ??
    null;

  const getUserIdentifiers = () => {
    const ids = [
      user?.idUsuario,
      user?.id,
      user?.usuario?.idUsuario,
      user?.usuario?.id,
    ]
      .filter((value) => value !== undefined && value !== null)
      .map((value) => String(value));

    const emails = [
      user?.email,
      user?.usuario?.email,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());

    const usernames = [
      user?.username,
      user?.usuario?.username,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());

    return { ids, emails, usernames };
  };

  const getPedidoStatus = (estadoPedido) =>
    statusStyle[estadoPedido] ?? { bg: '#ede8f5', color: '#6d5e9e', label: estadoPedido ?? 'Sin estado' };

  const isCartPedido = (pedido) => pedido?.estadoPedido === 'CARRITO';
  const profileImageFromBackend = getApiUrl(
    user?.fotoPerfil ??
    user?.imagenPerfil ??
    user?.avatar ??
    profileData?.fotoPerfil ??
    profileData?.imagenPerfil ??
    profileData?.avatar ??
    ''
  );

  const profileImageSrc = profileImagePreview || profileImageFromBackend || '/68e45e7a40b25293eb1f3a85d9368ae0.png';

  useEffect(() => {
    const sincronizarHistorial = async () => {
      try {
        const historialGuardado = getHistorial();

        if (historialGuardado.length === 0) {
          setHistorial([]);
          return;
        }

        const productos = await apiGet('/productos/todos');
        const productosMap = Object.fromEntries(
          (productos ?? []).map((producto, index) => [
            String(producto.idProducto ?? producto.id),
            crearItemHistorial(producto, index),
          ])
        );

        const historialActualizado = historialGuardado
          .map((item, index) => (
            productosMap[String(item.id)] ?? {
              ...item,
              color: item.color ?? MINI_BOOK_COLORS[index % MINI_BOOK_COLORS.length],
            }
          ))
          .filter(item => item?.id != null);

        setHistorial(historialActualizado);
      } catch (error) {
        console.error('Error cargando historial del cliente:', error);
        setHistorial(getHistorial());
      }
    };

    sincronizarHistorial();

    const onFocus = () => sincronizarHistorial();
    window.addEventListener('focus', onFocus);

    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    const cargarResumenCliente = async () => {
      try {
        const carrito = await apiGet('/carrito');
        setCartCount(carrito?.items?.length ?? 0);
      } catch (error) {
        console.error('Error cargando carrito del cliente:', error);
        setCartCount(0);
      }
    };

    cargarResumenCliente();
  }, []);

  useEffect(() => {
    const cargarPerfilCliente = async () => {
      if (!user) return;

      setProfileLoading(true);

      try {
        const clientes = await apiGet('/rol/2');
        const cliente = (clientes ?? []).find((item) => {
          const ids = [item?.id, item?.idUsuario]
            .filter((value) => value !== undefined && value !== null)
            .map((value) => String(value));

          const currentIds = [
            user?.id,
            user?.idUsuario,
            user?.usuario?.id,
            user?.usuario?.idUsuario,
          ]
            .filter((value) => value !== undefined && value !== null)
            .map((value) => String(value));

          const sameId = ids.some((value) => currentIds.includes(value));
          const sameEmail =
            item?.email &&
            user?.email &&
            String(item.email).trim().toLowerCase() === String(user.email).trim().toLowerCase();

          return sameId || sameEmail;
        }) ?? user;

        setProfileData(cliente);
        setProfileForm({
          nombre: cliente?.nombre ?? '',
          apellidos: cliente?.apellidos ?? '',
          email: cliente?.email ?? user?.email ?? '',
          username: cliente?.username ?? user?.username ?? '',
          direccion: cliente?.direccion ?? '',
          fechaNacimiento: cliente?.fechaNacimiento ?? '',
          password: '',
        });
      } catch (error) {
        console.error('Error cargando perfil del cliente:', error);
        setProfileData(user);
        setProfileForm({
          nombre: user?.nombre ?? '',
          apellidos: user?.apellidos ?? '',
          email: user?.email ?? '',
          username: user?.username ?? '',
          direccion: user?.direccion ?? '',
          fechaNacimiento: user?.fechaNacimiento ?? '',
          password: '',
        });
      } finally {
        setProfileLoading(false);
      }
    };

    cargarPerfilCliente();
  }, [user]);

  useEffect(() => {
    const texto = searchQuery.trim();

    if (texto.length < 1) {
      setSearchSuggestions([]);
      setSearchLoading(false);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const data = await apiGet(`/productos/buscar/todos?texto=${encodeURIComponent(texto)}`);
        const productos = Array.isArray(data) ? data.slice(0, 8) : [];
        setSearchSuggestions(productos);
        setSearchOpen(true);
      } catch (error) {
        console.error('Error cargando sugerencias:', error);
        setSearchSuggestions([]);
        setSearchOpen(false);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const cargarGeneros = async () => {
      try {
        const [generosData, productosData] = await Promise.all([
          apiGet('/generos/todos'),
          apiGet('/productos/todos'),
        ]);

        const libros = productosData ?? [];

        const buscarLibroPreferido = (nombreGenero) => {
          const tituloPreferido = GENERO_PORTADAS_PREFERIDAS[nombreGenero];

          if (!tituloPreferido) {
            return null;
          }

          return libros.find((libro) => {
            const coincideGenero = libro.genero?.nombreGenero === nombreGenero;
            const nombreLibro = String(libro.nombreProducto ?? '').trim().toLowerCase();
            return coincideGenero && nombreLibro === tituloPreferido.trim().toLowerCase();
          });
        };

        const generosConLibro = (generosData ?? []).map((genero, index) => {
          const libroPreferido = buscarLibroPreferido(genero.nombreGenero);
          const primerLibro = libroPreferido ?? libros.find(
            (libro) => libro.genero?.nombreGenero === genero.nombreGenero
          );
          console.log(genero.nombreGenero, primerLibro, getProductoImagen(primerLibro));
          return {
            ...genero,
            libroPortada: primerLibro ? getProductoImagen(primerLibro) : null,
            color: MINI_BOOK_COLORS[index % MINI_BOOK_COLORS.length],
          };
        });

        setGeneros(generosConLibro);
      } catch (error) {
        console.error('Error cargando generos:', error);
        setGeneros([]);
      }
    };

    cargarGeneros();
  }, []);

  useEffect(() => {
    const cargarPedidos = async () => {
      setPedidosLoading(true);
      try {
        const data = await apiGet('/pedidos/usuario/');
        const ordenados = [...(data ?? [])]
            .filter(pedido => {
                // 如果是购物车状态，只有里面有商品才显示
                if (pedido.estadoPedido === 'CARRITO') {
                    const totalItems = (pedido.items ?? []).reduce(
                        (acc, item) => acc + (item.cantidad ?? 0), 0
                    );
                    return totalItems > 0;
                }
                // 其他状态（REALIZADO, CANCELADO, DEVUELTO）正常显示
                return true;
            })
            .sort((a, b) => {
                const dateA = new Date(b.fechaVenta ?? b.fechaActualizacion ?? 0).getTime();
                const dateB = new Date(a.fechaVenta ?? a.fechaActualizacion ?? 0).getTime();
                return dateA - dateB;
            });
        setPedidos(ordenados);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        setPedidos([]);
      } finally {
        setPedidosLoading(false);
      }
    };

    cargarPedidos();
  }, [user]);


  const handleSearch = () => {
    const texto = searchQuery.trim();
    if (!texto) return;

    setSearchOpen(false);
    navigate(`/productos?search=${encodeURIComponent(texto)}`);
  };

  const handleBookClick = (libro) => {
    navigate(`/producto/${libro.id}`);
  };

  const handleSuggestionClick = (producto) => {
    setSearchQuery(producto.nombreProducto ?? '');
    setSearchOpen(false);
    navigate(`/producto/${producto.idProducto ?? producto.id}`);
  };

  const handleGeneroClick = (genero) => {
    navigate(`/productos?tipo=libro&genero=${encodeURIComponent(genero.nombreGenero)}`);
  };

  const handleCartClick = () => {
    navigate('/carrito');
  };

  const handleProfileInputChange = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

 const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 本地预览（立即显示）
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(String(reader.result ?? ''));
    reader.readAsDataURL(file);

    // 上传到后端
    try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await apiPost(
            `/usuario/${profileData?.email ?? profileForm.email}/avatar`,
            formData,
            true // isFormData = true
        );
        // 更新全局用户状态
        if (result?.avatar) {
            updateUser({ ...user, avatar: result.avatar });
            // 删除 localStorage 里的旧预览
            localStorage.removeItem('client_profile_image');
        }
    } catch (e) {
        console.error("Error al subir avatar", e);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.email) return;

    setProfileSaving(true);
    setProfileMessage('');

    try {
      // 只发必要字段，不带多余的Spring Security字段
      const payload = {
        nombre: profileForm.nombre,
        apellidos: profileForm.apellidos,
        email: profileForm.email,
        username: profileForm.username,
        direccion: profileForm.direccion,
        fechaNacimiento: profileForm.fechaNacimiento || null,
        perfil: profileData?.perfil ?? { idPerfil: 2 },
      };

      if (profileForm.password) {
        payload.password = profileForm.password;
      }

      await apiPut(`/usuario/${profileData?.email ?? profileForm.email}`, payload);

      updateUser({ ...user, ...payload });
      setProfileData(prev => ({ ...prev, ...payload }));
      setProfileForm(prev => ({ ...prev, password: '' }));
      setProfileMessage('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setProfileMessage('No se pudo actualizar el perfil.');
    } finally {
      setProfileSaving(false);
    }
  };
  /* const handleSaveProfile = async () => {
     if (!profileForm.email) return;
 
     setProfileSaving(true);
     setProfileMessage('');
 
     try {
       const payload = {
         ...profileData,
         ...profileForm,
       };
 
       if (!payload.password) {
         delete payload.password;
       }
 
       await apiPut(`/usuario/${profileData?.email ?? profileForm.email}`, payload);
 
       const updatedLocalUser = {
         ...user,
         ...payload,
       };
 
       updateUser(updatedLocalUser);
       setProfileData((prev) => ({ ...prev, ...payload }));
       setProfileForm((prev) => ({ ...prev, password: '' }));
       setProfileMessage('Perfil actualizado correctamente.');
     } catch (error) {
       console.error('Error actualizando perfil:', error);
       setProfileMessage('No se pudo actualizar el perfil.');
     } finally {
       setProfileSaving(false);
     }
   };*/

  const scrollHistorial = (direction) => {
    const container = historialRef.current;

    if (!container) return;

    const amount = 320;
    container.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="app-container">
      <div className="app-sidebar">
        <div
          className="sidebar-avatar"
          onClick={() => setPage('perfil')}
        >
          <img
            src={profileImageSrc}
            alt="Profile"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        <a className={`app-sidebar-link ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="nav-label">Inicio</span>
        </a>

        <a className={`app-sidebar-link ${page === 'favoritos' ? 'active' : ''}`} onClick={() => setPage('favoritos')}>
          <Heart size={22} className="sidebar-heart-icon" />
          <span className="nav-label">Favoritos</span>
        </a>

        <a
          className={`app-sidebar-link ${page === 'pedidos' ? 'active' : ''}`}
          onClick={() => setPage('pedidos')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="nav-label">Pedidos</span>
        </a>

        <a
          className={`app-sidebar-link ${page === 'seguimiento' ? 'active' : ''}`}
          onClick={() => setPage('seguimiento')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="nav-label">Comunidad</span>
        </a>

        <div style={{ flex: 1 }} />
        <div className="sidebar-divider" />

        <a className={`app-sidebar-link ${page === 'perfil' ? 'active' : ''}`} onClick={() => setPage('perfil')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="nav-label">Perfil</span>
        </a>

        <a className="app-sidebar-link logout-link" onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="nav-label">Salir</span>
        </a>
      </div>

      <div className="app-main-wrapper">
        <div className="app-main">
          <div className="app-header">
              <div
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}
              >
                <span style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 600, 
                  letterSpacing: '-0.5px', 
                  color: 'black',
                  fontFamily: '"Ablafit", sans-serif'
                }}>
                  Archives
                </span>
                <img src="/libro.png" alt="Logo" style={{ width: 40, height: 'auto' }} />
              </div>

            <div className="search-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Find the book you like..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchSuggestions.length > 0 || searchQuery.trim()) {
                    setSearchOpen(true);
                  }
                }}
                onBlur={() => {
                  searchBlurTimeoutRef.current = setTimeout(() => {
                    setSearchOpen(false);
                  }, 150);
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              {searchOpen && (
                <div className="search-suggestions">
                  {searchLoading ? (
                    <div className="search-suggestion-empty">Buscando productos...</div>
                  ) : searchSuggestions.length === 0 ? (
                    <div className="search-suggestion-empty">No se encontraron productos.</div>
                  ) : (
                    searchSuggestions.map((producto) => {
                      const imagen = getProductoImagen(producto);
                      return (
                        <button
                          key={producto.idProducto ?? producto.id}
                          type="button"
                          className="search-suggestion-item"
                          onMouseDown={() => {
                            if (searchBlurTimeoutRef.current) {
                              clearTimeout(searchBlurTimeoutRef.current);
                            }
                          }}
                          onClick={() => handleSuggestionClick(producto)}
                        >
                          <div className="search-suggestion-thumb">
                            {imagen ? (
                              <img src={imagen} alt={producto.nombreProducto} />
                            ) : (
                              <div className="search-suggestion-thumb-fallback">
                                {(producto.nombreProducto ?? '?').slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="search-suggestion-info">
                            <span className="search-suggestion-title">{producto.nombreProducto}</span>
                            <span className="search-suggestion-subtitle">
                              {producto.autor ?? producto.genero?.nombreGenero ?? producto.categoria?.nombreCategoria ?? producto.tipo_producto ?? 'Producto'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <button className="search-btn" onClick={handleSearch}>search</button>

            <button className="cart-btn" onClick={handleCartClick}>
              <Icon d={Icons.cart} size={21} color="var(--accent)" sw={1.7} />
              {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
            </button>
          </div>

          <div className="app-scroll">
            {page === 'home' && (
              <>
                <div>
                  <div className="section-header">
                    <span className="section-title">Historial</span>
                    <div className="nav-arrows">
                      <button className="nav-arrow" onClick={() => scrollHistorial(-1)} type="button">
                        <Icon d={Icons.chevL} size={14} sw={2.2} />
                      </button>
                      <button className="nav-arrow" onClick={() => scrollHistorial(1)} type="button">
                        <Icon d={Icons.chevR} size={14} sw={2.2} />
                      </button>
                    </div>
                  </div>

                  {historial.length === 0 ? (
                    <p className="historial-empty">
                      Aún no has visto ningún producto. Empieza a explorar.
                    </p>
                  ) : (
                    <div className="books-row" ref={historialRef}>
                      {historial.map(libro => (
                        <div
                          key={libro.id}
                          className="book-card"
                          onClick={() => handleBookClick(libro)}
                        >
                          <div
                            className="book-cover"
                            style={!libro.imagen ? { background: libro.color || 'linear-gradient(145deg,#1a1a2e,#4a3060)' } : {}}
                          >
                            {libro.imagen && <img src={libro.imagen} alt={libro.titulo} />}
                            <div className="book-spine" />
                            <div className="book-title-overlay">{libro.titulo}</div>
                          </div>
                          <div className="book-name">{libro.titulo}</div>
                          <div className="book-author">{libro.autor}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bottom-grid">
                  <div className="cat-panel cat-panel-full">
                    <div className="section-header" style={{ marginBottom: 0 }}>
                      <span className="section-title">Géneros</span>
                    </div>

                    <div className="cat-grid cat-grid-genres">
                      {generos.slice(0, 10).map((genero, index) => (
                        <button
                          key={genero.idGenero}
                          type="button"
                          className="cat-card genre-card"
                          onClick={() => handleGeneroClick(genero)}
                        >
                          <div
                            className="genre-cover"
                            style={
                              genero.libroPortada
                                ? {
                                  backgroundImage: `linear-gradient(to top, rgba(28, 25, 32, 0.62), rgba(28, 25, 32, 0.12)), url(${genero.libroPortada})`,
                                }
                                : {
                                  backgroundImage: `linear-gradient(to top, rgba(28, 25, 32, 0.58), rgba(28, 25, 32, 0.1)), ${genero.color ?? MINI_BOOK_COLORS[index % MINI_BOOK_COLORS.length]}`,
                                }
                            }
                          >
                            <span className="genre-cover-title">{genero.nombreGenero}</span>
                          </div>
                          <p className="cat-name">{genero.nombreGenero}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {page === 'favoritos' && <Favoritos />}

            {page === 'seguimiento' && <SeguimientoCliente user={user} />}

            {page === 'pedidos' && (
              <div className="orders-section">
                <div className="orders-header">
                  <div>
                    <span className="section-title">Mis Pedidos</span>
                    <p className="orders-subtitle">
                      {pedidos.length === 0
                        ? 'Todavía no tienes pedidos registrados.'
                        : `Tienes ${pedidos.length} pedido${pedidos.length > 1 ? 's' : ''} en tu historial.`}
                    </p>
                  </div>
                </div>

                {pedidosLoading ? (
                  <p className="orders-empty">Cargando pedidos...</p>
                ) : pedidos.length === 0 ? (
                  <div className="orders-empty-card">
                    <h3 className="orders-empty-title">Aún no has hecho pedidos</h3>
                    <p className="orders-empty">Cuando completes una compra, tus pedidos aparecerán aquí.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {pedidos.map((pedido, index) => {
                      const status = getPedidoStatus(pedido.estadoPedido);
                      const items = pedido.items ?? [];
                      const totalItems = items.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
                      const portada = items[0]?.imagenes?.find((img) => img.tipo === 'PRINCIPAL')?.ruta;
                      const lastUpdate = pedido.fechaActualizacion ?? pedido.fechaVenta;
                      const isCart = isCartPedido(pedido);
                      const summaryText = isCart
                        ? `${totalItems || items.length} producto${(totalItems || items.length) !== 1 ? 's' : ''} añadido${(totalItems || items.length) !== 1 ? 's' : ''} al carrito`
                        : `${totalItems || items.length} producto${(totalItems || items.length) !== 1 ? 's' : ''} totalizando €${(pedido.total ?? 0).toFixed(2)}`;

                      return (
                        <article key={pedido.idPedido ?? pedido.id ?? index} className="order-card">
                          <div className="order-card-media">
                            {portada ? (
                              <img
                                src={getUploadUrl(portada)}
                                alt={items[0]?.nombreProducto ?? `Pedido ${pedido.idPedido}`}
                                className="order-card-image"
                              />
                            ) : (
                              <div className="order-card-placeholder">📦</div>
                            )}
                          </div>

                          <div className="order-card-body">
                            <div className="order-card-top">
                              <div>
                                <h3 className="order-card-title">Pedido #{index + 1}</h3>
                                <p className="order-card-summary">{summaryText}</p>
                              </div>
                              <span
                                className="order-status-badge"
                                style={{ background: status.bg, color: status.color }}
                              >
                                {status.label}
                              </span>
                            </div>

                            <div className="order-card-meta">
                              <div className="order-card-meta-item">
                                <span className="order-card-meta-label">
                                  {isCart ? 'Estado de compra' : 'Fecha del pedido'}
                                </span>
                                <span className="order-card-meta-value">
                                  {isCart ? 'Pendiente de pago' : formatOrderDate(pedido.fechaVenta)}
                                </span>
                              </div>
                              <div className="order-card-meta-item">
                                <span className="order-card-meta-label">
                                  {isCart ? 'Último cambio' : 'Última actualización'}
                                </span>
                                <span className="order-card-meta-value">
                                  {isCart ? (lastUpdate ? formatOrderDate(lastUpdate) : 'Reciente') : formatOrderDate(lastUpdate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {page === 'perfil' && (
              <div className="profile-section">
                <div className="profile-card">
                  <div className="profile-card-head">
                    <div>
                      <span className="section-title">Mi Perfil</span>
                      <p className="profile-subtitle">Consulta y modifica tus datos personales.</p>
                    </div>
                  </div>

                  {profileLoading ? (
                    <p className="profile-message">Cargando perfil...</p>
                  ) : (
                    <>
                      <div className="profile-layout">
                        <div className="profile-photo-panel">
                          <div className="profile-photo-frame">
                            <img
                              src={profileImageSrc}
                              alt="Perfil del cliente"
                              className="profile-photo"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="profile-file-input"
                            onChange={handleProfileImageChange}
                          />
                          <button
                            type="button"
                            className="profile-photo-btn"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Subir foto
                          </button>
                      
                        </div>

                        <div className="profile-form-grid">
                          <label className="profile-field">
                            <span>Nombre</span>
                            <input
                              className="input-field"
                              value={profileForm.nombre}
                              onChange={(e) => handleProfileInputChange('nombre', e.target.value)}
                            />
                          </label>
                          <label className="profile-field">
                            <span>Apellidos</span>
                            <input
                              className="input-field"
                              value={profileForm.apellidos}
                              onChange={(e) => handleProfileInputChange('apellidos', e.target.value)}
                            />
                          </label>
                          <label className="profile-field">
                            <span>Email</span>
                            <input
                              className="input-field"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => handleProfileInputChange('email', e.target.value)}
                            />
                          </label>
                          <label className="profile-field">
                            <span>Username</span>
                            <input
                              className="input-field"
                              value={profileForm.username}
                              onChange={(e) => handleProfileInputChange('username', e.target.value)}
                            />
                          </label>
                          <label className="profile-field profile-field-full">
                            <span>Dirección</span>
                            <input
                              className="input-field"
                              value={profileForm.direccion}
                              onChange={(e) => handleProfileInputChange('direccion', e.target.value)}
                            />
                          </label>
                          <label className="profile-field">
                            <span>Fecha de nacimiento</span>
                            <input
                              className="input-field"
                              type="date"
                              value={profileForm.fechaNacimiento}
                              onChange={(e) => handleProfileInputChange('fechaNacimiento', e.target.value)}
                            />
                          </label>
                          <label className="profile-field">
                            <span>Nueva contraseña</span>
                            <input
                              className="input-field"
                              type="password"
                              value={profileForm.password}
                              onChange={(e) => handleProfileInputChange('password', e.target.value)}
                              placeholder="Solo si quieres cambiarla"
                            />
                          </label>
                        </div>
                      </div>

                      {profileMessage && (
                        <p className="profile-message">{profileMessage}</p>
                      )}

                      <div className="profile-actions">
                        <button
                          type="button"
                          className="search-btn profile-save-btn"
                          onClick={handleSaveProfile}
                          disabled={profileSaving}
                        >
                          {profileSaving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
