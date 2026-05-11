import { z } from "zod";

// Valores que el formulario recoge del gestor (en unidades humanas)
export const formSchema = z.object({
  // Personales
  age_years: z.coerce.number({ required_error: "Obligatorio", invalid_type_error: "Introduce un número" })
    .min(18, "Edad mínima 18 años").max(100, "Edad máxima 100 años"),
  CODE_GENDER: z.enum(["M", "F"], { required_error: "Selecciona género" }),
  CNT_CHILDREN: z.coerce.number().int().min(0).default(0),
  CNT_FAM_MEMBERS: z.coerce.number().min(1).default(2),
  NAME_EDUCATION_TYPE: z.string().min(1, "Selecciona nivel educativo"),
  NAME_FAMILY_STATUS: z.string().min(1, "Selecciona estado civil"),
  FLAG_OWN_CAR: z.enum(["Y", "N"]).default("N"),
  FLAG_OWN_REALTY: z.enum(["Y", "N"]).default("Y"),

  // Laborales
  AMT_INCOME_TOTAL: z.coerce.number({ required_error: "Obligatorio" })
    .positive("Debe ser mayor que 0"),
  employment_years: z.coerce.number().min(0).default(0),
  NAME_INCOME_TYPE: z.string().min(1, "Selecciona tipo de ingreso"),
  OCCUPATION_TYPE: z.string().default("Unknown"),
  ORGANIZATION_TYPE: z.string().default("Business Entity Type 3"),
  REG_CITY_NOT_WORK_CITY: z.coerce.number().min(0).max(1).default(0),

  // Financieros
  AMT_CREDIT: z.coerce.number({ required_error: "Obligatorio" })
    .positive("Debe ser mayor que 0"),
  AMT_ANNUITY: z.coerce.number({ required_error: "Obligatorio" })
    .positive("Debe ser mayor que 0"),
  AMT_GOODS_PRICE: z.coerce.number({ required_error: "Obligatorio" })
    .positive("Debe ser mayor que 0"),
  NAME_CONTRACT_TYPE: z.enum(["Cash loans", "Revolving loans"]).default("Cash loans"),
  NAME_HOUSING_TYPE: z.string().default("House / apartment"),

  // Scores externos
  EXT_SOURCE_1: z.coerce.number().min(0).max(1).default(0.5),
  EXT_SOURCE_2: z.coerce.number().min(0).max(1).default(0.5),
  EXT_SOURCE_3: z.coerce.number().min(0).max(1).default(0.5),

  // Flags (con defaults)
  FLAG_DOCUMENT_3: z.coerce.number().min(0).max(1).default(0),
});

export type FormValues = z.infer<typeof formSchema>;
