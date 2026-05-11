from typing import Literal

from pydantic import BaseModel


class FeatureContribution(BaseModel):
    feature: str
    label: str
    value: float
    shap_value: float
    impact: Literal["positive", "negative"]


class PredictionResponse(BaseModel):
    veredicto: Literal["APROBADO", "DENEGADO"]
    probabilidad_default: float
    confianza: float
    umbral_usado: float
    features_originales: dict
    top_drivers: list[FeatureContribution]
    shap_base_value: float
    shap_values: list[FeatureContribution]
    patrones_detectados: list[str]


class BatchRowResult(BaseModel):
    row: int
    veredicto: Literal["APROBADO", "DENEGADO"] | None = None
    probabilidad_default: float | None = None
    confianza: float | None = None
    error: str | None = None


class BatchResponse(BaseModel):
    total: int
    aprobados: int
    denegados: int
    errores: int
    results: list[BatchRowResult]
