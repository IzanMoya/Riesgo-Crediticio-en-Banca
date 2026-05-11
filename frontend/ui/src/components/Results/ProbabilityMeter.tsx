interface Props {
  probability: number;
  threshold: number;
}

export function ProbabilityMeter({ probability, threshold }: Props) {
  const pct = Math.min(Math.max(probability * 100, 0), 100);
  const thPct = threshold * 100;
  const isHigh = probability >= threshold;

  const ariaLabel = `Medidor de probabilidad de impago: ${pct.toFixed(1)}%, ${
    isHigh ? "por encima" : "por debajo"
  } del umbral de decisión (${thPct.toFixed(0)}%).`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="space-y-2"
    >
      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>Bajo riesgo</span>
        <span className={isHigh ? "text-rose-600" : "text-emerald-600"}>
          P(impago) = {pct.toFixed(1)}%
        </span>
        <span>Alto riesgo</span>
      </div>

      {/* Track */}
      <div className="relative h-3 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-500">
        {/* Threshold marker */}
        <div
          className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-slate-600 rounded-full z-10"
          style={{ left: `${thPct}%` }}
          title={`Umbral: ${thPct}%`}
        />
        {/* Probability dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg z-20 transition-all duration-500
            ${isHigh ? "bg-rose-600" : "bg-emerald-600"}`}
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span className="text-slate-500">Umbral {thPct.toFixed(0)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
