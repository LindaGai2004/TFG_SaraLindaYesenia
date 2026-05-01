import { useState, useEffect } from 'react';

export default function AdminConfig({
  admin,
  onUpdateAdmin,
}) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    username: '',
    password: '',
    direccion: '',
    email: '',
    fechaNacimiento: '',
    fechaRegistro: '',
  });

  useEffect(() => {
    setForm(admin || {});
  }, [admin]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      await onUpdateAdmin(form);
    } catch {}
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '30rem' }}>
        <h2
          className="text-xl font-bold text-primary mb-1"
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          Mi cuenta
        </h2>

        <div
          className="rounded-2xl border bg-white p-5"
          style={{ borderColor: '#e2e8f0' }}
        >
          <div
            className="flex items-center gap-4 mb-5 pb-5"
            style={{ borderBottom: '1px solid #f1f5f9' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-green-light">
              👨‍💼
            </div>
            <div>
              <p className="font-bold text-primary">
                {form?.nombre} {form?.apellidos}
              </p>
              <p className="text-xs text-secondary">Administrador</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              ['Nombre', 'nombre'],
              ['Apellidos', 'apellidos'],
              ['Email', 'email'],
              ['Username', 'username'],
              ['Contrasena', 'password'],
              ['Direccion', 'direccion'],
              ['Fecha de registro', 'fechaRegistro'],
              ['Fecha de nacimiento', 'fechaNacimiento'],
            ].map(([label, key]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  value={form[key] || ''}
                  onChange={(e) => set(key, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary mt-5"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
