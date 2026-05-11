import { useFormContext } from "react-hook-form";
import { FieldTooltip } from "../../ui/Tooltip";

interface Option { value: string; label: string }

interface Props {
  name: string;
  label: string;
  options: Option[];
  hint?: string;
  tooltip?: string;
}

export function SelectField({ name, label, options, hint, tooltip }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center">
        {label}
        {hint && <span className="ml-1 text-xs text-slate-400 font-normal">({hint})</span>}
        {tooltip && <FieldTooltip text={tooltip} />}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
        className={`rounded-lg border px-3 py-2 text-sm shadow-card transition-colors
          focus:outline-none focus:ring-2 focus:ring-bank-600 focus:border-transparent bg-white
          ${error ? "border-red-400" : "border-slate-300 hover:border-slate-400"}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
