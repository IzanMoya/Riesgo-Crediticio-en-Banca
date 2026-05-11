from dataclasses import dataclass
from pathlib import Path
from typing import Any
import joblib
import json


@dataclass
class ArtifactBundle:
    model: Any
    scaler: Any
    imputer: Any
    median_values: dict
    label_encoder_mappings: dict
    categorical_columns_categories: dict
    feature_columns_pre_selection: list[str]
    selected_features: list[str]
    dropped_isnan_flags: list[str]
    metadata: dict

    @classmethod
    def load(cls, root: Path) -> "ArtifactBundle":
        def _load(name: str) -> Any:
            path = root / name
            if not path.exists():
                raise FileNotFoundError(
                    f"Artefacto no encontrado: {path}\n"
                    "Ejecuta el notebook en Colab y descarga artifacts.zip primero."
                )
            return joblib.load(path)

        meta_path = root / "metadata.json"
        if not meta_path.exists():
            raise FileNotFoundError(f"metadata.json no encontrado en {root}")

        return cls(
            model=_load("model_lgbm_final.pkl"),
            scaler=_load("scaler.pkl"),
            imputer=_load("imputer.pkl"),
            median_values=_load("median_values.pkl"),
            label_encoder_mappings=_load("label_encoder_mappings.pkl"),
            categorical_columns_categories=_load("categorical_columns_categories.pkl"),
            feature_columns_pre_selection=_load("feature_columns_pre_selection.pkl"),
            selected_features=_load("selected_features.pkl"),
            dropped_isnan_flags=_load("dropped_isnan_flags.pkl"),
            metadata=json.loads(meta_path.read_text(encoding="utf-8")),
        )
