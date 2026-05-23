function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString('tr-TR');
  } catch {
    return ts;
  }
}

export default function LogsList({ logs }) {
  if (!logs.length) {
    return <p className="text-gray-500 text-sm text-center py-6">Henüz kayıt yok</p>;
  }

  return (
    <ul className="divide-y divide-gray-800 max-h-72 overflow-y-auto">
      {logs.map((log) => (
        <li key={log.id} className="flex items-center justify-between py-2.5 px-1">
          <div className="flex items-center gap-3">
            <span
              className={`text-lg ${log.type === 'entry' ? 'text-green-400' : 'text-red-400'}`}
              title={log.type === 'entry' ? 'Giriş' : 'Çıkış'}
            >
              {log.type === 'entry' ? '↑' : '↓'}
            </span>
            <span className="text-gray-300 text-sm font-mono">{log.card_id}</span>
          </div>
          <div className="text-right">
            <span className={`text-xs font-semibold ${log.type === 'entry' ? 'text-green-400' : 'text-red-400'}`}>
              {log.type === 'entry' ? 'Giriş' : 'Çıkış'}
            </span>
            <p className="text-gray-500 text-xs">{formatTime(log.timestamp)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
