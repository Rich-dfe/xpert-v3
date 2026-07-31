"use client";

import { Textarea } from "../ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
  required?:boolean;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  register,
  errors,
  disabled,
  required
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">{label}{required && " *"}</label>

      <Textarea id={name} placeholder={placeholder} disabled={disabled} {...register(name)} />
    
      {errors[name] && (
      <p className="text-sm text-destructive">
        {errors[name]?.message as string}
      </p>
    )}
    </div>
  );
}
