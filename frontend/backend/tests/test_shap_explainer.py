import pandas as pd
import pytest

from app.inference.shap_explainer import ShapResult, explain


def _zero_df(bundle) -> pd.DataFrame:
    return pd.DataFrame([[0.0] * 24], columns=bundle.selected_features)


def _sample_df(bundle) -> pd.DataFrame:
    """DataFrame con valores más realistas (escalados por el scaler)."""
    row = {f: 0.0 for f in bundle.selected_features}
    return pd.DataFrame([row])


def test_explain_returns_24_shap_values(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    assert isinstance(result, ShapResult)
    assert len(result.shap_values) == 24


def test_explain_base_value_is_finite_float(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    assert isinstance(result.base_value, float)
    import math
    assert math.isfinite(result.base_value)


def test_explain_top_drivers_count(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    assert 1 <= len(result.top_drivers) <= 5


def test_explain_top_drivers_sorted_by_abs_shap(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    abs_vals = [abs(d["shap_value"]) for d in result.top_drivers]
    assert abs_vals == sorted(abs_vals, reverse=True)


def test_explain_impact_field_consistent(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    for contrib in result.shap_values:
        sv = contrib["shap_value"]
        expected_impact = "negative" if sv > 0 else "positive"
        assert contrib["impact"] == expected_impact, (
            f"Feature {contrib['feature']}: shap={sv:.4f} pero impact={contrib['impact']}"
        )


def test_explain_all_features_have_label(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    for contrib in result.shap_values:
        assert contrib["label"], f"Sin etiqueta para feature: {contrib['feature']}"


def test_explain_patrones_detectados_is_list_of_strings(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    assert isinstance(result.patrones_detectados, list)
    assert all(isinstance(p, str) for p in result.patrones_detectados)


def test_explain_feature_order_matches_selected_features(client):
    bundle = client.app.state.bundle
    result = explain(_zero_df(bundle), bundle)
    returned_features = [c["feature"] for c in result.shap_values]
    assert returned_features == bundle.selected_features


def test_predict_endpoint_shap_populated(client):
    """El endpoint /predict devuelve SHAP values completos (no placeholders)."""
    from tests.test_predict_router import SAMPLE_PAYLOAD
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    assert r.status_code == 200
    body = r.json()
    assert len(body["shap_values"]) == 24
    assert len(body["top_drivers"]) == 5
    assert isinstance(body["shap_base_value"], float)
    assert body["shap_base_value"] != 0.0  # ya no es el placeholder


def test_predict_endpoint_top_drivers_have_all_fields(client):
    from tests.test_predict_router import SAMPLE_PAYLOAD
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    for driver in r.json()["top_drivers"]:
        assert "feature" in driver
        assert "label" in driver
        assert "value" in driver
        assert "shap_value" in driver
        assert driver["impact"] in ("positive", "negative")


def test_predict_endpoint_patrones_not_empty(client):
    from tests.test_predict_router import SAMPLE_PAYLOAD
    r = client.post("/api/v1/predict", json=SAMPLE_PAYLOAD)
    assert len(r.json()["patrones_detectados"]) >= 1
