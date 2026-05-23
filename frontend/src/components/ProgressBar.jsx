function barColor(rate) {
  if (rate <= 40) return 'bg-green-500';
  if (rate <= 75) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function ProgressBar({ rate }) {
  const clamped = Math.min(Math.max(rate, 0), 100);
  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${barColor(clamped)}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
