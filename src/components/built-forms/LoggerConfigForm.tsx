"use client";
import { useApplicationContext } from "@/context/ApplicationContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loggerConfigSettingsSchema,
  LoggerConfigSettingValues,
} from "@/schemas/loggerConfigSettings";
import { FormTextField } from "../forms/FormTextField";
import { FormTextarea } from "../forms/FormTextarea";
import { FormSelect } from "../forms/FormSelect";
import { FormReadonlyField } from "../forms/FormReadonlyField";
import { DateTimePicker } from "../forms/DateTimePicker";
import { FormSwitch } from "../forms/FormSwitch";
import { FormLoggingInterval } from "../forms/FormLoggingInterval";
import { calculateStopDate } from "@/lib/helpers";
import { useUpdateLoggerConfigSettings } from "@/hooks/useLogger";
import { UpdateLoggerConfigSettingsPayload } from "@/types/logger";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function LoggerConfigSettingsForm() {
  const { selectedLoggerId } = useApplicationContext();
  const { mutate, isPending, isSuccess, isError, error } = useUpdateLoggerConfigSettings();

  const form = useForm<LoggerConfigSettingValues>({
    resolver: zodResolver(loggerConfigSettingsSchema),

    defaultValues: {
      loggerName: "",
      continuousLogging: false,
      startDate: undefined,
      stopDate: undefined,
      loggerNotes: "",
      loggingInterval: 600,
      timezone: "0",
      applyToGroup: false,
    },
  });

  function onSubmit(values: LoggerConfigSettingValues) {
    
    const payload: UpdateLoggerConfigSettingsPayload = {
      ...values,

      startDate: values.startDate
        ? Math.floor(values.startDate.getTime() / 1000)
        : 0,

      stopDate: values.stopDate
        ? Math.floor(values.stopDate.getTime() / 1000)
        : 0,

      //Grab the selected logger id form the application context.
      loggerId: selectedLoggerId,
    };

    // Send payload to the API here
    mutate({ data: payload },{
      onSuccess: () =>{
        toast.success("Logger configuration saved successfully!")
      },
      onError: (error) =>{
        toast.error("Failed to save configuration", {
            description: error?.message || "Please try again.",
          })
      }
    });

    console.log('isSuccess', isSuccess);
    console.log('isError', isError);
    console.log('API Error', error);
  }

  const startDate = form.watch("startDate");
  const stopDate = form.watch("stopDate");
  const continuousLoggingState = form.watch("continuousLogging");
  const loggingIntervalValue = form.watch("loggingInterval");
  const continuousLoggingAllowed = loggingIntervalValue >= 60;

  useEffect(() => {
    // Condition 3:
    // Intervals below 60 seconds cannot use continuous logging.
    if (loggingIntervalValue < 60) {
      form.setValue("continuousLogging", false, {
        shouldValidate: true,
      });

      // A start date is required before we can calculate a stop date.
      if (!startDate) {
        return;
      }

      const calculatedStopDate = calculateStopDate(
        startDate,
        loggingIntervalValue,
      );

      if (!calculatedStopDate) {
        return;
      }

      form.setValue("stopDate", calculatedStopDate, {
        shouldValidate: true,
      });

      return;
    }

    // Condition 1:
    // Continuous logging is enabled and the interval is 60 seconds or more.
    if (continuousLoggingState) {
      form.setValue("startDate", undefined);

      form.setValue("stopDate", undefined);

      return;
    }

    // Condition 2:
    // continuousLogging is false and interval is 60 seconds or more.
    // Do nothing here.
    // The user is allowed to enter both dates.
  }, [continuousLoggingState, loggingIntervalValue, startDate, form]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors);
      })}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    >
      <div className="md:col-span-2">
      {selectedLoggerId} {typeof selectedLoggerId}
        <FormTextField
          name="loggerName"
          label="Logger Name"
          placeholder="Enter logger name"
          register={form.register}
          errors={form.formState.errors}
        />
      </div>

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
          label="Logging Mode"
          checked={form.watch("continuousLogging")}
          onCheckedChange={(value) => form.setValue("continuousLogging", value)}
          helpText={
            continuousLoggingState
              ? "Always logging: recommended"
              : "Controlled by Start/Stop dates."
          }
          checkedLabel="Continuous"
          uncheckedLabel="Timed"
          disabled={!continuousLoggingAllowed}
        />
      </div>
      {/* //############################################
      // Start Date Time Picker
      //########################################### */}

      <div className="max-w-sm space-y-4">
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
          required={false}
          disabled={continuousLoggingState}
          error={form.formState.errors.startDate?.message}
        />

        {startDate && (
          <p className="text-sm">Selected: {startDate.toString()}</p>
        )}
      </div>

      {/* //############################################
      // Stop Date Time Picker
      //########################################### */}

      <div className="max-w-sm space-y-4">
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
          required={false}
          disabled={continuousLoggingState || loggingIntervalValue < 60}
          error={form.formState.errors.stopDate?.message}
        />

        {stopDate && <p className="text-sm">Selected: {stopDate.toString()}</p>}
      </div>

      <div className="md:col-span-2">
        <FormSelect
          name="timezone"
          label="Timezone"
          value={form.watch("timezone")}
          onValueChange={(value) => form.setValue("timezone", value)}
          error={form.formState.errors.timezone?.message}
          placeholder="Please Select"
          options={[
            {
              value: "0",
              label: "UTC",
            },
            {
              value: "1",
              label: "UTC+1.00",
            },
            {
              value: "2",
              label: "UTC+2.00",
            },
            {
              value: "3",
              label: "UTC+3.00",
            },
            {
              value: "4",
              label: "UTC+4.00",
            },
            {
              value: "5",
              label: "UTC+5.00",
            },
            {
              value: "6",
              label: "UTC+6.00",
            },
            {
              value: "7",
              label: "UTC+7.00",
            },
            {
              value: "8",
              label: "UTC+8.00",
            },
            {
              value: "9",
              label: "UTC+9.00",
            },
            {
              value: "10",
              label: "UTC+10.00",
            },
            {
              value: "11",
              label: "UTC+11.00",
            },
            {
              value: "12",
              label: "UTC+12.00",
            },
            {
              value: "13",
              label: "UTC+13.00",
            },
            {
              value: "-1",
              label: "UTC-1.00",
            },
            {
              value: "-2",
              label: "UTC-2.00",
            },
            {
              value: "-3",
              label: "UTC-3.00",
            },
            {
              value: "-4",
              label: "UTC-4.00",
            },
            {
              value: "-5",
              label: "UTC-5.00",
            },
            {
              value: "-6",
              label: "UTC-6.00",
            },
            {
              value: "-7",
              label: "UTC-7.00",
            },
            {
              value: "-8",
              label: "UTC-8.00",
            },
            {
              value: "-9",
              label: "UTC-9.00",
            },
            {
              value: "-10",
              label: "UTC-10.00",
            },
            {
              value: "-11",
              label: "UTC-11.00",
            },
            {
              value: "-12",
              label: "UTC-12.00",
            },
          ]}
        />
      </div>

      <FormReadonlyField name="group" label="Group" value="Home" />

      <div>
        <FormSwitch
          name="applyToGroup"
          label="Apply to group"
          checked={form.watch("applyToGroup")}
          onCheckedChange={(value) => form.setValue("applyToGroup", value)}
          helpText="Apply to all loggers in group."
          checkedLabel="Yes"
          uncheckedLabel="No"
        />
      </div>

      <div className="md:col-span-2">
        <FormTextarea
          name="loggerNotes"
          label="Logger Notes"
          placeholder="Enter some notes"
          register={form.register}
          errors={form.formState.errors}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <><Spinner data-icon="inline-start" />Saving...</> : "Save"}
      </Button>
    </form>
  );
}
