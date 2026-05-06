import ProfileSettings from '../../../components/ProfileSettings';

export default function TrabajadorConfig({ usuario, onUpdateUsuario }) {
  return (
    <ProfileSettings
      currentUser={usuario}
      roleId={3}
      roleLabel="trabajador"
      onProfileUpdated={onUpdateUsuario}
    />
  );
}
