"use client";

import { Input } from "../ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface FormTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
  required?:boolean;
}

export function FormTextField({
  name,
  label,
  placeholder,
  register,
  errors,
  disabled,
  required
}: FormTextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">{label}{required && " *"}</label>

      <Input id={name} placeholder={placeholder} disabled={disabled} {...register(name)} />
    
      {errors[name] && (
      <p className="text-sm text-destructive">
        {errors[name]?.message as string}
      </p>
    )}
    </div>
  );
}
