export interface FeatureContribution {
  feature: string;
  label: string;
  value: number;
  shap_value: number;
  impact: "positive" | "negative";
}

export interface PredictionResponse {
  veredicto: "APROBADO" | "DENEGADO";
  probabilidad_default: number;
  confianza: number;
  umbral_usado: number;
  features_originales: Record<string, unknown>;
  top_drivers: FeatureContribution[];
  shap_base_value: number;
  shap_values: FeatureContribution[];
  patrones_detectados: string[];
}

export interface BatchRowResult {
  row: number;
  veredicto: "APROBADO" | "DENEGADO" | null;
  probabilidad_default: number | null;
  confianza: number | null;
  error: string | null;
}

export interface BatchResponse {
  total: number;
  aprobados: number;
  denegados: number;
  errores: number;
  results: BatchRowResult[];
}
