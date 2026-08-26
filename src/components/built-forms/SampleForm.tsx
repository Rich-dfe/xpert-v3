"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sampleFormSchema,SampleFormValues} from "@/schemas/sampleSchema";
import { FormTextField } from "../forms/FormTextField";
import { FormTextarea } from "../forms/FormTextarea";
import { FormSelect } from "../forms/FormSelect";
import { FormNumberField } from "../forms/FormNumberField";
import { FormReadonlyField } from "../forms/FormReadonlyField";
import { DateTimePicker } from "../forms/DateTimePicker";
import { FormSwitch } from "../forms/FormSwitch";
import { FormLoggingInterval } from "../forms/FormLoggingInterval";

import { Button } from "@/components/ui/button";

export default function LoggerConfigSettingsForm() {
  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),

    defaultValues: {
      loggerName: "",
      interval: 600,
      continuousLogging:true,
      startDate: undefined,
      stopDate: undefined,
      loggerNotes: "",
      loggerType: "",
      
      enabled: true,
      loggingInterval: 300
    },
  });

  function onSubmit(values: SampleFormValues) {
    console.log("Valid form data:", values);
  }

  const startDate = form.watch("startDate");
  const stopDate = form.watch("stopDate");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors);
      })}
       className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    >

      {/* <div className="md:col-span-2">
      <FormTextField
        name="loggerName"
        label="Logger Name"
        placeholder="Enter logger name"
        register={form.register}
        errors={form.formState.errors}
      />
      </div> */}

      <div>
      <FormLoggingInterval
        name="loggingInterval"
        value={form.watch("loggingInterval")}
        onChange={(value) =>
          form.setValue("loggingInterval", value, {
            shouldValidate: true,
          })
        }
        error={form.formState.errors.loggingInterval?.message}
      />
      </div>

        <div>
      <FormSwitch
        name="continuousLogging"
        label="Continuous Logging"
        checked={form.watch("continuousLogging")}
        onCheckedChange={(value) => form.setValue("continuousLogging", value)}
        helpText="Controls whether this logger is active."
        checkedLabel="Enabled"
        uncheckedLabel="Disabled"
      />
  </div>
      {/* //############################################
      // Start Date Time Picker
      //########################################### */}

      <div className="max-w-sm space-y-4 p-6">
        {/* {startDate && (
          <p className="text-sm">
            Unix timestamp: {Math.floor(startDate.getTime() / 1000)}
          </p>
        )} */}
        <DateTimePicker
          name="startDate"
          label="Start date"
          value={startDate}
          onChange={(date) => {
            if (!date) {
              return;
            }

            form.setValue("startDate", date, {
              shouldValidate: true,
            });
          }}
          required={true}
          disabled={false}
          helpText="Set a start time."
          error={form.formState.errors.startDate?.message}
        />

        {startDate && (
          <p className="text-sm">Selected: {startDate.toString()}</p>
        )}
      </div>

      {/* //############################################
      // Stop Date Time Picker
      //########################################### */}

      <div className="max-w-sm space-y-4 p-6">
        {/* {stopDate && (
          <p className="text-sm">
            Unix timestamp: {Math.floor(stopDate.getTime() / 1000)}
          </p>
        )} */}
        <DateTimePicker
          name="stopDate"
          label="Stop date"
          value={stopDate}
          onChange={(date) => {
            if (!date) {
              return;
            }

            form.setValue("stopDate", date, {
              shouldValidate: true,
            });
          }}
          required={true}
          disabled={false}
          helpText="Set a stop time."
          error={form.formState.errors.stopDate?.message}
        />

        {stopDate && (
          <p className="text-sm">Selected: {stopDate.toString()}</p>
        )}
      </div>

      {/* <FormTextarea
        name="loggerNotes"
        label="Logger Notes"
        placeholder="Enter some notes"
        register={form.register}
        errors={form.formState.errors}
      /> */}

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
