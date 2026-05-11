FROM python:3.10-slim

# Evitar .pyc y logs de buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias de sistema necesarias para LightGBM y SHAP
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python primero (capa cacheada si no cambia requirements)
COPY requirements_prod.txt .
RUN pip install --no-cache-dir -r requirements_prod.txt

# Copiar código de la aplicación
COPY app/ ./app/

# El directorio de artefactos se monta como volumen en runtime;
# APP_ARTIFACTS_DIR se pasa por variable de entorno desde docker-compose.
EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "1"]
