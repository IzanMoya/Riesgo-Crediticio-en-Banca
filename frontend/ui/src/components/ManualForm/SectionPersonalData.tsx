import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { BooleanField } from "./fields/BooleanField";

const EDUCATION_OPTIONS = [
  { value: "Secondary / secondary special", label: "Secundaria / FP" },
  { value: "Higher education", label: "Universitaria" },
  { value: "Incomplete higher", label: "Universitaria incompleta" },
  { value: "Lower secondary", label: "Primaria" },
  { value: "Academic degree", label: "Posgrado / Doctorado" },
];

const FAMILY_OPTIONS = [
  { value: "Married", label: "Casado/a" },
  { value: "Single / not married", label: "Soltero/a" },
  { value: "Civil marriage", label: "Pareja de hecho" },
  { value: "Separated", label: "Separado/a" },
  { value: "Widow", label: "Viudo/a" },
];

export function SectionPersonalData() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NumberField
        name="age_years"
        label="Edad del solicitante"
        hint="años"
        min={18} max={100}
        tooltip="Edad actual del solicitante en años completos. Mínimo 18 años para solicitar crédito."
      />
      <SelectField
        name="CODE_GENDER"
        label="Género"
        options={[{ value: "M", label: "Masculino" }, { value: "F", label: "Femenino" }]}
        tooltip="Género del solicitante. Variable incluida en el dataset original de Home Credit."
      />
      <NumberField
        name="CNT_CHILDREN"
        label="Número de hijos"
        min={0} max={20} step={1}
        tooltip="Número de hijos a cargo del solicitante. Puede influir en la capacidad de pago."
      />
      <NumberField
        name="CNT_FAM_MEMBERS"
        label="Miembros del hogar"
        min={1} max={20} step={1}
        tooltip="Total de personas que conviven en el hogar, incluyendo el solicitante."
      />
      <SelectField
        name="NAME_EDUCATION_TYPE"
        label="Nivel educativo"
        options={EDUCATION_OPTIONS}
        tooltip="Nivel de estudios más alto completado por el solicitante. A mayor nivel educativo, menor riesgo estadístico."
      />
      <SelectField
        name="NAME_FAMILY_STATUS"
        label="Estado civil"
        options={FAMILY_OPTIONS}
        tooltip="Estado civil actual del solicitante."
      />
      <BooleanField
        name="FLAG_OWN_CAR"
        label="¿Tiene vehículo propio?"
        trueValue="Y" falseValue="N" trueLabel="Sí" falseLabel="No"
        tooltip="Indica si el solicitante posee un vehículo a su nombre. Es un indicador de patrimonio."
      />
      <BooleanField
        name="FLAG_OWN_REALTY"
        label="¿Tiene propiedad inmobiliaria?"
        trueValue="Y" falseValue="N" trueLabel="Sí" falseLabel="No"
        tooltip="Indica si el solicitante posee una vivienda u otro inmueble. Indicador clave de solvencia."
      />
      <BooleanField
        name="FLAG_DOCUMENT_3"
        label="¿Aporta documento adicional 3?"
        trueValue={1} falseValue={0} trueLabel="Sí" falseLabel="No"
        tooltip="Si el solicitante ha aportado el documento de verificación número 3 (e.g. nómina o extracto bancario)."
      />
    </div>
  );
}
