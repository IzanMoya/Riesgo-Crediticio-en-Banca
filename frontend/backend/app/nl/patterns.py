"""
Genera frases en lenguaje natural a partir de los top drivers SHAP.
Las frases están pensadas para un gestor bancario sin formación en ML.
"""


def generate_patterns(top_drivers: list[dict]) -> list[str]:
    """
    Recibe los top_drivers (lista de FeatureContribution dicts) ordenados por
    abs(shap_value) descendente y devuelve frases explicativas en español.
    """
    out: list[str] = []

    for d in top_drivers:
        verbo = "aumenta" if d["impact"] == "negative" else "reduce"
        intensidad = _intensity_word(abs(d["shap_value"]))
        out.append(
            f"«{d['label']}» {verbo} {intensidad} el riesgo de impago "
            f"(impacto SHAP: {d['shap_value']:+.3f})."
        )

    # Patrones cruzados entre features del top
    feature_set = {d["feature"] for d in top_drivers}

    ext_sources = {f for f in feature_set if f.startswith("EXT_SOURCE")}
    if len(ext_sources) >= 2:
        out.append(
            "Los scores crediticios externos son determinantes en esta decisión: "
            "reflejan el historial de crédito del solicitante en fuentes externas."
        )

    if "AMT_CREDIT" in feature_set and "CREDIT_GOODS_RATIO" in feature_set:
        out.append(
            "El importe solicitado supera significativamente el valor del bien "
            "financiado, lo que incrementa el riesgo percibido."
        )

    if "DAYS_EMPLOYED_PERC" in feature_set or "DAYS_EMPLOYED" in feature_set:
        out.append(
            "La estabilidad laboral del solicitante influye de forma notable "
            "en la evaluación del riesgo."
        )

    if "AGE_YEARS" in feature_set or "DAYS_BIRTH" in feature_set:
        out.append(
            "La edad del solicitante es un factor relevante en el perfil de riesgo."
        )

    return out


def _intensity_word(abs_shap: float) -> str:
    if abs_shap >= 0.15:
        return "considerablemente"
    if abs_shap >= 0.08:
        return "moderadamente"
    if abs_shap >= 0.03:
        return "ligeramente"
    return "marginalmente"
