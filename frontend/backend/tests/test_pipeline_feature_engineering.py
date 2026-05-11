import numpy as np
import pandas as pd
import pytest

from app.pipeline.feature_engineering import add_engineered_features

BASE_ROW = {
    "AMT_INCOME_TOTAL": 100_000.0,
    "AMT_CREDIT": 200_000.0,
    "AMT_ANNUITY": 10_000.0,
    "AMT_GOODS_PRICE": 180_000.0,
    "DAYS_BIRTH": -12_000,
    "DAYS_EMPLOYED": -3_000,
    "CNT_FAM_MEMBERS": 2.0,
    "EXT_SOURCE_1": 0.5,
    "EXT_SOURCE_2": 0.4,
    "EXT_SOURCE_3": 0.6,
}


def make_df(**overrides):
    row = {**BASE_ROW, **overrides}
    return pd.DataFrame([row])


def test_payment_rate():
    out = add_engineered_features(make_df())
    assert out["PAYMENT_RATE"].iloc[0] == pytest.approx(0.1)


def test_credit_to_income():
    out = add_engineered_features(make_df())
    assert out["CREDIT_TO_INCOME"].iloc[0] == pytest.approx(2.0)


def test_credit_term():
    out = add_engineered_features(make_df())
    assert out["CREDIT_TERM"].iloc[0] == pytest.approx(20.0)


def test_credit_goods_diff():
    out = add_engineered_features(make_df())
    assert out["CREDIT_GOODS_DIFF"].iloc[0] == pytest.approx(20_000.0)


def test_credit_goods_ratio():
    out = add_engineered_features(make_df())
    assert out["CREDIT_GOODS_RATIO"].iloc[0] == pytest.approx(200_000 / 180_000)


def test_ext_source_aggregates():
    out = add_engineered_features(make_df())
    assert out["EXT_SOURCE_MEAN"].iloc[0] == pytest.approx(0.5)
    assert out["EXT_SOURCE_MIN"].iloc[0] == pytest.approx(0.4)
    assert out["EXT_SOURCE_MAX"].iloc[0] == pytest.approx(0.6)
    assert out["EXT_SOURCE_PROD"].iloc[0] == pytest.approx(0.5 * 0.4 * 0.6)


def test_age_years():
    out = add_engineered_features(make_df())
    assert out["AGE_YEARS"].iloc[0] == pytest.approx(12_000 / 365.25, rel=1e-4)


def test_disposable_income():
    out = add_engineered_features(make_df())
    assert out["DISPOSABLE_INCOME"].iloc[0] == pytest.approx(90_000.0)


def test_days_employed_365243_becomes_nan():
    out = add_engineered_features(make_df(DAYS_EMPLOYED=365243))
    assert pd.isna(out["DAYS_EMPLOYED"].iloc[0])


def test_days_employed_perc_with_unemployed():
    # DAYS_EMPLOYED=365243 → NaN → DAYS_EMPLOYED_PERC = NaN
    out = add_engineered_features(make_df(DAYS_EMPLOYED=365243))
    assert pd.isna(out["DAYS_EMPLOYED_PERC"].iloc[0])


def test_no_inf_in_output():
    out = add_engineered_features(make_df(AMT_GOODS_PRICE=0, CNT_FAM_MEMBERS=0))
    assert not np.isinf(out.select_dtypes("number").values).any()
