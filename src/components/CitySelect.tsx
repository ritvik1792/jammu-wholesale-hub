import { Field } from "@/components/Field";
import { CITIES, fieldClass } from "@/lib/constants";

export function CitySelect({
  id,
  label,
  city,
  otherCity,
  error,
  onCity,
  onOther,
}: {
  id: string;
  label: string;
  city: string;
  otherCity: string;
  error?: string;
  onCity: (city: string) => void;
  onOther: (city: string) => void;
}) {
  return (
    <div className="grid gap-3">
      <Field label={label} htmlFor={id} error={error}>
        <select
          id={id}
          value={city}
          onChange={(event) => onCity(event.target.value)}
          className={fieldClass}
        >
          <option value="">Select city or district</option>
          {CITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      {city === "Other" ? (
        <Field label="Your city" htmlFor={`${id}-other`}>
          <input
            id={`${id}-other`}
            value={otherCity}
            onChange={(event) => onOther(event.target.value)}
            placeholder="Town or district"
            className={fieldClass}
          />
        </Field>
      ) : null}
    </div>
  );
}
