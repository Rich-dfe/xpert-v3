import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateTimePickerProps {
  name: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  required: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
}

export function DateTimePicker({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  helpText,
  error,
}: DateTimePickerProps) {
  function handleDateChange(date: Date | undefined) {
    if (!date) {
      onChange(undefined);
      return;
    }

    if (value) {
      date.setHours(value.getHours(), value.getMinutes());
    }

    onChange(date);
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!value) {
      return;
    }

    const [hours, minutes] = event.target.value.split(":").map(Number);
    const updatedDate = new Date(value);
    updatedDate.setHours(hours, minutes);

    onChange(updatedDate);
  }

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(
        value.getMinutes(),
      ).padStart(2, "0")}`
    : "";

  return (
    <div className="space-y-2">
      <label htmlFor={`${name}-date`} className="text-sm font-medium">
        {label}

        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`${name}-date`}
            type="button"
            variant={"outline"}
            disabled={disabled}
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? value.toLocaleString() : "Select a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>

      <input
        id={`${name}-time`}
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        disabled={disabled || !value}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      ></input>

      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
