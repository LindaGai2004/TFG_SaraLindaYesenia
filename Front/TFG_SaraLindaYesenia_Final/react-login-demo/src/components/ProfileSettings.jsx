import { useEffect, useRef, useState } from 'react';
import { apiPost, apiPut, getApiUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './ProfileSettings.css';

const DEFAULT_AVATAR = '/68e45e7a40b25293eb1f3a85d9368ae0.png';

export default function ProfileSettings({
  currentUser,
  roleId,
  roleLabel,
  onProfileUpdated,
}) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    direccion: '',
    fechaNacimiento: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    setForm({
      nombre: currentUser?.nombre ?? '',
      apellidos: currentUser?.apellidos ?? '',
      email: currentUser?.email ?? user?.email ?? '',
      username: currentUser?.username ?? user?.username ?? '',
      direccion: currentUser?.direccion ?? '',
      fechaNacimiento: currentUser?.fechaNacimiento ?? '',
      password: '',
    });
    setImagePreview('');
    setMessage('');
  }, [currentUser, user?.email, user?.username]);

  const avatarPath =
    currentUser?.fotoPerfil ??
    currentUser?.imagenPerfil ??
    currentUser?.avatar ??
    user?.fotoPerfil ??
    user?.imagenPerfil ??
    user?.avatar ??
    '';

  const avatarSrc = imagePreview || (avatarPath ? getApiUrl(avatarPath) : DEFAULT_AVATAR);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const syncUser = (changes) => {
    const mergedUser = { ...(user ?? {}), ...(currentUser ?? {}), ...changes };
    updateUser(mergedUser);
    onProfileUpdated?.(mergedUser);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !form.email) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result ?? ''));
    reader.readAsDataURL(file);

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiPost(`/usuario/${currentUser?.email ?? form.email}/avatar`, formData, true);
      const avatar = result?.avatar ?? result?.fotoPerfil ?? result?.imagenPerfil ?? '';

      if (avatar) {
        syncUser({
          avatar,
          fotoPerfil: avatar,
          imagenPerfil: avatar,
        });
      }

      setMessage('Foto de perfil actualizada correctamente.');
    } catch (error) {
      console.error('Error al subir la foto de perfil:', error);
      setMessage('No se pudo subir la foto de perfil.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.email) return;

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        nombre: form.nombre,
        apellidos: form.apellidos,
        email: form.email,
        username: form.username,
        direccion: form.direccion,
        fechaNacimiento: form.fechaNacimiento || null,
        perfil: currentUser?.perfil ?? user?.perfil ?? { idPerfil: roleId },
      };
      console.log('payload enviado:', JSON.stringify(payload)); // 👈 加这行

      if (form.password?.trim()) {
        payload.password = form.password;
      }

      await apiPut(`/usuario/${currentUser?.email ?? form.email}`, payload);
      syncUser(payload);
      setForm((prev) => ({ ...prev, password: '' }));
      setMessage('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      setMessage('No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-profile-section">
      <div className="dashboard-profile-card">
        <div className="dashboard-profile-head">
          <div>
            <span className="dashboard-section-title">Mis datos</span>
            <p className="dashboard-profile-subtitle">
              Consulta y modifica tu informacion personal.
            </p>
          </div>
        </div>

        <div className="dashboard-profile-layout">
          <div className="dashboard-profile-photo-panel">
            <div className="dashboard-profile-photo-frame">
              <img
                src={avatarSrc}
                alt={`Perfil de ${roleLabel}`}
                className="dashboard-profile-photo"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="dashboard-profile-file-input"
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="dashboard-profile-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir foto'}
            </button>
          </div>

          <div className="dashboard-profile-form-grid">
            <label className="dashboard-profile-field">
              <span>Nombre</span>
              <input className="input-field" value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
            </label>
            <label className="dashboard-profile-field">
              <span>Apellidos</span>
              <input className="input-field" value={form.apellidos} onChange={(e) => setField('apellidos', e.target.value)} />
            </label>
            <label className="dashboard-profile-field">
              <span>Email</span>
              <input className="input-field" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
            </label>
            <label className="dashboard-profile-field">
              <span>Username</span>
              <input className="input-field" value={form.username} onChange={(e) => setField('username', e.target.value)} />
            </label>
            <label className="dashboard-profile-field dashboard-profile-field-full">
              <span>Direccion</span>
              <input className="input-field" value={form.direccion} onChange={(e) => setField('direccion', e.target.value)} />
            </label>
            <label className="dashboard-profile-field">
              <span>Fecha de nacimiento</span>
              <input className="input-field" type="date" value={form.fechaNacimiento} onChange={(e) => setField('fechaNacimiento', e.target.value)} />
            </label>
            <label className="dashboard-profile-field">
              <span>Nueva contrasena</span>
              <input
                className="input-field"
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder="Solo si quieres cambiarla"
              />
            </label>
          </div>
        </div>

        {message && <p className="dashboard-profile-message">{message}</p>}

        <div className="dashboard-profile-actions">
          <button
            type="button"
            className="btn btn-primary dashboard-profile-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
