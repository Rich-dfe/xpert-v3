"use client";

import { FormSelect } from "./FormSelect";

interface LoggingIntervalOption {
  value: string;
  label: string;
}

interface FormLoggingIntervalProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

const options: LoggingIntervalOption[] = [
  {
    value: "10",
    label: "10 seconds",
  },
  {
    value: "30",
    label: "30 seconds",
  },
  {
    value: "60",
    label: "1 minute",
  },
  {
    value: "120",
    label: "2 minutes",
  },
  {
    value: "180",
    label: "3 minutes",
  },
  {
    value: "240",
    label: "4 minutes",
  },
  {
    value: "300",
    label: "5 minutes",
  },
  {
    value: "360",
    label: "6 minutes",
  },
  {
    value: "420",
    label: "7 minutes",
  },
  {
    value: "480",
    label: "8 minutes",
  },
  {
    value: "540",
    label: "9 minutes",
  },
  {
    value: "600",
    label: "10 minutes",
  },
  {
    value: "900",
    label: "15 minutes",
  },
  {
    value: "1200",
    label: "20 minutes",
  },
  {
    value: "1500",
    label: "25 minutes",
  },
  {
    value: "1800",
    label: "30 minutes",
  },
  {
    value: "2100",
    label: "35 minutes",
  },
  {
    value: "2400",
    label: "40 minutes",
  },
  {
    value: "2700",
    label: "45 minutes",
  },
  {
    value: "3000",
    label: "50 minutes",
  },
  {
    value: "3300",
    label: "55 minutes",
  },
  {
    value: "3600",
    label: "1 hour",
  },
  {
    value: "7200",
    label: "2 hours",
  },
  {
    value: "10800",
    label: "3 hours",
  },
  {
    value: "14400",
    label: "4 hours",
  },
  {
    value: "21600",
    label: "6 hours",
  },
  {
    value: "28800",
    label: "8 hours",
  },
  {
    value: "43200",
    label: "12 hours",
  },
  {
    value: "86400",
    label: "24 hours",
  },
];

export function FormLoggingInterval({
  name,
  value,
  onChange,
  error,
  disabled,
}: FormLoggingIntervalProps) {

  // console.log("FormLoggingInterval value:", value);
  // console.log("FormLoggingInterval String value:", String(value));
  return (
    <FormSelect
      name={name}
      label="Logging interval"
      value={String(value)}
      onValueChange={(value) => {
        if (value === "") {
          return;
        }
        onChange(Number(value));
      }}
      options={options}
      error={error}
      disabled={disabled}
      placeholder="Select interval"
    />
  );
}