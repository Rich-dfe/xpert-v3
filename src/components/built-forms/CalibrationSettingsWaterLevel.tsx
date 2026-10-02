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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    >
      <h5 className="mt-4">Water Level Calibration</h5>
      {selectedLoggerId} - {selectedLoggerUid} - {loggerTypeId}
      <div>
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
      <div></div>
      <div>
        {!isServerSideCalAlreadyEnabled?<FormSwitch
          name="serverSideCalFlag"
          label="Server Side Calibration"
          checked={form.watch("serverSideCalFlag")}
          onCheckedChange={(value) =>
            form.setValue("serverSideCalFlag", value)
          }
          checkedLabel="Server Side"
          uncheckedLabel="Device Side"
        /> : "Server Side Calibration Enabled"
        }
      </div>
      <div></div>
      <div className="w-64">
        <FormNumberField
          name="firstReadingReference"
          label="First Reference Value"
          placeholder="Enter Value"
          control={form.control}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="secondReadingReference"
          label="Second Reference Value"
          placeholder="Enter Value"
          control={form.control}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="firstReadingLogger"
          label="First Logger Value"
          placeholder="Enter Value"
          control={form.control}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="secondReadingLogger"
          label="Second Logger Value"
          placeholder="Enter Value"
          control={form.control}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="temperature"
          label="Temperature"
          placeholder="Enter Value"
          control={form.control}
        />
      </div>
      <div></div>
      <div className="w-64">
        <FormNumberField
          name="resolution"
          label="Resolution"
          control={form.control}
          disabled
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="temperatureCompensation"
          label="Temperature Compensation"
          control={form.control}
          disabled
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
