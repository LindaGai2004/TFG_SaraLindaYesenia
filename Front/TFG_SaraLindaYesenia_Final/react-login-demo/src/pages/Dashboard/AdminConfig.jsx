import ProfileSettings from '../../components/ProfileSettings';

export default function AdminConfig({ usuario, onUpdateUsuario }) {
  return (
    <ProfileSettings
      currentUser={usuario}
      roleId={1}
      roleLabel="administrador"
      onProfileUpdated={onUpdateUsuario}
    />
  );
}
