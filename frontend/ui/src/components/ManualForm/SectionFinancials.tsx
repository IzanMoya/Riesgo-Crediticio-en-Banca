import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";

const CONTRACT_OPTIONS = [
  { value: "Cash loans", label: "Préstamo en efectivo" },
  { value: "Revolving loans", label: "Crédito revolving" },
];

const HOUSING_OPTIONS = [
  { value: "House / apartment", label: "Casa / piso propio" },
  { value: "With parents", label: "Con familiares" },
  { value: "Municipal apartment", label: "Piso municipal" },
  { value: "Rented apartment", label: "Piso alquilado" },
  { value: "Office apartment", label: "Vivienda de empresa" },
  { value: "Co-op apartment", label: "Cooperativa" },
];

export function SectionFinancials() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NumberField
        name="AMT_CREDIT"
        label="Importe del crédito"
        hint="€"
        min={0} step={1000}
        tooltip="Capital total solicitado en euros. Un importe muy elevado respecto a los ingresos aumenta el riesgo de impago."
      />
      <NumberField
        name="AMT_ANNUITY"
        label="Cuota anual"
        hint="€"
        min={0} step={100}
        tooltip="Importe total de las cuotas a pagar en un año. Se calcula como cuota mensual × 12. Debe ser sostenible respecto a los ingresos."
      />
      <NumberField
        name="AMT_GOODS_PRICE"
        label="Precio del bien financiado"
        hint="€"
        min={0} step={1000}
        tooltip="Valor de mercado del activo o bien que se financia (vivienda, vehículo, electrodoméstico, etc.). La diferencia con el importe del crédito indica sobre-financiación."
      />
      <SelectField
        name="NAME_CONTRACT_TYPE"
        label="Tipo de contrato"
        options={CONTRACT_OPTIONS}
        tooltip="Modalidad del crédito: préstamo en efectivo (importe fijo, plazo definido) o revolving (línea de crédito flexible)."
      />
      <SelectField
        name="NAME_HOUSING_TYPE"
        label="Tipo de vivienda"
        options={HOUSING_OPTIONS}
        tooltip="Situación de residencia actual del solicitante. Tener vivienda propia es un indicador positivo de solvencia."
      />
    </div>
  );
}
