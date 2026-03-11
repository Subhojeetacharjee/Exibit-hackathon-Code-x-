const UrgencyBadge = ({ level }) => {
  const config = {
    low: {
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Low Urgency',
      ring: 'ring-emerald-500/30',
    },
    medium: {
      bg: 'bg-amber-500/10 border-amber-500/25',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Medium Urgency',
      ring: 'ring-amber-500/30',
    },
    high: {
      bg: 'bg-red-500/10 border-red-500/25',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'High Urgency',
      ring: 'ring-red-500/30',
    }
  };

  const { bg, text, dot, label, ring } = config[level] || config.low;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bg} ${text} text-xs font-bold border tracking-wide uppercase`}>
      <span className={`relative w-2 h-2 rounded-full ${dot}`}>
        <span className={`absolute inset-0 rounded-full ${dot} animate-ping opacity-75`}></span>
      </span>
      {label}
    </span>
  );
};

export default UrgencyBadge;
