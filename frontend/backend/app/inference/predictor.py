import pandas as pd

from ..artifacts import ArtifactBundle


def predict(
    df_processed: pd.DataFrame,
    bundle: ArtifactBundle,
    threshold: float = 0.5,
) -> tuple[str, float, float]:
    """
    Devuelve (veredicto, probabilidad_default, confianza).
    - probabilidad_default: P(impago) según LightGBM
    - confianza: P de la clase predicha (1-proba si APROBADO, proba si DENEGADO)
    """
    proba = float(bundle.model.predict(df_processed)[0])
    veredicto = "DENEGADO" if proba >= threshold else "APROBADO"
    confianza = (1.0 - proba) if veredicto == "APROBADO" else proba
    return veredicto, proba, confianza
