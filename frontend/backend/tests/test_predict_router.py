SAMPLE_PAYLOAD = {
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


def test_predict_returns_valid_veredicto(client):
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    assert r.status_code == 200
    body = r.json()
    assert body["veredicto"] in ("APROBADO", "DENEGADO")


def test_predict_probabilidad_in_range(client):
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    body = r.json()
    assert 0.0 <= body["probabilidad_default"] <= 1.0


def test_predict_confianza_consistent_with_veredicto(client):
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    body = r.json()
    proba = body["probabilidad_default"]
    veredicto = body["veredicto"]
    confianza = body["confianza"]
    if veredicto == "APROBADO":
        assert confianza == pytest.approx(1.0 - proba, rel=1e-5)
    else:
        assert confianza == pytest.approx(proba, rel=1e-5)


def test_predict_umbral_default(client):
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    assert r.json()["umbral_usado"] == 0.5


def test_predict_missing_required_field_returns_422(client):
    payload = {k: v for k, v in SAMPLE_PAYLOAD.items() if k != "AMT_CREDIT"}
    r = client.post("/api/v1/predict", json=payload)
    assert r.status_code == 422


def test_predict_invalid_gender_returns_422(client):
    payload = {**SAMPLE_PAYLOAD, "CODE_GENDER": "X"}
    r = client.post("/api/v1/predict", json=payload)
    assert r.status_code == 422


def test_predict_unemployed_days_employed(client):
    payload = {**SAMPLE_PAYLOAD, "DAYS_EMPLOYED": 365243}
    r = client.post("/api/v1/predict", json=payload)
    assert r.status_code == 200
    assert r.json()["veredicto"] in ("APROBADO", "DENEGADO")


def test_predict_default_values_produce_valid_result(client):
    # Solo los campos obligatorios; el resto toma defaults de ClientFeatures
    minimal = {
        "AMT_INCOME_TOTAL": 80_000.0,
        "AMT_CREDIT": 160_000.0,
        "AMT_ANNUITY": 12_000.0,
        "AMT_GOODS_PRICE": 140_000.0,
        "DAYS_BIRTH": -10_000,
        "DAYS_EMPLOYED": -1_500,
    }
    r = client.post("/api/v1/predict", json=minimal)
    assert r.status_code == 200
    assert r.json()["veredicto"] in ("APROBADO", "DENEGADO")


import pytest
