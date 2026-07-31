"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loggerConfigSettingsSchema,
  LoggerConfigSettingValues,
} from "@/schemas/loggerConfigSettings";
import { FormTextField } from "../forms/FormTextField";
import { FormTextarea } from "../forms/FormTextarea";
import { FormSelect } from "../forms/FormSelect";
import { FormNumberField } from "../forms/FormNumberField";
import { FormReadonlyField } from "../forms/FormReadonlyField";

import { Button } from "@/components/ui/button";

export default function LoggerConfigSettingsForm() {
  const form = useForm<LoggerConfigSettingValues>({
    resolver: zodResolver(loggerConfigSettingsSchema),

    defaultValues: {
      loggerName: "",
      interval: 10,
      loggerNotes: "",
      loggerType: "",
    },
  });

  function onSubmit(values: LoggerConfigSettingValues) {
    console.log("Valid form data:", values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormTextField
        name="loggerName"
        label="Logger Name"
        placeholder="Enter a friggin name"
        register={form.register}
        errors={form.formState.errors}
      />

      <FormTextarea
        name="loggerNotes"
        label="Logger Notes"
        placeholder="Enter some notes"
        register={form.register}
        errors={form.formState.errors}
      />

      <FormNumberField
        name="interval"
        label="Sample interval"
        value={form.watch("interval")}
       onChange={(value) => form.setValue("interval", value)}
       error={form.formState.errors.interval?.message}
        unit="seconds"
        required
        step={0.2}
        helpText="The time between measurements recorded by the logger."
      />

      <FormReadonlyField
  name="batteryVoltage"
  label="Battery voltage"
  value={12.6}
  unit="V"
  helpText="The voltage recorded during the last logger check."
/>

      <FormSelect
        name="loggerType"
        label="Loggers"
        value={form.watch("loggerType")}
        onValueChange={(value) => form.setValue("loggerType", value)}
        error={form.formState.errors.loggerType?.message}
        placeholder="Select a logger"
        options={[
          {
            value: "",
            label: "None",
          },
          {
            value: "par",
            label: "PAR",
          },
          {
            value: "waterlevel",
            label: "Water Level",
          },
          {
            value: "mpt",
            label: "Multi Profile",
          },
        ]}
      />

      <Button type="submit">Save settings</Button>
    </form>
  );
}
