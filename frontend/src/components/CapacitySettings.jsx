import { useState } from 'react';
import { updateCapacity } from '../api';

export default function CapacitySettings({ currentMax, token, onSaved }) {
  const [value, setValue] = useState(currentMax || 100);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const cap = parseInt(value, 10);
    if (!cap || cap < 1) return alert('Geçerli bir sayı girin');
    setSaving(true);
    try {
      await updateCapacity(cap, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await onSaved();
    } catch (e) {
      alert('Hata: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Maksimum Kapasite</label>
        <input
          type="number"
          min="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
        }`}
      >
        {saved ? 'Kaydedildi!' : saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}
