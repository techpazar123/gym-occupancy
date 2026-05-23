function ringColor(rate) {
  if (rate <= 40) return '#22c55e';
  if (rate <= 75) return '#eab308';
  return '#ef4444';
}

export default function OccupancyGauge({ rate, currentCount, maxCapacity }) {
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(rate, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;
  const color = ringColor(clamped);

  return (
    <div className="relative flex items-center justify-center w-52 h-52 mx-auto">
      <svg width="208" height="208" className="-rotate-90 absolute inset-0">
        <circle cx="104" cy="104" r={r} stroke="#1f2937" strokeWidth="16" fill="none" />
        <circle
          cx="104" cy="104" r={r}
          stroke={color}
          strokeWidth="16"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="text-5xl font-black leading-none" style={{ color }}>{clamped}%</span>
        <span className="text-gray-400 text-sm mt-1">{currentCount} / {maxCapacity} kişi</span>
      </div>
    </div>
  );
}
