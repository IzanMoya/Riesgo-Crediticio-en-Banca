import pandas as pd


def add_isnan_flags(df: pd.DataFrame, expected_flags: list[str]) -> pd.DataFrame:
    """
    Crea las columnas {col}_ISNAN que el notebook generó durante la imputación
    inicial (antes del split). Solo se crean las flags listadas en expected_flags
    (dropped_isnan_flags.pkl), que refleja exactamente lo que el modelo vio.

    El flag = 1 si el valor original era NaN; 0 si tenía dato.
    Si la columna original no existe en el DataFrame, el flag se pone a 0.
    """
    df = df.copy()
    for flag_col in expected_flags:
        original_col = flag_col.removesuffix("_ISNAN")
        if original_col in df.columns:
            df[flag_col] = df[original_col].isna().astype(int)
        else:
            df[flag_col] = 0
    return df
