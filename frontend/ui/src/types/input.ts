export interface ClientFeatures {
  // Obligatorios
  AMT_INCOME_TOTAL: number;
  AMT_CREDIT: number;
  AMT_ANNUITY: number;
  AMT_GOODS_PRICE: number;
  DAYS_BIRTH: number;       // negativo
  DAYS_EMPLOYED: number;    // negativo o 365243

  // Con default
  DAYS_REGISTRATION: number;
  DAYS_ID_PUBLISH: number;
  DAYS_LAST_PHONE_CHANGE: number;
  CNT_CHILDREN: number;
  CNT_FAM_MEMBERS: number;
  OWN_CAR_AGE: number;
  REGION_POPULATION_RELATIVE: number;
  REGION_RATING_CLIENT: number;
  REGION_RATING_CLIENT_W_CITY: number;
  HOUR_APPR_PROCESS_START: number;
  EXT_SOURCE_1: number;
  EXT_SOURCE_2: number;
  EXT_SOURCE_3: number;

  CODE_GENDER: "M" | "F";
  FLAG_OWN_CAR: "Y" | "N";
  FLAG_OWN_REALTY: "Y" | "N";
  NAME_CONTRACT_TYPE: "Cash loans" | "Revolving loans";
  NAME_INCOME_TYPE: string;
  NAME_EDUCATION_TYPE: string;
  NAME_FAMILY_STATUS: string;
  NAME_HOUSING_TYPE: string;
  OCCUPATION_TYPE: string;
  ORGANIZATION_TYPE: string;
  WEEKDAY_APPR_PROCESS_START: string;
  NAME_TYPE_SUITE: string;

  FLAG_MOBIL: number;
  FLAG_EMP_PHONE: number;
  FLAG_WORK_PHONE: number;
  FLAG_CONT_MOBILE: number;
  FLAG_PHONE: number;
  FLAG_EMAIL: number;
  REG_REGION_NOT_LIVE_REGION: number;
  REG_REGION_NOT_WORK_REGION: number;
  LIVE_REGION_NOT_WORK_REGION: number;
  REG_CITY_NOT_LIVE_CITY: number;
  REG_CITY_NOT_WORK_CITY: number;
  LIVE_CITY_NOT_WORK_CITY: number;
  FLAG_DOCUMENT_3: number;

  OBS_30_CNT_SOCIAL_CIRCLE: number;
  DEF_30_CNT_SOCIAL_CIRCLE: number;
  OBS_60_CNT_SOCIAL_CIRCLE: number;
  DEF_60_CNT_SOCIAL_CIRCLE: number;
  AMT_REQ_CREDIT_BUREAU_HOUR: number;
  AMT_REQ_CREDIT_BUREAU_DAY: number;
  AMT_REQ_CREDIT_BUREAU_WEEK: number;
  AMT_REQ_CREDIT_BUREAU_MON: number;
  AMT_REQ_CREDIT_BUREAU_QRT: number;
  AMT_REQ_CREDIT_BUREAU_YEAR: number;
}
