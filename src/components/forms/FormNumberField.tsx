"use client";

import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormNumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  unit?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  step?: number;
  helpText?: string;
}

export function FormNumberField<T extends FieldValues>({
  name: fieldName,
  label,
  control,
  unit,
  disabled,
  required,
  placeholder,
  step,
  helpText,
}: FormNumberFieldProps<T>) {
  return (
    <div className="space-y-2">
      <label htmlFor={fieldName} className="text-sm font-medium">
        {label}

        {required && (
          <span className="text-destructive"> *</span>
        )}
      </label>

      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className="flex items-center gap-2">
              <Input
                id={fieldName}
                type="number"
                step={step}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(Number(e.target.value))
                }
                onBlur={field.onBlur}
                disabled={disabled}
                placeholder={placeholder}
                name={field.name}
                ref={field.ref}
              />

              {unit && (
                <span className="text-sm text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>

            {helpText && (
              <p className="text-sm text-muted-foreground">
                {helpText}
              </p>
            )}

            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}