import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username, password);
      saveToken(token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏋️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Yönetici Girişi</h1>
          <p className="text-gray-500 text-sm mt-1">Admin paneline erişmek için giriş yapın</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center mt-4">
          <a href="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
            ← Üye ekranına dön
          </a>
        </p>
      </div>
    </div>
  );
}
