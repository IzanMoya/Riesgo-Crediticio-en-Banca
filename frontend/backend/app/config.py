from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    artifacts_dir: Path = Path("D:/Proyectos/tfm_riesgoCrediticio/artifacts")
    threshold: float = 0.5
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = {"env_prefix": "APP_"}


settings = Settings()
