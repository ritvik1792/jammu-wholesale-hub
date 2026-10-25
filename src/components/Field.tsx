import type { ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div data-invalid={error ? "true" : undefined}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-maroon">{error}</p> : null}
    </div>
  );
}
