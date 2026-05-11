import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, FileText, AlertCircle, CheckCircle, XCircle,
  Download, RotateCcw, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { postPredictBatch } from "../api/predict";
import type { BatchResponse } from "../types/prediction";
import { formatPct } from "../lib/formatters";

const PER_PAGE = 25;

const TEMPLATE_HEADERS = [
  "AMT_INCOME_TOTAL","AMT_CREDIT","AMT_ANNUITY","AMT_GOODS_PRICE",
  "DAYS_BIRTH","DAYS_EMPLOYED",
  "EXT_SOURCE_1","EXT_SOURCE_2","EXT_SOURCE_3",
  "CODE_GENDER","FLAG_OWN_CAR","FLAG_OWN_REALTY",
  "CNT_CHILDREN","CNT_FAM_MEMBERS",
  "NAME_CONTRACT_TYPE","NAME_INCOME_TYPE","NAME_EDUCATION_TYPE",
  "NAME_FAMILY_STATUS","NAME_HOUSING_TYPE","OCCUPATION_TYPE","ORGANIZATION_TYPE",
  "FLAG_DOCUMENT_3","REG_CITY_NOT_WORK_CITY",
];

const TEMPLATE_EXAMPLE = [
  150000, 300000, 25000, 270000,
  -12775, -1825,
  0.5, 0.5, 0.5,
  "M", "N", "Y",
  0, 2,
  "Cash loans", "Working", "Secondary / secondary special",
  "Married", "House / apartment", "Unknown", "Business Entity Type 3",
  0, 0,
];

function downloadTemplate() {
  const rows = [TEMPLATE_HEADERS.join(","), TEMPLATE_EXAMPLE.join(",")];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "plantilla_batch.csv"; a.click();
  URL.revokeObjectURL(url);
}

