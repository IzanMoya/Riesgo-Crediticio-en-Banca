import type { ClientFeatures } from "../types/input";
import type { BatchResponse, PredictionResponse } from "../types/prediction";
import { api } from "./client";

export const postPredict = (features: ClientFeatures): Promise<PredictionResponse> =>
  api.post<PredictionResponse>("/predict", features).then((r) => r.data);

export const postPredictBatch = (file: File): Promise<BatchResponse> => {
  const fd = new FormData();
  fd.append("file", file);
  return api
    .post<BatchResponse>("/predict/batch", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
