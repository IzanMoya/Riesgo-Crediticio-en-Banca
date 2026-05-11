import pandas as pd

from app.pipeline.preprocess import preprocess_for_inference

# Payload completo representativo (mismo que usa test_predict_router)
SAMPLE_ROW = {
    "AMT_INCOME_TOTAL": 150_000.0,
    "AMT_CREDIT": 300_000.0,
    "AMT_ANNUITY": 25_000.0,
    "AMT_GOODS_PRICE": 270_000.0,
    "DAYS_BIRTH": -12_000,
    "DAYS_EMPLOYED": -2_000,
    "DAYS_REGISTRATION": -5_000.0,
    "DAYS_ID_PUBLISH": -3_000,
    "DAYS_LAST_PHONE_CHANGE": -500.0,
    "CNT_CHILDREN": 0,
    "CNT_FAM_MEMBERS": 2.0,
    "OWN_CAR_AGE": 5.0,
    "REGION_POPULATION_RELATIVE": 0.02,
    "REGION_RATING_CLIENT": 2,
    "REGION_RATING_CLIENT_W_CITY": 2,
    "HOUR_APPR_PROCESS_START": 12,
    "EXT_SOURCE_1": 0.5,
    "EXT_SOURCE_2": 0.5,
    "EXT_SOURCE_3": 0.5,
    "CODE_GENDER": "M",
    "FLAG_OWN_CAR": "Y",
    "FLAG_OWN_REALTY": "Y",
    "NAME_CONTRACT_TYPE": "Cash loans",
    "NAME_INCOME_TYPE": "Working",
    "NAME_EDUCATION_TYPE": "Higher education",
    "NAME_FAMILY_STATUS": "Married",
    "NAME_HOUSING_TYPE": "House / apartment",
    "OCCUPATION_TYPE": "Laborers",
    "ORGANIZATION_TYPE": "Business Entity Type 3",
    "WEEKDAY_APPR_PROCESS_START": "MONDAY",
    "NAME_TYPE_SUITE": "Unaccompanied",
    "FLAG_MOBIL": 1,
    "FLAG_EMP_PHONE": 1,
    "FLAG_WORK_PHONE": 0,
    "FLAG_CONT_MOBILE": 1,
    "FLAG_PHONE": 1,
    "FLAG_EMAIL": 0,
    "REG_REGION_NOT_LIVE_REGION": 0,
    "REG_REGION_NOT_WORK_REGION": 0,
    "LIVE_REGION_NOT_WORK_REGION": 0,
    "REG_CITY_NOT_LIVE_CITY": 0,
    "REG_CITY_NOT_WORK_CITY": 0,
    "LIVE_CITY_NOT_WORK_CITY": 0,
    "FLAG_DOCUMENT_3": 1,
    "OBS_30_CNT_SOCIAL_CIRCLE": 0.0,
    "DEF_30_CNT_SOCIAL_CIRCLE": 0.0,
    "OBS_60_CNT_SOCIAL_CIRCLE": 0.0,
    "DEF_60_CNT_SOCIAL_CIRCLE": 0.0,
    "AMT_REQ_CREDIT_BUREAU_HOUR": 0.0,
    "AMT_REQ_CREDIT_BUREAU_DAY": 0.0,
    "AMT_REQ_CREDIT_BUREAU_WEEK": 0.0,
    "AMT_REQ_CREDIT_BUREAU_MON": 0.0,
    "AMT_REQ_CREDIT_BUREAU_QRT": 0.0,
    "AMT_REQ_CREDIT_BUREAU_YEAR": 1.0,
}


def test_full_pipeline_returns_24_features(client):
    bundle = client.app.state.bundle
    raw = pd.DataFrame([SAMPLE_ROW])
    out = preprocess_for_inference(raw, bundle)
    assert out.shape == (1, 24), f"Shape esperado (1, 24), obtenido {out.shape}"
    assert list(out.columns) == bundle.selected_features


def test_full_pipeline_no_nan_in_output(client):
    bundle = client.app.state.bundle
    raw = pd.DataFrame([SAMPLE_ROW])
    out = preprocess_for_inference(raw, bundle)
    assert not out.isna().any().any(), "El output no debe tener NaN tras imputer"


def test_full_pipeline_batch_two_rows(client):
    bundle = client.app.state.bundle
    raw = pd.DataFrame([SAMPLE_ROW, SAMPLE_ROW])
    out = preprocess_for_inference(raw, bundle)
    assert out.shape == (2, 24)


def test_full_pipeline_unemployed_days_employed(client):
    bundle = client.app.state.bundle
    row = {**SAMPLE_ROW, "DAYS_EMPLOYED": 365243}
    raw = pd.DataFrame([row])
    out = preprocess_for_inference(raw, bundle)
    # No debe lanzar excepción; imputer rellena DAYS_EMPLOYED NaN
    assert out.shape == (1, 24)
    assert not out.isna().any().any()
