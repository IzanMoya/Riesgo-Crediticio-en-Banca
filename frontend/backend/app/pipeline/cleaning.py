import pandas as pd


def apply_initial_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    """
    Replica la limpieza estructural del notebook (pasos 2 y 3a):
    - Elimina columnas _MODE y _MEDI (housing redundantes del dataset completo)
    - OWN_CAR_AGE NaN → 0
    - OCCUPATION_TYPE NaN → 'Unknown'
    - Resto de columnas object NaN → 'Unknown'
    - Elimina filas CODE_GENDER == 'XNA' (4 filas en train; improbable en inferencia)
    """
    df = df.copy()

    drop_cols = [c for c in df.columns if c.endswith("_MODE") or c.endswith("_MEDI")]
    if drop_cols:
        df = df.drop(columns=drop_cols)

    if "OWN_CAR_AGE" in df.columns:
        df["OWN_CAR_AGE"] = df["OWN_CAR_AGE"].fillna(0.0)

    if "OCCUPATION_TYPE" in df.columns:
        df["OCCUPATION_TYPE"] = df["OCCUPATION_TYPE"].fillna("Unknown")

    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].fillna("Unknown")

    if "CODE_GENDER" in df.columns:
        df = df[df["CODE_GENDER"] != "XNA"].copy()

    return df
