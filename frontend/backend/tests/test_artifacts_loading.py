from pathlib import Path

import pytest

from app.artifacts import ArtifactBundle

ARTIFACTS_DIR = Path("D:/Proyectos/tfm_riesgoCrediticio/artifacts")


def test_artifact_bundle_loads_all_files():
    bundle = ArtifactBundle.load(ARTIFACTS_DIR)

    assert bundle.model is not None
    assert bundle.scaler is not None
    assert bundle.imputer is not None
    assert isinstance(bundle.median_values, dict)
    assert isinstance(bundle.label_encoder_mappings, dict)
    assert isinstance(bundle.categorical_columns_categories, dict)
    assert isinstance(bundle.feature_columns_pre_selection, list)
    assert len(bundle.feature_columns_pre_selection) > 0
    assert isinstance(bundle.selected_features, list)
    # El modelo exportado tiene 24 features seleccionadas (verificado en Fase 0)
    assert len(bundle.selected_features) == 24
    assert isinstance(bundle.dropped_isnan_flags, list)
    assert bundle.metadata["auc_val"] == 0.7563


def test_label_encoder_mappings_has_expected_keys():
    bundle = ArtifactBundle.load(ARTIFACTS_DIR)
    expected = {"CODE_GENDER", "FLAG_OWN_CAR", "FLAG_OWN_REALTY", "NAME_CONTRACT_TYPE"}
    assert expected == set(bundle.label_encoder_mappings.keys())


def test_categorical_columns_categories_has_expected_columns():
    bundle = ArtifactBundle.load(ARTIFACTS_DIR)
    expected_cols = {
        "NAME_TYPE_SUITE",
        "NAME_INCOME_TYPE",
        "NAME_EDUCATION_TYPE",
        "NAME_FAMILY_STATUS",
        "NAME_HOUSING_TYPE",
        "OCCUPATION_TYPE",
        "WEEKDAY_APPR_PROCESS_START",
        "ORGANIZATION_TYPE",
    }
    assert expected_cols == set(bundle.categorical_columns_categories.keys())


def test_health_endpoint_returns_metadata(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["n_features_post_selection"] == 24
    assert body["metadata"]["auc_val"] == 0.7563
    assert len(body["selected_features"]) == 24


def test_health_endpoint_selected_features_are_strings(client):
    r = client.get("/api/v1/health")
    features = r.json()["selected_features"]
    assert all(isinstance(f, str) for f in features)
