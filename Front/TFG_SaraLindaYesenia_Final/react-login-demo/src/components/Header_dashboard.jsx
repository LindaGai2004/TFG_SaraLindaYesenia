export default function Header({ admin }) {
    return (
      <header className="header">
        <div className="header-profile">
          <div className="header-profile-info">
            <p className="header-profile-name">
              {admin?.nombre} {admin?.apellidos}
            </p>
            <p className="header-profile-email">{admin?.email}</p>
          </div>
          <div className="header-avatar">👨‍💼</div>
        </div>
      </header>
    );
  }
  