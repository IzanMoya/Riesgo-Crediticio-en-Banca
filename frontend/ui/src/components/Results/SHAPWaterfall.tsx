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

const truncate = (s: string, n = 24) => (s.length > n ? s.slice(0, n) + "…" : s);

interface WFRow {
  feature: string;
  label: string;
  label_short: string;
  barStart: number;
  barLen: number;
  shap_value: number;
  impact: "positive" | "negative";
}

function buildRows(data: FeatureContribution[], baseValue: number, topN: number): WFRow[] {
  const top = [...data]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, topN)
    .sort((a, b) => b.shap_value - a.shap_value);

  let running = baseValue;
  return top.map((d) => {
    const from = running;
    running += d.shap_value;
    return {
      feature: d.feature,
      label: d.label,
      label_short: truncate(d.label),
      barStart: Math.min(from, running),
      barLen: Math.abs(d.shap_value),
      shap_value: d.shap_value,
      impact: d.impact,
    };
  });
}

function WFTooltip({ active, payload }: { active?: boolean; payload?: { payload?: WFRow }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload!;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-slate-800 mb-1">{d.label}</p>
      <p className={d.impact === "negative" ? "text-rose-600" : "text-emerald-600"}>
        SHAP: {d.shap_value > 0 ? "+" : ""}
        {d.shap_value.toFixed(4)}
      </p>
    </div>
  );
}

interface Props {
  data: FeatureContribution[];
  baseValue: number;
  topN?: number;
}

export function SHAPWaterfall({ data, baseValue, topN = 8 }: Props) {
  const rows = buildRows(data, baseValue, topN);
  const allEnds = rows.map((r) => r.barStart + r.barLen);
  const minV = Math.min(baseValue, ...rows.map((r) => r.barStart));
  const maxV = Math.max(baseValue, ...allEnds);
  const pad = (maxV - minV) * 0.18;
  const domain: [number, number] = [minV - pad, maxV + pad];

  const ariaLabel = `Gráfico waterfall SHAP mostrando la acumulación de contribuciones desde el valor base (${baseValue.toFixed(3)}) hasta la predicción final.`;

  return (
    <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={rows.length * 40 + 48}>
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 56, left: 4, bottom: 4 }}
          barCategoryGap="28%"
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
          <Tooltip content={<WFTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <ReferenceLine
            x={baseValue}
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          {/* Transparent spacer for waterfall positioning */}
          <Bar dataKey="barStart" stackId="wf" fill="transparent" radius={0} />
          {/* Visible contribution bar */}
          <Bar dataKey="barLen" stackId="wf" radius={[0, 3, 3, 0]} maxBarSize={20}>
            {rows.map((r) => (
              <Cell
                key={r.feature}
                fill={r.impact === "negative" ? "#f43f5e" : "#10b981"}
                fillOpacity={0.87}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
