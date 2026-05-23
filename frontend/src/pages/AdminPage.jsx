import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOccupancy } from '../hooks/useOccupancy';
import { fetchLogs, updateCapacity, postAccess } from '../api';
import OccupancyGauge from '../components/OccupancyGauge';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import LogsList from '../components/LogsList';
import CapacitySettings from '../components/CapacitySettings';
import SimulatePanel from '../components/SimulatePanel';

export default function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { data, error: occError, refresh: refreshOcc } = useOccupancy();
  const [logs, setLogs] = useState([]);
  const [logsError, setLogsError] = useState(null);

  const refreshLogs = useCallback(async () => {
    try {
      const list = await fetchLogs(token);
      setLogs(list);
      setLogsError(null);
    } catch (e) {
      if (e.message === 'unauthorized') {
        logout();
        navigate('/admin/login');
      } else {
        setLogsError(e.message);
      }
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    refreshLogs();
    const id = setInterval(refreshLogs, 3000);
    return () => clearInterval(id);
  }, [refreshLogs]);

  async function handleRefresh() {
    await Promise.all([refreshOcc(), refreshLogs()]);
  }

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  if (occError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold">Bağlantı hatası</p>
          <p className="text-gray-500 text-sm mt-1">{occError}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Yönetici Paneli</h1>
            <p className="text-gray-500 text-sm mt-1">Her 3 saniyede güncellenir</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Üye ekranı
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol kolon */}
          <div className="space-y-6">
            {/* Doluluk kartı */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-300 font-semibold">Anlık Doluluk</h2>
                <StatusBadge status={data.status} />
              </div>

              <OccupancyGauge
                rate={data.occupancyRate}
                currentCount={data.currentCount}
                maxCapacity={data.maxCapacity}
              />

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>Doluluk oranı</span>
                  <span>%100</span>
                </div>
                <ProgressBar rate={data.occupancyRate} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">Mevcut</p>
                  <p className="text-white font-bold text-xl">{data.currentCount}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">Kapasite</p>
                  <p className="text-white font-bold text-xl">{data.maxCapacity}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">Boş</p>
                  <p className="text-white font-bold text-xl">{data.maxCapacity - data.currentCount}</p>
                </div>
              </div>
            </div>

            {/* Simülasyon */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-gray-300 font-semibold mb-2">Test Simülasyonu</h2>
              <p className="text-gray-500 text-xs mb-4">
                Gerçek kart sistemi bağlandığında bu butonlar kaldırılacak.
              </p>
              <SimulatePanel onAction={handleRefresh} />
            </div>

            {/* Kapasite ayarı */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-gray-300 font-semibold mb-4">Kapasite Ayarı</h2>
              <CapacitySettings
                currentMax={data.maxCapacity}
                token={token}
                onSaved={handleRefresh}
              />
            </div>
          </div>

          {/* Sağ kolon: Kayıtlar */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-semibold">Son Hareketler</h2>
              <span className="text-gray-500 text-xs">{logs.length} kayıt</span>
            </div>
            {logsError ? (
              <p className="text-red-400 text-sm">{logsError}</p>
            ) : (
              <LogsList logs={logs} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
