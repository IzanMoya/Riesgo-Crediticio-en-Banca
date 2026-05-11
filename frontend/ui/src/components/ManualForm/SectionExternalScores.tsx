import { NumberField } from "./fields/NumberField";

const EXT_TOOLTIP = "Puntuación de solvencia proporcionada por una agencia de crédito externa. " +
  "Escala de 0 a 1: 0 = máximo riesgo, 1 = mínimo riesgo. " +
  "Es una de las variables más influyentes en el modelo. Deja en 0,5 si no se dispone del dato.";

export function SectionExternalScores() {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        Puntuaciones de solvencia proporcionadas por agencias externas de crédito (rango 0&ndash;1,
        mayor = mejor historial). Son las variables{" "}
        <span className="font-medium text-slate-700">más influyentes</span> en el modelo.
        Deja en 0,5 si no se dispone del dato.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField
          name="EXT_SOURCE_1"
          label="Score externo 1"
          hint="0–1"
          min={0} max={1} step={0.01}
          tooltip={EXT_TOOLTIP}
        />
        <NumberField
          name="EXT_SOURCE_2"
          label="Score externo 2"
          hint="0–1"
          min={0} max={1} step={0.01}
          tooltip={EXT_TOOLTIP}
        />
        <NumberField
          name="EXT_SOURCE_3"
          label="Score externo 3"
          hint="0–1"
          min={0} max={1} step={0.01}
          tooltip={EXT_TOOLTIP}
        />
      </div>
    </div>
  );
}
