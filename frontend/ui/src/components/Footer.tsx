export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-4 text-center space-y-1">
        <p className="text-xs text-slate-400">
          Modelo:{" "}
          <span className="text-slate-600 font-medium">LightGBM</span>
          {" · "}AUC:{" "}
          <span className="text-slate-600 font-medium">0.756</span>
          {" · "}TFM — Big Data e IA
          {" · "}Autor:{" "}
          <span className="text-slate-600 font-medium">Izan Moya Romero</span>
        </p>
        <p className="text-xs font-medium text-rose-500">
          Demo académica — No usar para decisiones crediticias reales
        </p>
      </div>
    </footer>
  );
}
