import { ManualForm } from "../components/ManualForm/ManualForm";

export function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner demo académica */}
      <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5
        text-sm text-amber-800 text-center font-medium">
        Demo académica &mdash; No usar para decisiones crediticias reales
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-bank-900 tracking-tight">
          Evaluación de Riesgo Crediticio
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
          Introduce los datos del solicitante para obtener una predicción con el modelo
          LightGBM y su explicación SHAP.
          Los campos marcados con{" "}
          <span className="inline-flex items-center gap-0.5 text-slate-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>{" "}
          incluyen información de ayuda al pasar el cursor.
        </p>
      </div>

      <ManualForm />
    </div>
  );
}
