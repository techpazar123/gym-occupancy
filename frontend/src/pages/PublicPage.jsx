import { useOccupancy } from '../hooks/useOccupancy';
import OccupancyGauge from '../components/OccupancyGauge';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';

export default function PublicPage() {
  const { data, error } = useOccupancy();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold">Bağlantı hatası</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Spor Salonu</h1>
          <p className="text-gray-500 text-sm mt-1">Anlık doluluk durumu</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <StatusBadge status={data.status} />
          </div>

          <OccupancyGauge
            rate={data.occupancyRate}
            currentCount={data.currentCount}
            maxCapacity={data.maxCapacity}
          />

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>Doluluk oranı</span>
              <span>%100</span>
            </div>
            <ProgressBar rate={data.occupancyRate} />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
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

        <p className="text-center text-gray-700 text-xs mt-6">Her 3 saniyede güncellenir</p>
      </div>
    </div>
  );
}
