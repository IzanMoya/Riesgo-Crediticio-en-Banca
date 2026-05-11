import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { BooleanField } from "./fields/BooleanField";

const INCOME_TYPE_OPTIONS = [
  { value: "Working", label: "Asalariado" },
  { value: "Commercial associate", label: "Autónomo / asociado comercial" },
  { value: "Pensioner", label: "Pensionista" },
  { value: "State servant", label: "Funcionario" },
  { value: "Unemployed", label: "Desempleado" },
  { value: "Student", label: "Estudiante" },
  { value: "Businessman", label: "Empresario" },
  { value: "Maternity leave", label: "Baja maternal" },
];

const OCCUPATION_OPTIONS = [
  { value: "Unknown", label: "No especificada" },
  { value: "Laborers", label: "Operario / laboral" },
  { value: "Core staff", label: "Personal base" },
  { value: "Accountants", label: "Contabilidad" },
  { value: "Managers", label: "Directivo" },
  { value: "Drivers", label: "Conductor" },
  { value: "Sales staff", label: "Ventas" },
  { value: "Cleaning staff", label: "Limpieza" },
  { value: "Cooking staff", label: "Hostelería" },
  { value: "Private service staff", label: "Servicio privado" },
  { value: "Medicine staff", label: "Sanidad" },
  { value: "Security staff", label: "Seguridad" },
  { value: "High skill tech staff", label: "Técnico especializado" },
  { value: "IT staff", label: "Tecnología (IT)" },
  { value: "Secretaries", label: "Secretaría / Administración" },
  { value: "HR staff", label: "Recursos humanos" },
  { value: "Waiters/barmen staff", label: "Camarero" },
  { value: "Realty agents", label: "Agente inmobiliario" },
  { value: "Low-skill Laborers", label: "Operario no cualificado" },
];

export function SectionEmployment() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NumberField
        name="AMT_INCOME_TOTAL"
        label="Ingresos anuales"
        hint="€"
        min={0} step={1000}
        tooltip="Ingresos brutos anuales totales del solicitante en euros. Incluye salario, rentas y otros ingresos regulares."
      />
      <NumberField
        name="employment_years"
        label="Antigüedad laboral"
        hint="años"
        min={0} max={50}
        tooltip="Años que lleva en el empleo actual. Introduce 0 si está desempleado. A mayor antigüedad, menor riesgo percibido."
      />
      <SelectField
        name="NAME_INCOME_TYPE"
        label="Tipo de ingreso"
        options={INCOME_TYPE_OPTIONS}
        tooltip="Fuente principal de ingresos del solicitante. Los funcionarios y asalariados tienen menor riesgo estadístico que los desempleados."
      />
      <SelectField
        name="OCCUPATION_TYPE"
        label="Ocupación"
        options={OCCUPATION_OPTIONS}
        tooltip="Sector de actividad profesional del solicitante. Selecciona 'No especificada' si no está en la lista."
      />
      <BooleanField
        name="REG_CITY_NOT_WORK_CITY"
        label="¿Reside fuera de la ciudad de trabajo?"
        trueValue={1} falseValue={0} trueLabel="Sí" falseLabel="No"
        tooltip="Indica si el domicilio registrado del solicitante está en una ciudad distinta a donde trabaja. Puede indicar menor estabilidad."
      />
    </div>
  );
}
