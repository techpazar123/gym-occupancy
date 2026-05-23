import { useState } from 'react';
import { postAccess } from '../api';

function randomCardId() {
  return 'KART-' + Math.floor(1000 + Math.random() * 9000);
}

export default function SimulatePanel({ onAction }) {
  const [loading, setLoading] = useState(false);

  async function handle(type) {
    setLoading(true);
    try {
      await postAccess(randomCardId(), type);
      await onAction();
    } catch (e) {
      alert('Hata: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handle('entry')}
        disabled={loading}
        className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
      >
        ↑ Giriş Simüle Et
      </button>
      <button
        onClick={() => handle('exit')}
        disabled={loading}
        className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
      >
        ↓ Çıkış Simüle Et
      </button>
    </div>
  );
}
