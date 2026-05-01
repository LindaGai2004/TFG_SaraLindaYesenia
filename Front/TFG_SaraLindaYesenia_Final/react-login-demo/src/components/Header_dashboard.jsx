import { getApiUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = '/68e45e7a40b25293eb1f3a85d9368ae0.png';

export default function Header({ usuario }) {
  const { user } = useAuth();
  const profile = usuario ?? user;
  const avatarPath =
    profile?.fotoPerfil ??
    profile?.imagenPerfil ??
    profile?.avatar ??
    '';
  const avatar = avatarPath ? getApiUrl(avatarPath) : DEFAULT_AVATAR;

  return (
    <header className="header">
      <div className="header-profile">
        <div className="header-profile-info">
          <p className="header-profile-name">
            {profile?.nombre} {profile?.apellidos}
          </p>
          <p className="header-profile-email">{profile?.email}</p>
        </div>
        <div className="header-avatar">
          <img
            src={avatar}
            alt="Avatar"
            className="header-avatar-image"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>
      </div>
    </header>
  );
}