function downloadResults(result: BatchResponse) {
  const headers = ["Fila","Veredicto","P(impago)","Confianza","Error"];
  const rows = result.results.map((r) => [
    r.row, r.veredicto ?? "", r.probabilidad_default?.toFixed(4) ?? "",
    r.confianza?.toFixed(4) ?? "", r.error ?? "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "resultados_batch.csv"; a.click();
  URL.revokeObjectURL(url);
}

type PageState = "idle" | "loading" | "results" | "error";

export function BatchResultsPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pageState, setPageState] = useState<PageState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<BatchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [page, setPage] = useState(1);

  const totalPages = result ? Math.ceil(result.results.length / PER_PAGE) : 1;
  const pageRows = useMemo(() => {
    if (!result) return [];
    return result.results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [result, page]);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setErrorMsg("Selecciona un archivo .csv");
      setPageState("error");
      return;
    }
    setSelectedFile(file);
    setPageState("idle");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setPageState("loading");
    setErrorMsg("");
    try {
      const data = await postPredictBatch(selectedFile);
      setResult(data);
      setPage(1);
      setPageState("results");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error al procesar el archivo");
      setPageState("error");
    }
  };

  const reset = () => {
    setPageState("idle");
    setSelectedFile(null);
    setResult(null);
    setErrorMsg("");
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5
        text-sm text-amber-800 text-center font-medium">
        Demo académica &mdash; No usar para decisiones crediticias reales
      </div>

      <div>
        <h1 className="text-2xl font-bold text-bank-900 tracking-tight">Evaluación por lotes</h1>
        <p className="text-slate-500 mt-1.5 text-sm">
          Sube un CSV con múltiples solicitudes para obtener predicciones en bloque.{" "}
          <button
            onClick={downloadTemplate}
            className="text-bank-600 underline hover:text-bank-800"
          >
            Descargar plantilla CSV
          </button>
        </p>
      </div>

      {/* Drop zone */}
      {pageState !== "results" && (
        <div
          role="button"
          tabIndex={0}
          aria-label={selectedFile
            ? `Archivo: ${selectedFile.name}. Pulsa Enter para cambiar.`
            : "Zona de carga. Arrastra un CSV o pulsa Enter para seleccionar."}
          className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer
            ${dragOver
              ? "border-bank-500 bg-bank-50"
              : "border-slate-300 bg-white hover:border-bank-400 hover:bg-slate-50"}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input ref={inputRef} type="file" accept=".csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileText size={36} aria-hidden="true" className="text-bank-600" />
              <p className="font-medium text-slate-800">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={36} aria-hidden="true" className="text-slate-400" />
              <p className="text-slate-600 font-medium">Arrastra un CSV aquí o haz clic para seleccionar</p>
              <p className="text-xs text-slate-400">Máximo recomendado: 500 filas</p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {pageState === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Botones de acción (antes de tener resultados) */}
      {pageState !== "results" && (
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || pageState === "loading"}
            aria-busy={pageState === "loading"}
            className="flex items-center gap-2 rounded-xl
              bg-gradient-to-r from-bank-700 to-bank-600 hover:from-bank-800 hover:to-bank-700
              disabled:opacity-50 text-white font-semibold py-2.5 px-5 text-sm
              transition-all shadow-md hover:shadow-lg"
          >
            {pageState === "loading"
              ? <><Loader2 size={16} aria-hidden="true" className="animate-spin" /> Procesando&hellip;</>
              : <><Upload size={16} aria-hidden="true" /> Evaluar lote</>}
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50
              text-slate-700 font-medium py-2.5 px-5 text-sm transition-colors"
          >
            Evaluación manual
          </button>
        </div>
      )}

      {/* Resultados */}
      {pageState === "results" && result && (
        <div aria-live="polite" aria-atomic="true" className="space-y-5 animate-slide-up">

          {/* Resumen estadístico */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total evaluadas", value: result.total,     cls: "text-slate-800" },
              { label: "Aprobadas",        value: result.aprobados, cls: "text-emerald-700" },
              { label: "Denegadas",        value: result.denegados, cls: "text-rose-700" },
              { label: "Con error",        value: result.errores,   cls: "text-amber-700" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4 text-center">
                <div className={`text-2xl font-bold ${cls}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Barra de tasa de aprobación */}
          {result.total > result.errores && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-card px-5 py-3 flex items-center gap-3">
              <span className="text-sm text-slate-600 shrink-0">Tasa de aprobación:</span>
              <span className="font-semibold text-slate-800 text-sm shrink-0">
                {formatPct(result.aprobados / (result.total - result.errores))}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden ml-1">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${(result.aprobados / (result.total - result.errores)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Tabla de resultados */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm">
                Resultados por fila
                {totalPages > 1 && (
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({result.results.length} filas)
                  </span>
                )}
              </h2>
              <button
                onClick={() => downloadResults(result)}
                className="flex items-center gap-1.5 text-xs text-bank-600 hover:text-bank-800 font-medium"
              >
                <Download size={14} aria-hidden="true" /> Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Resultados de evaluación por lotes">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-xs text-slate-400 font-medium">
                    <th scope="col" className="text-left px-5 py-2">Fila</th>
                    <th scope="col" className="text-left px-4 py-2">Veredicto</th>
                    <th scope="col" className="text-right px-4 py-2">P(impago)</th>
                    <th scope="col" className="text-right px-5 py-2">Confianza</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.row} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-2 text-slate-400 font-mono text-xs">{r.row}</td>
                      <td className="px-4 py-2">
                        {r.error ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertCircle size={11} aria-hidden="true" /> Error
                          </span>
                        ) : r.veredicto === "APROBADO" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle size={11} aria-hidden="true" /> APROBADO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
                            <XCircle size={11} aria-hidden="true" /> DENEGADO
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-slate-700 text-xs">
                        {r.probabilidad_default != null ? formatPct(r.probabilidad_default) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-xs">
                        {r.confianza != null
                          ? <span className="text-slate-700">{formatPct(r.confianza)}</span>
                          : r.error
                          ? <span className="text-amber-600 font-sans">{r.error.slice(0, 50)}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900
                    disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  <ChevronLeft size={16} aria-hidden="true" /> Anterior
                </button>
                <span className="text-xs text-slate-500">
                  Página <span className="font-semibold text-slate-700">{page}</span> de{" "}
                  <span className="font-semibold text-slate-700">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900
                    disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Siguiente <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Acciones post-resultado */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white
                hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 text-sm transition-colors"
            >
              <RotateCcw size={14} aria-hidden="true" /> Nuevo lote
            </button>
            <button
              onClick={() => downloadResults(result)}
              className="flex items-center gap-2 rounded-xl
                bg-gradient-to-r from-bank-700 to-bank-600 hover:from-bank-800 hover:to-bank-700
                text-white font-semibold py-2 px-4 text-sm transition-all shadow-md"
            >
              <Download size={14} aria-hidden="true" /> Descargar resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
