import io

import pandas as pd
from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from ..config import settings
from ..inference.predictor import predict
from ..inference.shap_explainer import explain
from ..pipeline.preprocess import preprocess_for_inference
from ..schemas.input import ClientFeatures
from ..schemas.output import (
    BatchResponse,
    BatchRowResult,
    FeatureContribution,
    PredictionResponse,
)

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict_endpoint(features: ClientFeatures, request: Request):
    bundle = request.app.state.bundle

    raw_df = pd.DataFrame([features.model_dump()])
    processed = preprocess_for_inference(raw_df, bundle)
    veredicto, proba, confianza = predict(processed, bundle, settings.threshold)
    shap_result = explain(processed, bundle)

    return PredictionResponse(
        veredicto=veredicto,
        probabilidad_default=proba,
        confianza=confianza,
        umbral_usado=settings.threshold,
        features_originales=features.model_dump(),
        top_drivers=[FeatureContribution(**d) for d in shap_result.top_drivers],
        shap_base_value=shap_result.base_value,
        shap_values=[FeatureContribution(**d) for d in shap_result.shap_values],
        patrones_detectados=shap_result.patrones_detectados,
    )


@router.post("/predict/batch", response_model=BatchResponse)
async def predict_batch_endpoint(
    file: UploadFile = File(...), request: Request = None
):
    bundle = request.app.state.bundle

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="El archivo debe ser CSV.")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV no válido: {exc}") from exc

    if len(df) == 0:
        raise HTTPException(status_code=400, detail="El CSV está vacío.")

    results: list[BatchRowResult] = []
    aprobados = denegados = errores = 0

    for idx, row in df.iterrows():
        row_num = int(idx) + 1
        try:
            row_dict = {k: v for k, v in row.items() if pd.notna(v)}
            features = ClientFeatures(**row_dict)
            raw_df = pd.DataFrame([features.model_dump()])
            processed = preprocess_for_inference(raw_df, bundle)
            veredicto, proba, confianza = predict(processed, bundle, settings.threshold)
            results.append(
                BatchRowResult(
                    row=row_num,
                    veredicto=veredicto,
                    probabilidad_default=round(proba, 6),
                    confianza=round(confianza, 6),
                )
            )
            if veredicto == "APROBADO":
                aprobados += 1
            else:
                denegados += 1
        except Exception as exc:
            results.append(BatchRowResult(row=row_num, error=str(exc)[:300]))
            errores += 1

    return BatchResponse(
        total=len(df),
        aprobados=aprobados,
        denegados=denegados,
        errores=errores,
        results=results,
    )
