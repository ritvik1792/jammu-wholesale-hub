import { Star } from "lucide-react";

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const label = `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)} out of 5 stars`;
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index));
        return (
          <span
            key={index}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star className="text-[#d9cbb8]" size={size} aria-hidden />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="fill-gold text-gold" size={size} aria-hidden />
            </span>
          </span>
        );
      })}
    </span>
  );
}
