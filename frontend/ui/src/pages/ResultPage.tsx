import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft, ChevronDown, Printer } from "lucide-react";
import type { PredictionResponse } from "../types/prediction";
import { formatPct } from "../lib/formatters";
import { ProbabilityMeter } from "../components/results/ProbabilityMeter";
import { SHAPBarChart } from "../components/results/SHAPBarChart";
import { SHAPWaterfall } from "../components/results/SHAPWaterfall";

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as PredictionResponse | null;
  const [tableOpen, setTableOpen] = useState(false);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">No hay resultados. Realiza una evaluación primero.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-bank-600 underline text-sm"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  const isApproved = result.veredicto === "APROBADO";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5 animate-slide-up">

      {/* ── Veredicto ── */}
      <div
        className={`rounded-2xl overflow-hidden shadow-lg
          ${isApproved
            ? "bg-gradient-to-br from-emerald-600 to-teal-700"
            : "bg-gradient-to-br from-rose-700 to-red-800"
          } text-white`}
        role="status"
        aria-live="polite"
      >
        {/* Cabecera */}
        <div className="px-6 py-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            {isApproved
              ? <CheckCircle2 size={34} aria-hidden="true" className="text-white" />
              : <XCircle      size={34} aria-hidden="true" className="text-white" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70 mb-1 font-medium">
              Decisión crediticia
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {isApproved ? "Solicitud Aprobada" : "Solicitud Denegada"}
            </p>
          </div>
        </div>
        {/* Barra de métricas */}
        <div className="bg-black/15 px-6 py-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
          {[
            { label: "P(impago)",    value: formatPct(result.probabilidad_default) },
            { label: "Confianza",    value: formatPct(result.confianza) },
            { label: "Umbral usado", value: formatPct(result.umbral_usado) },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-white/65">{label}:</span>{" "}
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Medidor de probabilidad ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Posición respecto al umbral de decisión
        </h2>
        <ProbabilityMeter
          probability={result.probabilidad_default}
          threshold={result.umbral_usado}
        />
      </div>

      {/* ── Gráfico de barras SHAP ── */}
      {result.shap_values.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
          <h2 className="font-semibold text-slate-800 mb-1">
            Top 10 factores — Contribuciones SHAP
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Barras rojas aumentan el riesgo &middot; Verdes lo reducen &middot; Ordenadas por impacto absoluto
          </p>
          <SHAPBarChart data={result.shap_values} topN={10} />
        </div>
      )}

      {/* ── Waterfall SHAP ── */}
      {result.shap_values.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
          <h2 className="font-semibold text-slate-800 mb-1">
            Waterfall SHAP &mdash; acumulación desde el valor base
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Muestra cómo cada factor desplaza la predicción desde el valor base (línea punteada)
            hasta la probabilidad final
          </p>
          <SHAPWaterfall
            data={result.shap_values}
            baseValue={result.shap_base_value}
            topN={8}
          />
        </div>
      )}

      {/* ── Factores clave en lenguaje natural ── */}
      {result.patrones_detectados.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
          <h2 className="font-semibold text-slate-800 mb-3">
            Factores clave detectados
          </h2>
          <ul className="space-y-2.5">
            {result.patrones_detectados.map((p, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2.5 items-start">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-bank-100 text-bank-700
                  text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Tabla SHAP completa (colapsable) ── */}
      {result.shap_values.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <button
            type="button"
            aria-expanded={tableOpen}
            aria-controls="shap-full-table"
            onClick={() => setTableOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-4 text-left
              hover:bg-slate-50 transition-colors"
          >
            <span className="font-semibold text-slate-800 text-sm">
              Contribuciones SHAP completas ({result.shap_values.length} variables)
            </span>
            <ChevronDown
              size={17}
              aria-hidden="true"
              className={`text-slate-400 transition-transform duration-200 ${tableOpen ? "rotate-180" : ""}`}
            />
          </button>

          {tableOpen && (
            <div id="shap-full-table" className="border-t border-slate-100 overflow-x-auto">
              <table
                className="w-full text-xs"
                aria-label="Contribuciones SHAP de todas las variables"
              >
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 bg-slate-50">
                    <th scope="col" className="text-left px-5 py-2 font-medium">Variable</th>
                    <th scope="col" className="text-right px-4 py-2 font-medium">Valor</th>
                    <th scope="col" className="text-right px-5 py-2 font-medium">SHAP</th>
                  </tr>
                </thead>
                <tbody>
                  {[...result.shap_values]
                    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
                    .map((c) => (
                      <tr key={c.feature} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-5 py-1.5 text-slate-700">{c.label}</td>
                        <td className="px-4 py-1.5 text-right text-slate-500 font-mono">
                          {c.value.toFixed(3)}
                        </td>
                        <td className={`px-5 py-1.5 text-right font-mono font-semibold
                          ${c.impact === "negative" ? "text-rose-600" : "text-emerald-600"}`}>
                          {c.shap_value > 0 ? "+" : ""}
                          {c.shap_value.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Acciones ── */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white
            hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 text-sm transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Nueva evaluación
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white
            hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 text-sm transition-colors"
        >
          <Printer size={15} aria-hidden="true" /> Imprimir informe
        </button>
      </div>
    </div>
  );
}
