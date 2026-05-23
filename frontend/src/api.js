// VITE_API_URL boşsa Vite dev proxy devreye girer (/api → localhost:3001)
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Giriş başarısız');
  }
  return res.json();
}

export async function fetchOccupancy() {
  const res = await fetch(`${BASE}/occupancy`);
  if (!res.ok) throw new Error('Doluluk verisi alınamadı');
  return res.json();
}

export async function fetchLogs(token) {
  const res = await fetch(`${BASE}/logs`, {
    headers: authHeaders(token),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (!res.ok) throw new Error('Kayıtlar alınamadı');
  return res.json();
}

export async function postAccess(cardId, type) {
  const res = await fetch(`${BASE}/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, type, timestamp: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Erişim kaydedilemedi');
  return res.json();
}

export async function updateCapacity(maxCapacity, token) {
  const res = await fetch(`${BASE}/settings/capacity`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ maxCapacity }),
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (!res.ok) throw new Error('Kapasite güncellenemedi');
  return res.json();
}
