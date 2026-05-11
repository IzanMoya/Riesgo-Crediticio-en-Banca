import numpy as np
import pandas as pd


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Replica las 12 variables derivadas del notebook (paso 6 del pipeline).
    Orden idéntico al notebook para garantizar reproducibilidad.

    Notas:
    - DAYS_EMPLOYED == 365243 → NaN (código de 'desempleado' en Home Credit)
    - División por cero → 0 (np.where)
    - inf → NaN al final (df.replace)
    """
    df = df.copy()

    # 365243 es el código de 'no empleado' en Home Credit
    df["DAYS_EMPLOYED"] = df["DAYS_EMPLOYED"].replace({365243: np.nan})

    df["PAYMENT_RATE"] = np.where(
        df["AMT_INCOME_TOTAL"] == 0,
        0.0,
        df["AMT_ANNUITY"] / df["AMT_INCOME_TOTAL"],
    )
    df["CREDIT_TO_INCOME"] = np.where(
        df["AMT_INCOME_TOTAL"] == 0,
        0.0,
        df["AMT_CREDIT"] / df["AMT_INCOME_TOTAL"],
    )
    df["CREDIT_TERM"] = np.where(
        df["AMT_ANNUITY"] == 0,
        0.0,
        df["AMT_CREDIT"] / df["AMT_ANNUITY"],
    )
    df["DAYS_EMPLOYED_PERC"] = np.where(
        df["DAYS_BIRTH"] == 0,
        0.0,
        df["DAYS_EMPLOYED"] / df["DAYS_BIRTH"],
    )
    df["INCOME_PER_PERSON"] = np.where(
        df["CNT_FAM_MEMBERS"] == 0,
        0.0,
        df["AMT_INCOME_TOTAL"] / df["CNT_FAM_MEMBERS"],
    )
    df["CREDIT_GOODS_DIFF"] = df["AMT_CREDIT"] - df["AMT_GOODS_PRICE"]
    df["CREDIT_GOODS_RATIO"] = np.where(
        df["AMT_GOODS_PRICE"] == 0,
        0.0,
        df["AMT_CREDIT"] / df["AMT_GOODS_PRICE"],
    )

    ext = df[["EXT_SOURCE_1", "EXT_SOURCE_2", "EXT_SOURCE_3"]]
    df["EXT_SOURCE_MEAN"] = ext.mean(axis=1)
    df["EXT_SOURCE_MIN"] = ext.min(axis=1)
    df["EXT_SOURCE_MAX"] = ext.max(axis=1)
    df["EXT_SOURCE_PROD"] = (
        df["EXT_SOURCE_1"] * df["EXT_SOURCE_2"] * df["EXT_SOURCE_3"]
    )

    df["AGE_YEARS"] = df["DAYS_BIRTH"].abs() / 365.25
    df["DISPOSABLE_INCOME"] = df["AMT_INCOME_TOTAL"] - df["AMT_ANNUITY"]

    df = df.replace([np.inf, -np.inf], np.nan)
    return df
