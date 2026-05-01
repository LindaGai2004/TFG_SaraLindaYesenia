import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, getApiUrl } from '../api/api';

const DEFAULT_AVATAR = '/68e45e7a40b25293eb1f3a85d9368ae0.png';

function getUserId(user) {
  return user?.idUsuario ?? user?.id ?? user?.usuario?.idUsuario ?? user?.usuario?.id ?? null;
}

function getAvatar(usuario) {
  const avatar = usuario?.avatar ?? usuario?.fotoPerfil ?? usuario?.imagenPerfil ?? '';
  return avatar ? getApiUrl(avatar) : DEFAULT_AVATAR;
}

async function tryGetFirst(paths) {
  for (const path of paths) {
    try {
      const data = await apiGet(path);
      if (Array.isArray(data)) {
        return { data, connected: true };
      }
    } catch (error) {
      continue;
    }
  }

  return { data: [], connected: false };
}

async function toggleFollowRequest(targetId, myId) {
  return apiPost(`/usuarios/${targetId}/seguir?idUsuarioActual=${myId}`, {});
}

export default function SeguimientoCliente({ user }) {
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [seguidoresConnected, setSeguidoresConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const myId = getUserId(user);

  useEffect(() => {
    const cargarSeguimiento = async () => {
      if (!myId) {
        setLoading(false);
        setMessage('No se pudo identificar tu cuenta.');
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const [seguidoresResult, seguidosResult, recomendadosData] = await Promise.all([
          tryGetFirst([
            `/usuarios/${myId}/seguidores`,
            `/usuario/${myId}/seguidores`,
            `/seguidores/${myId}`,
          ]),
          tryGetFirst([
            `/usuarios/${myId}/seguidos`,
            `/usuarios/${myId}/siguiendo`,
            `/usuario/${myId}/seguidos`,
            `/seguidos/${myId}`,
          ]),
          apiGet('/recomendados').catch(() => []),
        ]);

        const recomendadosNormalizados = Array.isArray(recomendadosData) ? recomendadosData : [];
        const seguidosFallback = recomendadosNormalizados.filter((item) => item?.siguiendo);
        const seguidosFinal = seguidosResult.data.length > 0 ? seguidosResult.data : seguidosFallback;

        setSeguidores(seguidoresResult.data);
        setSeguidos(seguidosFinal);
        setRecomendados(recomendadosNormalizados);
        setSeguidoresConnected(seguidoresResult.connected);

        if (!seguidoresResult.data.length && !seguidosFinal.length) {
          setMessage('Aun no hay datos de seguimiento para mostrar.');
        }
      } catch (error) {
        console.error('Error cargando seguimiento:', error);
        setMessage('No se pudo cargar tu seguimiento de comunidad.');
      } finally {
        setLoading(false);
      }
    };

    cargarSeguimiento();

    const onFollowChanged = () => {
      cargarSeguimiento();
    };

    window.addEventListener('community-follow-changed', onFollowChanged);
    return () => window.removeEventListener('community-follow-changed', onFollowChanged);
  }, [myId]);

  const usuariosComunidad = useMemo(
    () => recomendados.filter((item) => Number(item?.idUsuario ?? item?.id) !== Number(myId)),
    [recomendados, myId]
  );

  const handleToggleSeguir = async (usuario) => {
    if (!myId || !usuario) return;

    const targetId = usuario.idUsuario ?? usuario.id;
    if (!targetId || Number(targetId) === Number(myId)) return;

    try {
      const res = await toggleFollowRequest(targetId, myId);
      const siguiendo = Boolean(res?.siguiendo);

      setSeguidos((prev) => {
        const exists = prev.some((item) => Number(item?.idUsuario ?? item?.id) === Number(targetId));
        if (siguiendo && !exists) {
          return [...prev, { ...usuario, siguiendo: true }];
        }
        if (!siguiendo && exists) {
          return prev.filter((item) => Number(item?.idUsuario ?? item?.id) !== Number(targetId));
        }
        return prev.map((item) =>
          Number(item?.idUsuario ?? item?.id) === Number(targetId)
            ? { ...item, siguiendo }
            : item
        );
      });

      setRecomendados((prev) =>
        prev.map((item) =>
          Number(item?.idUsuario ?? item?.id) === Number(targetId)
            ? { ...item, siguiendo }
            : item
        )
      );

      window.dispatchEvent(new CustomEvent('community-follow-changed'));
    } catch (error) {
      console.error('Error actualizando seguimiento:', error);
    }
  };

  const renderUsuario = (usuario) => {
    const targetId = usuario?.idUsuario ?? usuario?.id;
    const following = seguidos.some((item) => Number(item?.idUsuario ?? item?.id) === Number(targetId));

    return (
      <article key={`${targetId}-${usuario?.email ?? usuario?.username ?? ''}`} className="follow-user-card">
        <img
          src={getAvatar(usuario)}
          alt={usuario?.nombre ?? 'Usuario'}
          className="follow-user-avatar"
        />
        <div className="follow-user-info">
          <strong>{usuario?.nombre} {usuario?.apellidos}</strong>
          <span>@{usuario?.username || 'lector'}</span>
          {usuario?.email && <span>{usuario.email}</span>}
        </div>
        <button
          type="button"
          className={`follow-action-btn ${following ? 'following' : ''}`}
          onClick={() => handleToggleSeguir(usuario)}
        >
          {following ? 'Siguiendo' : 'Seguir'}
        </button>
      </article>
    );
  };

  const modalTitle = activeModal === 'seguidores' ? 'Todos tus seguidores' : 'Todas las personas que sigues';
  const modalItems = activeModal === 'seguidores' ? seguidores : seguidos;

  return (
    <div className="follow-section">
      <div className="follow-card">
        <div className="follow-head">
          <div>
            <span className="section-title">Mi comunidad</span>
            <p className="follow-subtitle">Consulta tu red de seguimiento conectada con backend y base de datos.</p>
          </div>
          <a href="/comunidad" className="follow-community-link">Ir a comunidad</a>
        </div>

        {loading ? (
          <p className="follow-message">Cargando seguimiento...</p>
        ) : (
          <>
            {message && <p className="follow-message">{message}</p>}

            <div className="follow-stats-grid follow-stats-grid-simple">
              <button
                type="button"
                className="follow-stat-box follow-stat-btn"
                onClick={() => seguidoresConnected && setActiveModal('seguidores')}
              >
                <span className="follow-stat-number">{seguidores.length}</span>
                <span className="follow-stat-label">{seguidoresConnected ? 'Seguidores' : 'Seguidores no conectados'}</span>
              </button>

              <button
                type="button"
                className="follow-stat-box follow-stat-btn"
                onClick={() => setActiveModal('seguidos')}
              >
                <span className="follow-stat-number">{seguidos.length}</span>
                <span className="follow-stat-label">Siguiendo</span>
              </button>
            </div>

            <div className="follow-community-preview">
              <div className="section-header">
                <span className="section-title">Usuarios de comunidad</span>
              </div>
              {usuariosComunidad.length === 0 ? (
                <p className="follow-empty">No hay usuarios de comunidad disponibles ahora mismo.</p>
              ) : (
                <div className="follow-list">
                  {usuariosComunidad.slice(0, 4).map((usuario) => renderUsuario(usuario))}
                </div>
              )}
            </div>

            {!seguidoresConnected && (
              <p className="follow-message">
                Seguidores no esta conectado todavia porque el backend no devuelve una ruta valida de seguidores.
              </p>
            )}
          </>
        )}
      </div>

      {activeModal && (
        <div className="follow-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="follow-modal-head">
              <div>
                <h3 className="follow-modal-title">{modalTitle}</h3>
                <p className="follow-modal-subtitle">{modalItems.length} usuario{modalItems.length === 1 ? '' : 's'}</p>
              </div>
              <button
                type="button"
                className="follow-modal-close"
                onClick={() => setActiveModal(null)}
              >
                ×
              </button>
            </div>

            <div className="follow-modal-body">
              {modalItems.length === 0 ? (
                <p className="follow-empty">
                  {activeModal === 'seguidores' ? 'Todavia no tienes seguidores.' : 'Aun no sigues a nadie.'}
                </p>
              ) : (
                <div className="follow-list">
                  {modalItems.map((usuario) => renderUsuario(usuario))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
