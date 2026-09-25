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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    >
        {selectedLoggerId} - {selectedLoggerUid} - {loggerTypeId}
        <div></div>
      <h5 className="mt-4">PAR Calibration {isFetchLoading?"Loading...":null}</h5>
      <div></div>
      <div>
        <FormSwitch
          name="reset"
          label="Reset To Defaults"
          checked={form.watch("reset")}
          onCheckedChange={handleResetChange}
          checkedLabel="Reset"
          uncheckedLabel=""
        />
      </div>
      <div></div>
      <div className="w-64">
        <FormNumberField
          name="loggerReadingTotal"
          label="Logger Reading Total"
          placeholder="Enter Value"
          control={form.control}
          disabled={form.watch("reset")}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="refReadingAverage"
          label="Reference Reading Average"
          placeholder="Enter Value"
          control={form.control}
          disabled={form.watch("reset")}
        />
      </div>
      <div className="md:col-span-2">
        <FormSelect
          name="units"
          label="Units"
          value={form.watch("units")}
          onValueChange={(value) => form.setValue("units", value)}
          //error={form.formState.errors.timezone?.message}
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
            }
          ]}
        />
      </div>
      <div className="w-64">
        <FormNumberField
          name="testDuration"
          label="Test Duration (minutes)"
          placeholder="Enter Value"
          control={form.control}
          disabled={form.watch("reset")}
          helpText={form.watch("reset")?"Logger config interval":""}
        />
      </div>
      <div></div>
      <Button type="submit">Save</Button>
    </form>
  );
}
