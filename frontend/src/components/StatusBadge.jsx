const CONFIG = {
  Sakin: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40', dot: 'bg-green-400' },
  Orta:  { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40', dot: 'bg-yellow-400' },
  Yoğun: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', dot: 'bg-red-400' },
};

export default function StatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG['Sakin'];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
      {status}
    </span>
  );
}
