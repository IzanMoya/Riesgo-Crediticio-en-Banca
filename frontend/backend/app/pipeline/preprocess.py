import numpy as np
import pandas as pd

from ..artifacts import ArtifactBundle
from .cleaning import apply_initial_cleaning
from .encoding import apply_label_encoding, apply_onehot_with_reindex
from .feature_engineering import add_engineered_features
from .isnan_flags import add_isnan_flags


def preprocess_for_inference(
    raw: pd.DataFrame, bundle: ArtifactBundle
) -> pd.DataFrame:
    """
    Orquesta el pipeline de preprocesado replicando exactamente el notebook:

    1. Limpieza inicial (drop _MODE/_MEDI, OWN_CAR_AGE→0, object→'Unknown')
    2. Label encoding de columnas binarias (CODE_GENDER, FLAG_OWN_CAR, etc.)
    3. One-hot encoding con reindex a categorías de train
    4. Feature engineering (12 variables derivadas)
    5. Flags _ISNAN para columnas con nulos (usando dropped_isnan_flags.pkl)
    6. Reindex a feature_columns_pre_selection (260 cols, fill_value=0)
    7. SimpleImputer (medianas de X_train)
    8. StandardScaler
    9. Selección de las 24 features finales
    """
    df = apply_initial_cleaning(raw)
    df = apply_label_encoding(df, bundle.label_encoder_mappings)
    df = apply_onehot_with_reindex(df, bundle.categorical_columns_categories)
    df = add_engineered_features(df)
    df = add_isnan_flags(df, bundle.dropped_isnan_flags)

    # Garantizar el mismo orden y conjunto de columnas que en el entrenamiento.
    # Columnas ausentes se rellenan con 0 (valid: las 24 features seleccionadas
    # no dependen de columnas _AVG/_MEDI ausentes del formulario).
    df = df.reindex(columns=bundle.feature_columns_pre_selection, fill_value=0)

    # Imputación y escalado con los artefactos ajustados en X_train
    imputed = bundle.imputer.transform(df)
    scaled = bundle.scaler.transform(imputed)

    df_scaled = pd.DataFrame(
        scaled,
        columns=bundle.feature_columns_pre_selection,
        index=df.index,
    )

    return df_scaled[bundle.selected_features]
