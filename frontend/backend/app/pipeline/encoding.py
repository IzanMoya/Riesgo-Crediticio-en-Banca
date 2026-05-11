import pandas as pd


def apply_label_encoding(
    df: pd.DataFrame, mappings: dict[str, dict]
) -> pd.DataFrame:
    """
    Aplica LabelEncoding a las columnas binarias (≤2 valores únicos) exactamente
    como hizo el notebook antes del pd.get_dummies.
    Mapea F/M → 0/1, N/Y → 0/1, Cash loans/Revolving loans → 0/1.
    Valores no reconocidos quedan como NaN (el imputer los tratará).
    """
    df = df.copy()
    for col, mapping in mappings.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)
    return df


def apply_onehot_with_reindex(
    df: pd.DataFrame, categories: dict[str, list[str]]
) -> pd.DataFrame:
    """
    Aplica pd.get_dummies a las columnas categóricas usando SOLO las categorías
    observadas en el entrenamiento. Valores no vistos quedan como columna a 0.

    Forzamos pd.Categorical con las categorías de train para que get_dummies
    produzca exactamente las mismas columnas dummy que el notebook, sin importar
    qué valores traiga el dato de inferencia.
    """
    df = df.copy()
    for col, cats in categories.items():
        if col not in df.columns:
            continue
        df[col] = pd.Categorical(df[col], categories=cats)
    # Solo pasar a get_dummies las columnas que realmente existen en el DataFrame
    dummy_cols = [c for c in categories.keys() if c in df.columns]
    return pd.get_dummies(df, columns=dummy_cols)
