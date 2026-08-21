"use client";

import { Input } from "../ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
}

export function FormTextField<T extends FieldValues>({
  name: fieldName,
  label,
  placeholder,
  control,
  disabled,
  required,
}: FormTextFieldProps<T>) {
  return (
    <div className="space-y-2">
      <label htmlFor={fieldName} className="text-sm font-medium">
        {label}
        {required && " *"}
      </label>
      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={fieldName}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />

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
