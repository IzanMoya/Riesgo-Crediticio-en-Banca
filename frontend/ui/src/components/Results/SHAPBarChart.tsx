import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { FeatureContribution } from "../../types/prediction";

const COLORS = { negative: "#f43f5e", positive: "#10b981" } as const;

const truncate = (s: string, n = 28) => (s.length > n ? s.slice(0, n) + "…" : s);

interface TooltipPayload {
  payload?: FeatureContribution & { shap_value: number };
  value?: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload!;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-slate-800 mb-1">{d.label}</p>
      <p className={d.impact === "negative" ? "text-rose-600" : "text-emerald-600"}>
        SHAP: {d.shap_value > 0 ? "+" : ""}
        {d.shap_value.toFixed(4)}
      </p>
      <p className="text-slate-400 mt-0.5">
        Valor feature: {typeof d.value === "number" ? d.value.toFixed(3) : d.value}
      </p>
    </div>
  );
}

interface Props {
  data: FeatureContribution[];
  topN?: number;
}

export function SHAPBarChart({ data, topN = 10 }: Props) {
  const chartData = [...data]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, topN)
    .reverse()
    .map((d) => ({ ...d, label_short: truncate(d.label) }));

  const maxAbs = Math.max(...chartData.map((d) => Math.abs(d.shap_value)), 0.01);
  const domain: [number, number] = [-maxAbs * 1.15, maxAbs * 1.15];

  const topLabel = chartData.at(-1)?.label ?? "";
  const ariaLabel = `Gráfico de barras SHAP con los ${chartData.length} factores más influyentes. El mayor impacto corresponde a "${topLabel}". Barras rojas aumentan el riesgo de impago; barras verdes lo reducen.`;

  return (
    <div role="img" aria-label={ariaLabel}>
    <ResponsiveContainer width="100%" height={chartData.length * 38 + 48}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
        barCategoryGap="20%"
      >
        <XAxis
          type="number"
          domain={domain}
          tickFormatter={(v: number) => v.toFixed(2)}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label_short"
          width={190}
          tick={{ fontSize: 12, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
        <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1.5} />
        <Bar dataKey="shap_value" radius={[0, 3, 3, 0]} maxBarSize={22}>
          {chartData.map((entry) => (
            <Cell key={entry.feature} fill={COLORS[entry.impact]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
