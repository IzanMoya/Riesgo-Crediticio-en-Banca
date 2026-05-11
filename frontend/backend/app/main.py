from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .artifacts import ArtifactBundle
from .config import settings
from .routers import health, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.bundle = ArtifactBundle.load(settings.artifacts_dir)
    yield


app = FastAPI(
    title="API Riesgo Crediticio",
    description="Backend de predicción de riesgo crediticio con LightGBM + SHAP",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(predict.router, prefix="/api/v1")
