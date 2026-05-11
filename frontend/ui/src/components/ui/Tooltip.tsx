import { Info } from "lucide-react";

export function FieldTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex ml-1 align-middle">
      <Info
        size={13}
        aria-hidden="true"
        className="text-slate-400 hover:text-blue-500 cursor-help transition-colors"
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          w-64 rounded-lg bg-slate-800 px-3 py-2.5 text-xs leading-relaxed text-slate-100
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl
          whitespace-normal text-left"
      >
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2
          border-4 border-transparent border-t-slate-800" />
      </span>
    </span>
  );
}
