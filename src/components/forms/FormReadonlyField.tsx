interface FormReadonlyFieldProps {
  name: string;
  label: string;
  value: string | number;
  unit?: string;
  helpText?: string;
}

export function FormReadonlyField({
  name,
  label,
  value,
  unit,
  helpText,
}: FormReadonlyFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium"
      >
        {label}
      </label>

      <div
        id={name}
        className="flex min-h-9 items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm"
      >
        <span>{value}</span>

        {unit && (
          <span className="text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      {helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}