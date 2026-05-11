"""
Explicabilidad SHAP para el modelo LightGBM.

SHAP 0.49.1 + LightGBM binary:
- shap_values() devuelve ndarray (n_samples, n_features) en espacio log-odds.
- expected_value es un escalar np.float64.
- SHAP > 0 → aumenta P(default) → impacto negativo para el cliente.
- SHAP < 0 → reduce P(default) → impacto positivo para el cliente.
"""
from dataclasses import dataclass

import numpy as np
import pandas as pd
import shap

from ..artifacts import ArtifactBundle
from ..nl.patterns import generate_patterns
from ..nl.translations import get_label

# Singleton: el TreeExplainer se inicializa una sola vez por proceso.
# El modelo LightGBM no cambia en runtime, por lo que esto es seguro.
_explainer: shap.TreeExplainer | None = None


def _get_explainer(model) -> shap.TreeExplainer:
    global _explainer
    if _explainer is None:
        _explainer = shap.TreeExplainer(model)
    return _explainer


@dataclass
class ShapResult:
    base_value: float
    shap_values: list[dict]       # lista de FeatureContribution dicts (todas las features)
    top_drivers: list[dict]       # top 5 por abs(shap_value)
    patrones_detectados: list[str]


def explain(df_processed: pd.DataFrame, bundle: ArtifactBundle) -> ShapResult:
    """
    Calcula SHAP values para la primera fila de df_processed.
    df_processed debe tener exactamente las 24 columnas de selected_features.
    """
    explainer = _get_explainer(bundle.model)
    raw = explainer.shap_values(df_processed)

    # Robustez ante cambios de formato entre versiones de SHAP
    if isinstance(raw, list):
        # Formato antiguo: [shap_class0, shap_class1]
        values_row = np.array(raw[1])[0]
        base = (
            float(explainer.expected_value[1])
            if isinstance(explainer.expected_value, (list, np.ndarray))
            else float(explainer.expected_value)
        )
    else:
        # Formato actual (SHAP >= 0.47): ndarray (n_samples, n_features)
        values_row = np.array(raw)[0]
        base = (
            float(explainer.expected_value[1])
            if isinstance(explainer.expected_value, (list, np.ndarray))
            else float(explainer.expected_value)
        )

    features = bundle.selected_features
    contribs = [
        {
            "feature": feat,
            "label": get_label(feat),
            "value": float(df_processed[feat].iloc[0]),
            "shap_value": float(v),
            # SHAP > 0 → sube P(default) → negativo para el cliente
            "impact": "negative" if v > 0 else "positive",
        }
        for feat, v in zip(features, values_row)
    ]

    top = sorted(contribs, key=lambda x: abs(x["shap_value"]), reverse=True)[:5]
    patterns = generate_patterns(top)

    return ShapResult(
        base_value=base,
        shap_values=contribs,
        top_drivers=top,
        patrones_detectados=patterns,
    )
