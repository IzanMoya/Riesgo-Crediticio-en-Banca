import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown, Loader2, AlertCircle,
  UserRound, Briefcase, Banknote, TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formSchema, type FormValues } from "../../lib/schema";
import { yearsToDaysBirth, yearsToEmployedDays } from "../../lib/formatters";
import { postPredict } from "../../api/predict";
import type { ClientFeatures } from "../../types/input";
import { SectionPersonalData } from "./SectionPersonalData";
import { SectionEmployment } from "./SectionEmployment";
import { SectionFinancials } from "./SectionFinancials";
import { SectionExternalScores } from "./SectionExternalScores";

interface Section {
  id: string;
  title: string;
  Icon: LucideIcon;
  Component: React.FC;
}

const SECTIONS: Section[] = [
  { id: "personal",    title: "Datos personales",           Icon: UserRound,  Component: SectionPersonalData },
  { id: "employment",  title: "Empleo e ingresos",           Icon: Briefcase,  Component: SectionEmployment },
  { id: "financial",   title: "Operación financiera",        Icon: Banknote,   Component: SectionFinancials },
  { id: "scores",      title: "Scores crediticios externos", Icon: TrendingUp, Component: SectionExternalScores },
];

function transformToBackend(data: FormValues): ClientFeatures {
  return {
    AMT_INCOME_TOTAL: data.AMT_INCOME_TOTAL,
    AMT_CREDIT: data.AMT_CREDIT,
    AMT_ANNUITY: data.AMT_ANNUITY,
    AMT_GOODS_PRICE: data.AMT_GOODS_PRICE,
    DAYS_BIRTH: yearsToDaysBirth(data.age_years),
    DAYS_EMPLOYED: yearsToEmployedDays(data.employment_years),
    DAYS_REGISTRATION: -5000,
    DAYS_ID_PUBLISH: -3000,
    DAYS_LAST_PHONE_CHANGE: -1000,
    CNT_CHILDREN: data.CNT_CHILDREN,
    CNT_FAM_MEMBERS: data.CNT_FAM_MEMBERS,
    OWN_CAR_AGE: 0,
    REGION_POPULATION_RELATIVE: 0.02,
    REGION_RATING_CLIENT: 2,
    REGION_RATING_CLIENT_W_CITY: 2,
    HOUR_APPR_PROCESS_START: 12,
    EXT_SOURCE_1: data.EXT_SOURCE_1,
    EXT_SOURCE_2: data.EXT_SOURCE_2,
    EXT_SOURCE_3: data.EXT_SOURCE_3,
    CODE_GENDER: data.CODE_GENDER,
    FLAG_OWN_CAR: data.FLAG_OWN_CAR,
    FLAG_OWN_REALTY: data.FLAG_OWN_REALTY,
    NAME_CONTRACT_TYPE: data.NAME_CONTRACT_TYPE,
    NAME_INCOME_TYPE: data.NAME_INCOME_TYPE,
    NAME_EDUCATION_TYPE: data.NAME_EDUCATION_TYPE,
    NAME_FAMILY_STATUS: data.NAME_FAMILY_STATUS,
    NAME_HOUSING_TYPE: data.NAME_HOUSING_TYPE,
    OCCUPATION_TYPE: data.OCCUPATION_TYPE,
    ORGANIZATION_TYPE: data.ORGANIZATION_TYPE,
    WEEKDAY_APPR_PROCESS_START: "MONDAY",
    NAME_TYPE_SUITE: "Unaccompanied",
    FLAG_MOBIL: 1, FLAG_EMP_PHONE: 1, FLAG_WORK_PHONE: 0,
    FLAG_CONT_MOBILE: 1, FLAG_PHONE: 1, FLAG_EMAIL: 0,
    REG_REGION_NOT_LIVE_REGION: 0, REG_REGION_NOT_WORK_REGION: 0,
    LIVE_REGION_NOT_WORK_REGION: 0, REG_CITY_NOT_LIVE_CITY: 0,
    REG_CITY_NOT_WORK_CITY: data.REG_CITY_NOT_WORK_CITY,
    LIVE_CITY_NOT_WORK_CITY: 0,
    FLAG_DOCUMENT_3: data.FLAG_DOCUMENT_3,
    OBS_30_CNT_SOCIAL_CIRCLE: 0, DEF_30_CNT_SOCIAL_CIRCLE: 0,
    OBS_60_CNT_SOCIAL_CIRCLE: 0, DEF_60_CNT_SOCIAL_CIRCLE: 0,
    AMT_REQ_CREDIT_BUREAU_HOUR: 0, AMT_REQ_CREDIT_BUREAU_DAY: 0,
    AMT_REQ_CREDIT_BUREAU_WEEK: 0, AMT_REQ_CREDIT_BUREAU_MON: 0,
    AMT_REQ_CREDIT_BUREAU_QRT: 0, AMT_REQ_CREDIT_BUREAU_YEAR: 1,
  };
}

export function ManualForm() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string>("personal");
  const [apiError, setApiError] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age_years: 35,
      CODE_GENDER: "M",
      CNT_CHILDREN: 0,
      CNT_FAM_MEMBERS: 2,
      NAME_EDUCATION_TYPE: "Secondary / secondary special",
      NAME_FAMILY_STATUS: "Married",
      FLAG_OWN_CAR: "N",
      FLAG_OWN_REALTY: "Y",
      FLAG_DOCUMENT_3: 0,
      AMT_INCOME_TOTAL: 150000,
      employment_years: 5,
      NAME_INCOME_TYPE: "Working",
      OCCUPATION_TYPE: "Unknown",
      ORGANIZATION_TYPE: "Business Entity Type 3",
      REG_CITY_NOT_WORK_CITY: 0,
      AMT_CREDIT: 300000,
      AMT_ANNUITY: 25000,
      AMT_GOODS_PRICE: 270000,
      NAME_CONTRACT_TYPE: "Cash loans",
      NAME_HOUSING_TYPE: "House / apartment",
      EXT_SOURCE_1: 0.5,
      EXT_SOURCE_2: 0.5,
      EXT_SOURCE_3: 0.5,
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      const payload = transformToBackend(data);
      const result = await postPredict(payload);
      navigate("/resultado", { state: result });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con el servidor";
      setApiError(msg);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {SECTIONS.map(({ id, title, Icon, Component }) => {
          const isOpen = openSection === id;
          return (
            <div
              key={id}
              className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden
                transition-shadow hover:shadow-card-md"
            >
              <button
                type="button"
                id={`section-btn-${id}`}
                aria-expanded={isOpen}
                aria-controls={`section-content-${id}`}
                onClick={() => setOpenSection(isOpen ? "" : id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left
                  hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                  transition-colors
                  ${isOpen ? "bg-bank-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Icon size={16} aria-hidden="true" />
                </div>
                <span className="font-semibold text-slate-800 flex-1">{title}</span>
                <ChevronDown
                  size={17}
                  aria-hidden="true"
                  className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                id={`section-content-${id}`}
                role="region"
                aria-labelledby={`section-btn-${id}`}
                hidden={!isOpen}
              >
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 animate-fade-in">
                    <Component />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {apiError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200
              px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle size={16} aria-hidden="true" />
            <span>{apiError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl
            bg-gradient-to-r from-bank-700 to-bank-600 hover:from-bank-800 hover:to-bank-700
            disabled:opacity-60 text-white font-semibold py-3.5 px-6
            transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
              Evaluando solicitud&hellip;
            </>
          ) : (
            "Evaluar solicitud"
          )}
        </button>
      </form>
    </FormProvider>
  );
}
