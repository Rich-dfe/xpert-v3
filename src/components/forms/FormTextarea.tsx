"use client";

import { Textarea } from "../ui/textarea";
import { Control, Controller,FieldValues,Path } from "react-hook-form";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  required?:boolean;
}

export function FormTextarea<T extends FieldValues>({
  name: fieldName,
  label,
  placeholder,
  control,
  disabled,
  required
}: FormTextareaProps<T>) {
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
            <Textarea id={fieldName} placeholder={placeholder} disabled={disabled} {...field} />

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


