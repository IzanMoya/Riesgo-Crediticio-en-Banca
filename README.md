# Scoring de Riesgo Crediticio con Machine Learning para la Banca

![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=flat&logo=python&logoColor=white)
![LightGBM](https://img.shields.io/badge/LightGBM-4.6-green?style=flat)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![SHAP](https://img.shields.io/badge/SHAP-XAI-orange?style=flat)

> **Demo académica** — No usar para decisiones crediticias reales.

---

## Descripción del Proyecto

Sistema completo de **scoring de riesgo crediticio** desarrollado como Trabajo de Fin de Máster (TFM)
del Máster en Big Data e Inteligencia Artificial.

Entrena un modelo LightGBM sobre el dataset público
[Home Credit Default Risk (Kaggle)](https://www.kaggle.com/c/home-credit-default-risk)
y expone las predicciones mediante una API REST (FastAPI) consumida por una interfaz React.
Cada predicción incluye valores SHAP por feature y explicación en lenguaje natural en español.

### Ficha técnica

| Campo                    | Valor                                      |
|--------------------------|--------------------------------------------|
| Dataset                  | Home Credit Default Risk (Kaggle)          |
| Registros de entrenamiento | ~307 000 solicitudes                     |
| Tasa de impago (clase 1) | ~8 %                                       |
| Algoritmo                | LightGBM (is_unbalance=True, sin SMOTE)    |
| Features tras selección  | 24                                         |
| AUC-ROC (validación)     | **0.756**                                  |
| Recall clase 1           | ~68 %                                      |
| Umbral de decisión       | 0.50                                       |
| Explicabilidad           | SHAP TreeExplainer                         |

---

## Arquitectura del Sistema

```
Navegador (React + TypeScript + Vite)
          │
          │  HTTP REST / JSON
          ▼
FastAPI + Uvicorn  ──  puerto 8000
          │
          ├─ Pipeline: cleaning → label encoding → OHE
          │            → feature engineering (12 vars)
          │            → ISNAN flags (51) → reindex 260 cols
          │            → SimpleImputer → StandardScaler
          │
          ├─ LightGBM → P(default)
          │
          └─ SHAP TreeExplainer → top_drivers + waterfall
          │
    artifacts/
    ├── model_lgbm_final.pkl
    ├── scaler.pkl
    ├── imputer.pkl
    └── ... (9 archivos + metadata.json)
```

---

## Características de la Aplicación

### Evaluación individual
- Formulario en 4 secciones acordeón con **tooltips explicativos** por campo
- Validación en tiempo real con Zod + react-hook-form
- Veredicto APROBADO / DENEGADO con diseño bancario profesional
- Medidor de probabilidad respecto al umbral
- Gráfico SHAP de barras (TOP 10 por magnitud)
- Gráfico SHAP waterfall (acumulación desde valor base)
- Explicación en lenguaje natural en español

### Evaluación por lotes (CSV)
- Drop zone drag & drop
- Plantilla CSV descargable
- Resultados tabulados con paginación (25 filas/página)
- Resumen estadístico: aprobadas, denegadas, errores, tasa de aprobación
- Exportar resultados a CSV

---

## Instalación y Puesta en Marcha

### Prerrequisitos
- Python 3.10+
- Node.js 22+
- Docker + Docker Compose *(solo si usas la Opción A)*
- Artefactos generados (ver sección **Artefactos** más abajo)

---

### Opción A — Docker (recomendado para el backend)

```bash
# 1. Clona el repositorio
git clone https://github.com/IzanMoya/Riesgo-Crediticio-en-Banca.git
cd Riesgo-Crediticio-en-Banca

# 2. Genera los artefactos (ver sección Artefactos)
#    Los archivos .pkl deben estar en artifacts/

# 3. Arranca el backend en Docker
docker compose up --build
#    → API disponible en http://localhost:8000

# 4. En otra terminal, arranca el frontend
cd frontend/ui
npm install
npm run dev
#    → UI disponible en http://localhost:5173
```

---

### Opción B — Manual (sin Docker)

```bash
# Backend
cd frontend/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Frontend (otra terminal)
cd frontend/ui
npm install
npm run dev
```

**Atajos para Windows** (desde la raíz del proyecto):
```
start_all.bat        # Doble clic — abre ambos servidores + navegador
.\start_backend.ps1  # Solo backend (PowerShell)
.\start_frontend.ps1 # Solo frontend (PowerShell)
```

---

### Verificar que funciona

| URL | Qué confirma |
|-----|-------------|
| `http://localhost:8000/api/v1/health` | Backend activo, 24 features cargadas |
| `http://localhost:8000/docs` | Swagger UI para probar endpoints |
| `http://localhost:5173` | Frontend activo |

---

## Estructura del Repositorio

```
tfm_riesgoCrediticio/
├── artifacts/                     ← ⚠️ NO incluido en Git (generar con el notebook)
│   ├── model_lgbm_final.pkl
│   ├── scaler.pkl
│   ├── imputer.pkl
│   ├── median_values.pkl
│   ├── label_encoder_mappings.pkl
│   ├── categorical_columns_categories.pkl
│   ├── feature_columns_pre_selection.pkl
│   ├── selected_features.pkl
│   ├── dropped_isnan_flags.pkl
│   └── metadata.json
├── frontend/
│   ├── backend/                   ← FastAPI + pipeline de inferencia
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── config.py
│   │   │   ├── artifacts.py
│   │   │   ├── pipeline/          ← cleaning, encoding, feature eng., preprocess
│   │   │   ├── inference/         ← predictor, shap_explainer
│   │   │   ├── nl/                ← patterns, translations
│   │   │   ├── routers/           ← health, predict (single + batch)
│   │   │   └── schemas/           ← input, output
│   │   ├── tests/                 ← 60 tests pytest
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── requirements_prod.txt
│   └── ui/                        ← React + TypeScript + Tailwind
│       └── src/
│           ├── api/               ← cliente Axios
│           ├── components/        ← Layout, ManualForm, results, ui
│           ├── lib/               ← schema Zod, formatters
│           ├── pages/             ← HomePage, ResultPage, BatchResultsPage
│           └── types/             ← input, prediction
├── docker-compose.yml
├── start_all.bat
├── start_backend.ps1
├── start_frontend.ps1
└── TFM_Scoring_de_Riesgo_Crediticio_con_ML_para_la_Banca.ipynb
```

---

## Metodología y Pipeline de ML

### Preprocesamiento
1. **Limpieza**: eliminación de columnas `_MODE`/`_MEDI`, imputación de categorías vacías con `"Unknown"`, tratamiento de `DAYS_EMPLOYED=365243` (desempleado) como NaN.
2. **Codificación**: Label Encoding para variables binarias (género, flags), One-Hot Encoding con reindexado a las categorías del entrenamiento.
3. **Feature Engineering**: 12 variables derivadas — `PAYMENT_RATE`, `CREDIT_TO_INCOME`, `CREDIT_TERM`, `DAYS_EMPLOYED_PERC`, `EXT_SOURCE_MEAN/MIN/MAX/PROD`, `AGE_YEARS`, etc.
4. **Flags ISNAN**: 51 indicadores binarios de valores faltantes originales.
5. **Reindexado**: columnas expandidas a 260 (espacio de features pre-selección), relleno con 0.
6. **Imputación + Escalado**: `SimpleImputer(strategy="median")` + `StandardScaler`.
7. **Selección**: 24 features finales por importancia SHAP.

### Modelo
- **LightGBM** con `is_unbalance=True` para compensar el desbalanceo de clases (~8% impagos).
- No se usó SMOTE para evitar contaminación entre train/test.
- Hiperparámetros optimizados con Optuna.

---

## Resultados del Modelo

| Métrica               | Valor   |
|-----------------------|---------|
| AUC-ROC (validación)  | **0.756** |
| Recall clase 1        | ~68%    |
| Precisión clase 1     | ~35%    |
| F1 clase 1            | ~46%    |
| Umbral óptimo         | 0.50    |

---

## Variables más Influyentes (SHAP)

| Variable            | Descripción de negocio                                    | Dirección  |
|---------------------|-----------------------------------------------------------|------------|
| `EXT_SOURCE_MEAN`   | Media de scores de burós de crédito externos (0–1)       | ↓ riesgo   |
| `CREDIT_TERM`       | Plazo del crédito (importe / cuota mensual)              | Variable   |
| `CREDIT_GOODS_DIFF` | Diferencia entre crédito solicitado y valor del bien     | ↑ riesgo   |
| `AGE_YEARS`         | Edad del solicitante en años                             | ↓ riesgo   |
| `DAYS_EMPLOYED_PERC`| Antigüedad laboral / edad (estabilidad)                  | ↓ riesgo   |

---

## Artefactos — Cómo Generarlos

Los archivos `.pkl` **no están incluidos en el repositorio** (son demasiado grandes y contienen
datos del TFM). Para generarlos:

1. Abre el notebook `TFM_Scoring_de_Riesgo_Crediticio_con_ML_para_la_Banca.ipynb` en Google Colab.
2. Sube los datos de Home Credit (CSV de Kaggle).
3. Ejecuta todas las celdas hasta la **Fase 0 — Exportar artefactos**.
4. Descarga el archivo `artifacts.zip` generado.
5. Extráelo en `D:\Proyectos\tfm_riesgoCrediticio\artifacts\` (o ajusta la ruta en `frontend/backend/app/config.py`).

### Verificación

```bash
cd frontend/backend
python scripts/verify_artifacts.py
# → Debe confirmar 9 artefactos + metadata.json y 24 features
```

---

## API REST

| Método | Endpoint                   | Descripción                                |
|--------|----------------------------|--------------------------------------------|
| GET    | `/api/v1/health`           | Estado del backend y metadatos del modelo  |
| POST   | `/api/v1/predict`          | Predicción individual (JSON)               |
| POST   | `/api/v1/predict/batch`    | Predicción por lotes (CSV multipart)       |

Documentación interactiva: `http://localhost:8000/docs`

---

## Limitaciones y Disclaimer

> ⚠️ **DEMO ACADÉMICA** — Este sistema ha sido desarrollado exclusivamente con fines
> educativos como TFM. **No debe usarse para tomar decisiones crediticias reales.**
>
> El modelo fue entrenado sobre datos históricos de un mercado específico (Europa del Este)
> y puede no ser representativo de otros mercados o poblaciones. Las métricas de rendimiento
> son orientativas y no garantizan resultados en producción.

---

## Autor

**Izan Moya Romero**  
TFM — Máster en Big Data e Inteligencia Artificial  
[GitHub: IzanMoya](https://github.com/IzanMoya)
