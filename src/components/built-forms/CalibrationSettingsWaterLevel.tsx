"use client";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  calibrationSettingsWaterLevelSchema,
  CalibrationSettingsWaterLevelTypes,
} from "@/schemas/calibrationSettingsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSwitch } from "../forms/FormSwitch";
import { FormNumberField } from "../forms/FormNumberField";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  useFetchLoggerCalibrationSettings,
  useUpdateWaterLevelLoggerCalibrationSettings,
} from "@/hooks/useCalibrationSettings";
import { useEffect } from "react";
import { UpdateWaterlevelCalibrationSettingsPayload } from "@/types/calibration";

export default function CalibrationSettingsWaterLevel() {
  const { selectedLoggerId, loggerTypeId, selectedLoggerUid } = useApplicationContext();

  const form = useForm<CalibrationSettingsWaterLevelTypes>({
    resolver: zodResolver(calibrationSettingsWaterLevelSchema),

    defaultValues: {
      serverSideCalFlag: false,
      firstReadingReference: 200,
      secondReadingReference: 1000,
      firstReadingLogger: 1000,
      secondReadingLogger: 10000,
      temperature: 20,
      resolution: 0,
      temperatureCompensation: 0,
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
  } = useUpdateWaterLevelLoggerCalibrationSettings(selectedLoggerId);

  //const isServerSideCalFlag = form.watch("serverSideCalFlag");
  //Checks whether the server side flag is set on the server to hide the swith component 
  const isServerSideCalAlreadyEnabled = calibrationData?.typeId === 4131 && calibrationData.serverSideCalFlag;


  useEffect(() => {
    if (calibrationData !== undefined) {
      console.log('DB SETTINGS',calibrationData);
      if (calibrationData?.typeId === 4131) {
        form.reset({
          firstReadingReference: calibrationData.firstReadingReference,
          secondReadingReference: calibrationData.secondReadingReference,
          firstReadingLogger: calibrationData.firstReadingLogger,
          secondReadingLogger: calibrationData.secondReadingLogger,
          temperature: calibrationData.temperature,
          resolution: calibrationData.resolution,
          temperatureCompensation:
            Math.round(calibrationData.temperatureCompensation * 10000) / 10000,
          serverSideCalFlag: calibrationData.serverSideCalFlag,
          reset:false
        });
      }
      console.log("WATER CALIBRATION DATA", calibrationData);
    }
  }, [calibrationData, form]);

  function onSubmit(values: CalibrationSettingsWaterLevelTypes) {
    console.log("ON Submit", values);

        const payload: UpdateWaterlevelCalibrationSettingsPayload = {
              ...values,
              typeId:4131,
              loggerId:selectedLoggerId,
              loggerUid:selectedLoggerUid
            };

            console.log(payload);

            mutate(
          { data: payload },
          {
            onSuccess: () => {
              form.setValue("reset", false);
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
        Water Level Calibration
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
            onCheckedChange={(value) =>
              form.setValue("reset", value)
            }
            checkedLabel="Press Save"
            uncheckedLabel=""
          />
        </div>

        {/* Server-Side Calibration */}
        <div className="min-w-0">
          {!isServerSideCalAlreadyEnabled ? (
            <FormSwitch
              name="serverSideCalFlag"
              label="Server Side Calibration"
              checked={form.watch("serverSideCalFlag")}
              onCheckedChange={(value) =>
                form.setValue("serverSideCalFlag", value)
              }
              checkedLabel="Server Side"
              uncheckedLabel="Device Side"
            />
          ) : (
            <div className="flex min-h-10 items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              <span className="text-muted-foreground">
                Server Side Calibration Enabled
              </span>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Calibration Readings */}
<section className="rounded-lg border bg-card p-4 space-y-4">
  <div>
    <h3 className="text-sm font-semibold">
      Calibration Readings
    </h3>
    <p className="mt-1 text-xs text-muted-foreground">
      Enter the reference values, corresponding logger readings,
      and calibration temperature.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* First Row */}
    <FormNumberField
      name="firstReadingReference"
      label="First Reference Value"
      placeholder="Enter value"
      control={form.control}
    />

    <FormNumberField
      name="firstReadingLogger"
      label="First Logger Value"
      placeholder="Enter value"
      control={form.control}
    />

    {/* Second Row */}
    <FormNumberField
      name="secondReadingReference"
      label="Second Reference Value"
      placeholder="Enter value"
      control={form.control}
    />

    <FormNumberField
      name="secondReadingLogger"
      label="Second Logger Value"
      placeholder="Enter value"
      control={form.control}
    />

    {/* Third Row */}
    <FormNumberField
      name="temperature"
      label="Temperature"
      placeholder="Enter value"
      control={form.control}
      />
  </div>
</section>

    {/* Device Parameters */}
<section className="rounded-lg border bg-card p-4 space-y-4">
  <h3 className="text-sm font-semibold">
    Device Parameters
  </h3>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <FormNumberField
      name="resolution"
      label="Resolution"
      control={form.control}
      disabled
    />

    <FormNumberField
      name="temperatureCompensation"
      label="Temperature Compensation"
      control={form.control}
      disabled
    />
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
