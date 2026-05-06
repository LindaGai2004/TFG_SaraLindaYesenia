import ProfileSettings from '../../../components/ProfileSettings';

export default function JefeConfig({ usuario, onUpdateUsuario }) {
  return (
    <ProfileSettings
      currentUser={usuario}
      roleId={4}
      roleLabel="jefe"
      onProfileUpdated={onUpdateUsuario}
    />
  );
}
