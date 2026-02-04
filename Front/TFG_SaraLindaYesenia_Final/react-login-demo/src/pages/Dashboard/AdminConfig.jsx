import { useState, useEffect } from 'react';

export default function AdminConfig({ admin, onUpdateAdmin }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    password: "",
    direccion: "",
    email: "",
  });
    useEffect(() => {
    setForm(admin || {});
  }, [admin]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      await onUpdateAdmin(form);
      alert('✅ 数据保存成功');
    } catch (error) {
      alert('❌ 保存失败');
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold text-primary mb-1">我的账户</h2>
      <p className="text-xs text-secondary mb-5">修改管理员数据</p>

      <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-green-light">👨‍💼</div>
          <div>
            <p className="font-bold text-primary">{form?.nombre} {form?.apellidos}</p>
            <p className="text-xs text-secondary">管理员</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            ['姓名', 'nombre'],
            ['姓氏', 'apellidos'],
            ['邮箱', 'email'],
            ['用户名', 'username'],
            ['Contraseña', 'password'],
            ['Dirección', 'direccion'],
          ].map(([label, key]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input value={form[key] || ''} onChange={e => set(key, e.target.value)} className="input-field" />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="btn btn-primary w-full mt-5">
          保存修改
        </button>
      </div>
    </div>
  );
}


