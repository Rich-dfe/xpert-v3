"use client";

import { Input } from "@/components/ui/input";

interface FormNumberFieldProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  step?: number;
  helpText?: string;
}

export function FormNumberField({
  name,
  label,
  value,
  onChange,
  unit,
  error,
  disabled,
  required,
  placeholder,
  step,
  helpText,
}: FormNumberFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}

        {required && <span className="text-destructive"> *</span>}
      </label>

      <div className="flex items-center gap-2">
        <Input
          id={name}
          type="number"
          step={step}
          value={value}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
          disabled={disabled}
          placeholder={placeholder}
        />

        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
