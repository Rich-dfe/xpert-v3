"use client";
import { useRef } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  calibrationSettingsParSchema,
  CalibrationSettingsParTypes
} from "@/schemas/calibrationSettingsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../forms/FormSelect";
import { FormNumberField } from "../forms/FormNumberField";
import { FormSwitch } from "../forms/FormSwitch";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  useFetchLoggerCalibrationSettings,
  useUpdateParLoggerCalibrationSettings,
} from "@/hooks/useCalibrationSettings";
import { useFetchLoggerConfigSettings } from "@/hooks/useLogger";
import { useEffect } from "react";
import { UpdateParCalibrationSettingsPayload, ParCalibrationFormValues } from "@/types/calibration";

export default function CalibrationSettingsPar() {
  const { selectedLoggerId,selectedLoggerUid } = useApplicationContext();

  //Get the logging Interval from the cached query from the logger config form.
  const { data: configSettings } = useFetchLoggerConfigSettings(selectedLoggerId);
  const configLoggingInterval = configSettings?.[0]?.loggingInterval;
  const configLoggingIntervalMins = configLoggingInterval!/60;
    const loggerTypeId = configSettings?.[0]?.typeId ?? null;;

  const form = useForm<CalibrationSettingsParTypes>({
    resolver: zodResolver(calibrationSettingsParSchema),

    defaultValues: {
        loggerReadingTotal:1000,
        refReadingAverage:1000,
        testDuration: 24,
        units: "1",
        reset:false,
    },
  });

  const {
    data: calibrationData,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useFetchLoggerCalibrationSettings(selectedLoggerId, loggerTypeId);
  const {
    mutate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateParLoggerCalibrationSettings(selectedLoggerId);

  useEffect(() => {
    if (calibrationData !== undefined) {
      if (calibrationData?.typeId === 4132) {
        form.reset({
            loggerReadingTotal:calibrationData.loggerReadingTotal,
            refReadingAverage:Number(calibrationData.refReadingAverage),
            testDuration: calibrationData.testDuration/60, //Convert seconds to minutes.
            units: String(calibrationData.units),
            reset: false
        });
      }
      console.log("PAR CALIBRATION DATA", calibrationData);
    }
  }, [calibrationData, form]);

  function onSubmit(values: CalibrationSettingsParTypes) {
    console.log("ON Submit", values);

        const payload: UpdateParCalibrationSettingsPayload = {
              ...values,
              typeId:4132,
              loggerId:selectedLoggerId,
              loggerUid:selectedLoggerUid
            };

            console.log(payload);

            mutate(
          { data: payload },
          {
            onSuccess: () => {
              toast.success("Sensor configuration saved successfully!");
            },
            onError: (error) => {
              toast.error("Failed to save configuration", {
                description: error?.message || "Please try again.",
              });
            },
          },
        );
  }

  const previousValues = useRef<ParCalibrationFormValues>(null);

  const handleResetChange = (checked: boolean) => {
    //Get the current form values  
  
  
  if (checked) {
    // Save the current form values
    previousValues.current = form.getValues();

    // Set your defaults
    form.setValue("loggerReadingTotal", 1000);
    form.setValue("refReadingAverage",1000)
    form.setValue("testDuration",configLoggingIntervalMins);
    //form.setValue("units", form.getValues("units"));
    form.setValue("reset", false);
  } else {
    // Restore the previous form values
    if (previousValues.current) {
      form.reset(previousValues.current);
    }
  }

  form.setValue("reset", checked);
};

  return (
  <form
    onSubmit={form.handleSubmit(onSubmit, (errors) => {
      console.log("Validation errors:", errors);
    })}
    className="mx-auto w-full max-w-6xl space-y-4 pb-4"
  >
    {/* Header and Logger Information */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold tracking-tight">
        PAR Calibration
        {isFetchLoading && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            Loading...
          </span>
        )}
      </h2>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Logger ID:{" "}
          <strong className="font-medium text-foreground">
            {selectedLoggerId}
          </strong>
        </span>

        <span>
          UID:{" "}
          <strong className="font-medium text-foreground">
            {selectedLoggerUid}
          </strong>
        </span>

        <span>
          Type:{" "}
          <strong className="font-medium text-foreground">
            {loggerTypeId}
          </strong>
        </span>
      </div>
    </div>

    {/* Calibration Settings */}
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold">
        Calibration Settings
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Reset to Defaults */}
        <div className="min-w-0">
          <FormSwitch
            name="reset"
            label="Reset To Defaults"
            checked={form.watch("reset")}
            onCheckedChange={handleResetChange}
            checkedLabel="Reset"
            uncheckedLabel=""
          />
        </div>

        {/* Test Duration */}
        <div className="min-w-0">
          <FormNumberField
            name="testDuration"
            label="Test Duration (minutes)"
            placeholder="Enter value"
            control={form.control}
            disabled={form.watch("reset")}
            helpText={
              form.watch("reset")
                ? "Logger config interval"
                : ""
            }
          />
        </div>
      </div>
    </section>

    {/* PAR Calibration Readings */}
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">
          PAR Calibration Readings
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Enter the logger reading, reference reading, and measurement units.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Logger Reading */}
        <FormNumberField
          name="loggerReadingTotal"
          label="Logger Reading Total"
          placeholder="Enter value"
          control={form.control}
          disabled={form.watch("reset")}
        />

        {/* Reference Reading */}
        <FormNumberField
          name="refReadingAverage"
          label="Reference Reading Average"
          placeholder="Enter value"
          control={form.control}
          disabled={form.watch("reset")}
        />

        {/* Units */}
        <div className="sm:col-span-2">
          <FormSelect
            name="units"
            label="Units"
            value={form.watch("units")}
            onValueChange={(value) =>
              form.setValue("units", value)
            }
            placeholder="Please Select"
            options={[
              {
                value: "1",
                label: "umol m-² s-¹",
              },
              {
                value: "2",
                label: "mmol m-² s-¹",
              },
              {
                value: "3",
                label: "W m-²",
              },
              {
                value: "4",
                label: "lux",
              },
            ]}
          />
        </div>
      </div>
    </section>

    {/* Save */}
    <div className="flex justify-end border-t pt-4">
      <Button type="submit" className="w-full sm:w-auto">
        Save
      </Button>
    </div>
  </form>
);
}
