# Etiquetas en español para las 24 features seleccionadas por el modelo.
# Las features con días negativos (DAYS_*) se muestran en su interpretación positiva.
LABEL_ES: dict[str, str] = {
    # ── Originales numéricas ──────────────────────────────────────────────────
    "CODE_GENDER": "Género",
    "AMT_CREDIT": "Importe del crédito",
    "AMT_ANNUITY": "Cuota anual",
    "AMT_GOODS_PRICE": "Precio del bien financiado",
    "DAYS_BIRTH": "Edad del solicitante",
    "DAYS_EMPLOYED": "Antigüedad laboral",
    "DAYS_ID_PUBLISH": "Antigüedad del documento de identidad",
    "DAYS_LAST_PHONE_CHANGE": "Tiempo desde el último cambio de teléfono",
    # ── Originales binarias/flag ───────────────────────────────────────────────
    "REG_CITY_NOT_WORK_CITY": "Domicilio en ciudad diferente a la laboral",
    "FLAG_DOCUMENT_3": "Documento adicional 3 aportado",
    # ── Scores externos ────────────────────────────────────────────────────────
    "EXT_SOURCE_1": "Score crediticio externo 1",
    "EXT_SOURCE_2": "Score crediticio externo 2",
    "EXT_SOURCE_3": "Score crediticio externo 3",
    # ── One-hot de nivel educativo ─────────────────────────────────────────────
    "NAME_EDUCATION_TYPE_Higher education": "Nivel educativo: universitario",
    "NAME_EDUCATION_TYPE_Secondary / secondary special": "Nivel educativo: secundaria",
    # ── Features derivadas ─────────────────────────────────────────────────────
    "CREDIT_TERM": "Duración estimada del crédito",
    "DAYS_EMPLOYED_PERC": "Proporción de vida empleado",
    "CREDIT_GOODS_DIFF": "Sobre-financiación (crédito − valor del bien)",
    "CREDIT_GOODS_RATIO": "Ratio crédito / valor del bien",
    "EXT_SOURCE_MEAN": "Media de scores crediticios externos",
    "EXT_SOURCE_MIN": "Score crediticio externo mínimo",
    "EXT_SOURCE_MAX": "Score crediticio externo máximo",
    "EXT_SOURCE_PROD": "Producto de scores crediticios externos",
    "AGE_YEARS": "Edad (años)",
}


def get_label(feature: str) -> str:
    return LABEL_ES.get(feature, feature)
