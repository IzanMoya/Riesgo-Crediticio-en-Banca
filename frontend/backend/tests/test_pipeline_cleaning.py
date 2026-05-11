import pandas as pd
import pytest

from app.pipeline.cleaning import apply_initial_cleaning


def test_drops_mode_columns():
    df = pd.DataFrame({"A_MODE": [1], "B_MEDI": [2], "KEEP": [3]})
    out = apply_initial_cleaning(df)
    assert "A_MODE" not in out.columns
    assert "B_MEDI" not in out.columns
    assert "KEEP" in out.columns


def test_fills_own_car_age_with_zero():
    df = pd.DataFrame({"OWN_CAR_AGE": [None, 5.0], "OTHER": [1, 2]})
    out = apply_initial_cleaning(df)
    assert out["OWN_CAR_AGE"].iloc[0] == 0.0
    assert out["OWN_CAR_AGE"].iloc[1] == 5.0


def test_fills_occupation_type_with_unknown():
    df = pd.DataFrame({"OCCUPATION_TYPE": [None, "Laborers"], "OTHER": [1, 2]})
    out = apply_initial_cleaning(df)
    assert out["OCCUPATION_TYPE"].iloc[0] == "Unknown"
    assert out["OCCUPATION_TYPE"].iloc[1] == "Laborers"


def test_fills_other_object_columns_with_unknown():
    df = pd.DataFrame({"NAME_TYPE_SUITE": [None, "Unaccompanied"], "NUM": [1.0, 2.0]})
    out = apply_initial_cleaning(df)
    assert out["NAME_TYPE_SUITE"].iloc[0] == "Unknown"


def test_removes_xna_gender_rows():
    df = pd.DataFrame({"CODE_GENDER": ["M", "XNA", "F"], "V": [1, 2, 3]})
    out = apply_initial_cleaning(df)
    assert len(out) == 2
    assert "XNA" not in out["CODE_GENDER"].values


def test_no_mode_medi_columns_is_noop():
    df = pd.DataFrame({"A": [1], "B": [2.0]})
    out = apply_initial_cleaning(df)
    assert list(out.columns) == ["A", "B"]
