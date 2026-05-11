from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ClientFeatures(BaseModel):
    # extra='allow' acepta columnas adicionales de CSV completo de Home Credit
    model_config = ConfigDict(extra="allow")

    # ── Numéricas obligatorias (sin default: el formulario siempre las pide) ──
    AMT_INCOME_TOTAL: float = Field(..., gt=0, description="Ingresos anuales (€)")
    AMT_CREDIT: float = Field(..., gt=0, description="Importe del crédito solicitado (€)")
    AMT_ANNUITY: float = Field(..., gt=0, description="Cuota anual (€)")
    AMT_GOODS_PRICE: float = Field(..., gt=0, description="Precio del bien financiado (€)")
    DAYS_BIRTH: int = Field(..., lt=0, description="Días desde nacimiento (negativo)")
    DAYS_EMPLOYED: int = Field(
        ..., description="Días empleado (negativo); 365243 si desempleado"
    )

    # ── Numéricas con default razonable ────────────────────────────────────────
    DAYS_REGISTRATION: float = Field(default=-5000.0)
    DAYS_ID_PUBLISH: int = Field(default=-3000)
    DAYS_LAST_PHONE_CHANGE: float = Field(default=-1000.0)
    CNT_CHILDREN: int = Field(default=0, ge=0)
    CNT_FAM_MEMBERS: float = Field(default=2.0, gt=0)
    OWN_CAR_AGE: float = Field(default=0.0, ge=0)
    REGION_POPULATION_RELATIVE: float = Field(default=0.02, ge=0, le=1)
    REGION_RATING_CLIENT: int = Field(default=2, ge=1, le=3)
    REGION_RATING_CLIENT_W_CITY: int = Field(default=2, ge=1, le=3)
    HOUR_APPR_PROCESS_START: int = Field(default=12, ge=0, le=23)
    EXT_SOURCE_1: float = Field(default=0.5, ge=0, le=1)
    EXT_SOURCE_2: float = Field(default=0.5, ge=0, le=1)
    EXT_SOURCE_3: float = Field(default=0.5, ge=0, le=1)

    # ── Categóricas ───────────────────────────────────────────────────────────
    CODE_GENDER: Literal["M", "F"] = "M"
    FLAG_OWN_CAR: Literal["Y", "N"] = "N"
    FLAG_OWN_REALTY: Literal["Y", "N"] = "Y"
    NAME_CONTRACT_TYPE: Literal["Cash loans", "Revolving loans"] = "Cash loans"
    NAME_INCOME_TYPE: str = "Working"
    NAME_EDUCATION_TYPE: str = "Secondary / secondary special"
    NAME_FAMILY_STATUS: str = "Married"
    NAME_HOUSING_TYPE: str = "House / apartment"
    OCCUPATION_TYPE: str = "Unknown"
    ORGANIZATION_TYPE: str = "Business Entity Type 3"
    WEEKDAY_APPR_PROCESS_START: str = "MONDAY"
    NAME_TYPE_SUITE: str = "Unaccompanied"

    # ── Flags binarias (0/1) ──────────────────────────────────────────────────
    FLAG_MOBIL: int = Field(default=1, ge=0, le=1)
    FLAG_EMP_PHONE: int = Field(default=1, ge=0, le=1)
    FLAG_WORK_PHONE: int = Field(default=0, ge=0, le=1)
    FLAG_CONT_MOBILE: int = Field(default=1, ge=0, le=1)
    FLAG_PHONE: int = Field(default=1, ge=0, le=1)
    FLAG_EMAIL: int = Field(default=0, ge=0, le=1)
    REG_REGION_NOT_LIVE_REGION: int = Field(default=0, ge=0, le=1)
    REG_REGION_NOT_WORK_REGION: int = Field(default=0, ge=0, le=1)
    LIVE_REGION_NOT_WORK_REGION: int = Field(default=0, ge=0, le=1)
    REG_CITY_NOT_LIVE_CITY: int = Field(default=0, ge=0, le=1)
    REG_CITY_NOT_WORK_CITY: int = Field(default=0, ge=0, le=1)
    LIVE_CITY_NOT_WORK_CITY: int = Field(default=0, ge=0, le=1)

    # FLAG_DOCUMENT_3 aparece entre las 24 features seleccionadas; resto via extra='allow'
    FLAG_DOCUMENT_3: int = Field(default=0, ge=0, le=1)

    # ── Contadores sociales y bureau ──────────────────────────────────────────
    OBS_30_CNT_SOCIAL_CIRCLE: float = Field(default=0.0, ge=0)
    DEF_30_CNT_SOCIAL_CIRCLE: float = Field(default=0.0, ge=0)
    OBS_60_CNT_SOCIAL_CIRCLE: float = Field(default=0.0, ge=0)
    DEF_60_CNT_SOCIAL_CIRCLE: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_HOUR: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_DAY: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_WEEK: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_MON: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_QRT: float = Field(default=0.0, ge=0)
    AMT_REQ_CREDIT_BUREAU_YEAR: float = Field(default=1.0, ge=0)
