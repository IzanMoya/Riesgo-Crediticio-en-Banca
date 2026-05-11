import { useFormContext } from "react-hook-form";
import { FieldTooltip } from "../../ui/Tooltip";

interface Props {
  name: string;
  label: string;
  hint?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export function NumberField({ name, label, hint, tooltip, min, max, step = 1, placeholder }: Props) {
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
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
        className={`rounded-lg border px-3 py-2 text-sm shadow-card transition-colors
          focus:outline-none focus:ring-2 focus:ring-bank-600 focus:border-transparent
          ${error
            ? "border-red-400 bg-red-50 text-red-900"
            : "border-slate-300 bg-white hover:border-slate-400"
          }`}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
