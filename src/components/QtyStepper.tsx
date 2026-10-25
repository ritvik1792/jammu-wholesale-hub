import { MAX_QTY } from "@/lib/constants";
import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  min,
  label,
  onChange,
}: {
  value: number;
  min: number;
  label: string;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-maroon disabled:text-muted/40"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[5.5rem] text-center text-sm font-semibold tabular-nums">
        {label}
      </span>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-maroon disabled:text-muted/40"
        aria-label="Increase quantity"
        disabled={value >= MAX_QTY}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
