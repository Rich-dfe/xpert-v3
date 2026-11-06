"use client";
import { useApplicationContext } from "@/context/ApplicationContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sensorConfigOptions } from "@/config/sensorConfigOptions";
import {
  sensorConfigSettingsSchema,
  SensorConfigSettingValues,
} from "@/schemas/sensorConfigSettings";
import { FormSelect } from "../forms/FormSelect";
import {
  useFetchSensorConfigSettings,
  useUpdateSensorConfigSettings,
} from "@/hooks/useLogger";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { UpdateSensorConfigSettingsPayload } from "@/types/logger";

export default function SensorConfigSettingsForm() {
  const { selectedLoggerId, selectedLoggerUid, loggerTypeId } =
    useApplicationContext();

  const {
    data: fetchSensorData,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useFetchSensorConfigSettings(selectedLoggerId, loggerTypeId);
  const {
    mutate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateSensorConfigSettings(selectedLoggerId);

  const sensorForm = useForm<SensorConfigSettingValues>({
    resolver: zodResolver(sensorConfigSettingsSchema),
    defaultValues: {
      sensorSetting: "",
    },
  });

  useEffect(() => {
    if (fetchSensorData !== undefined) {
      sensorForm.reset({
        sensorSetting: String(fetchSensorData),
      });
    }
  }, [fetchSensorData, sensorForm]);

  const sensorConfig = loggerTypeId
    ? sensorConfigOptions[loggerTypeId as keyof typeof sensorConfigOptions]
    : undefined;

  if (!sensorConfig) {
    return <div>Waiting sensor configuration...</div>;
  }

  if (loggerTypeId === null) {
    return;
  }

  function onSubmit(values: SensorConfigSettingValues) {
    console.log("SENSOR VALUES", values);
    console.log("SENSOR VALUE", values.sensorSetting);

    const payload: UpdateSensorConfigSettingsPayload = {
      ...values,
      typeId: loggerTypeId,
      loggerUid: selectedLoggerUid,
      loggerId: selectedLoggerId,
    };
    // Send payload to the API here
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

  return (
    <form
      onSubmit={sensorForm.handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors);
      })}
      className="mx-auto w-full max-w-6xl space-y-4 pb-4"
    >
      {/* Header and Logger Information */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Sensor Configuration
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

      {/* Sensor Settings */}
      <section className="rounded-lg border bg-card p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Sensor Settings</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure the sensor setting for this logger.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <FormSelect
            name="sensorSetting"
            label={sensorConfig.label}
            value={sensorForm.watch("sensorSetting")}
            onValueChange={(value) =>
              sensorForm.setValue("sensorSetting", value)
            }
            placeholder="Please Select"
            options={sensorConfig.options}
          />
        </div>
      </section>

      {/* Debug Information - Remove when no longer needed
      <section className="rounded-lg border bg-card p-4 space-y-4">
        <h3 className="text-sm font-semibold">Debug Information</h3>

        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(fetchSensorData, null, 2)}
        </pre>
      </section> */}

      {/* Save */}
      <div className="flex justify-end border-t pt-4">
        <Button
          type="submit"
          disabled={isUpdatePending}
          className="w-full sm:w-auto"
        >
          {isUpdatePending ? (
            <>
              <Spinner data-icon="inline-start" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
