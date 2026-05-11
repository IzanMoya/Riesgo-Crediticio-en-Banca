import pandas as pd
import pytest

from app.pipeline.encoding import apply_label_encoding, apply_onehot_with_reindex


LABEL_MAPPINGS = {
    "CODE_GENDER": {"F": 0, "M": 1},
    "FLAG_OWN_CAR": {"N": 0, "Y": 1},
    "FLAG_OWN_REALTY": {"N": 0, "Y": 1},
    "NAME_CONTRACT_TYPE": {"Cash loans": 0, "Revolving loans": 1},
}


def test_label_encoding_maps_known_values():
    df = pd.DataFrame({"CODE_GENDER": ["M", "F"], "FLAG_OWN_CAR": ["Y", "N"]})
    out = apply_label_encoding(df, LABEL_MAPPINGS)
    assert out["CODE_GENDER"].tolist() == [1, 0]
    assert out["FLAG_OWN_CAR"].tolist() == [1, 0]


def test_label_encoding_unknown_value_becomes_nan():
    df = pd.DataFrame({"CODE_GENDER": ["X"]})
    out = apply_label_encoding(df, LABEL_MAPPINGS)
    assert pd.isna(out["CODE_GENDER"].iloc[0])


def test_label_encoding_skips_absent_columns():
    df = pd.DataFrame({"OTHER": [1, 2]})
    out = apply_label_encoding(df, LABEL_MAPPINGS)
    assert list(out.columns) == ["OTHER"]


def test_onehot_includes_all_train_categories():
    df = pd.DataFrame({"NAME_FAMILY_STATUS": ["Married"]})
    cats = {"NAME_FAMILY_STATUS": ["Civil marriage", "Married", "Single / not married"]}
    out = apply_onehot_with_reindex(df, cats)
    assert "NAME_FAMILY_STATUS_Married" in out.columns
    assert "NAME_FAMILY_STATUS_Civil marriage" in out.columns
    assert out["NAME_FAMILY_STATUS_Married"].iloc[0] == 1
    assert out["NAME_FAMILY_STATUS_Civil marriage"].iloc[0] == 0


def test_onehot_unseen_value_produces_all_zeros():
    df = pd.DataFrame({"NAME_FAMILY_STATUS": ["UNKNOWN_VALUE"]})
    cats = {"NAME_FAMILY_STATUS": ["Civil marriage", "Married"]}
    out = apply_onehot_with_reindex(df, cats)
    assert out["NAME_FAMILY_STATUS_Married"].iloc[0] == 0
    assert out["NAME_FAMILY_STATUS_Civil marriage"].iloc[0] == 0


def test_onehot_skips_absent_column():
    df = pd.DataFrame({"OTHER": [1]})
    cats = {"NAME_FAMILY_STATUS": ["Married"]}
    out = apply_onehot_with_reindex(df, cats)
    assert "OTHER" in out.columns
    assert "NAME_FAMILY_STATUS_Married" not in out.columns
