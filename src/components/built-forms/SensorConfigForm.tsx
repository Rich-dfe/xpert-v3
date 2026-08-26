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
  } = useUpdateSensorConfigSettings();

  const sensorForm = useForm<SensorConfigSettingValues>({
    resolver: zodResolver(sensorConfigSettingsSchema),
    defaultValues: {
      sensorSetting: "",
    },
  });

  console.log('FETCHED DATA',fetchSensorData);
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
      loggerId:selectedLoggerId
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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    >
      {selectedLoggerId} - {selectedLoggerUid} - {loggerTypeId}
      <pre>{JSON.stringify(fetchSensorData, null, 2)}</pre>
      <FormSelect
        name="sensorSetting"
        label={sensorConfig.label}
        value={sensorForm.watch("sensorSetting")}
        onValueChange={(value) => sensorForm.setValue("sensorSetting", value)}
        placeholder="Please Select"
        options={sensorConfig.options}
      />
      <Button type="submit" disabled={isUpdatePending}>
        {isUpdatePending ? (
          <>
            <Spinner data-icon="inline-start" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
