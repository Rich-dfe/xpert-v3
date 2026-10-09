"use client";

import { useState, useEffect } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  CalibrationMptSensor,
  calibrationSettingsMptProbeSchema,
} from "@/schemas/calibrationSettingsSchema";
import { useFieldArray, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../forms/FormSelect";
import { FormNumberField } from "../forms/FormNumberField";
import { FormSwitch } from "../forms/FormSwitch";
import { Separator } from "../ui/separator";

export default function CalibrationSettingsMpt() {
  // ---------------------------------------------------------------------------
  // Context
  // ---------------------------------------------------------------------------
  const { selectedLoggerId, loggerTypeId, selectedLoggerUid } =
    useApplicationContext();
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [selectedSensor, setSelectedSensor] = useState("0");
  const [calibrationType, setCalibrationType] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState(false);
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  // Currently selected sensor
  const formState = getFormState(calibrationType, calculationMethod);
  const soilTypeDefaults: Record<
    string,
    {
      dryPoint: number;
      fieldCapacity: number;
      wiltPoint:number;
    }
  > = {
    "1": {
      dryPoint: 2200, fieldCapacity: 6100, wiltPoint: 50
    },
    "2": {
      dryPoint: 2104, fieldCapacity: 6265, wiltPoint: 42
    },
    "3": {
      dryPoint: 2004, fieldCapacity: 6465, wiltPoint: 44
    },
    "4": {
      dryPoint: 1858, fieldCapacity: 6730, wiltPoint: 50
    },
    "5": {
      dryPoint: 1664, fieldCapacity: 6998, wiltPoint: 35
    },
    "6": {
      dryPoint: 1700, fieldCapacity: 7100, wiltPoint: 20
    },
    "7": {
      dryPoint: 1948, fieldCapacity: 6538, wiltPoint: 63
    },
    "8": {
      dryPoint: 1801, fieldCapacity: 6810, wiltPoint: 61
    },
    "9": {
      dryPoint: 1677, fieldCapacity: 7053, wiltPoint: 58
    },
    "10": {
      dryPoint: 1638, fieldCapacity: 7099, wiltPoint: 66
    },
    "11": {
      dryPoint: 1872, fieldCapacity: 6643, wiltPoint: 69
    },
    "12": {
      dryPoint: 1490, fieldCapacity: 7250, wiltPoint: 71
    },
    "13": {
      dryPoint: 1, fieldCapacity: 10000, wiltPoint: 20
    },
    "14": {
      dryPoint: 1, fieldCapacity: 10000, wiltPoint: 0
    },
  };

  const form = useForm<CalibrationMptSensor>({
    resolver: zodResolver(calibrationSettingsMptProbeSchema),
    defaultValues: {
      units: "1",
      sensors: [
        {
          soilType: "0",
          dryPoint: 1,
          fieldCapacity: 0,
          wiltPoint: 0,
          saturatedSoilWeight: 0,
          drySoilWeight: 0,
          saturatedVolume: 0,
          slope: 0,
          offset: 0,
        },
        {
          soilType: "0",
          dryPoint: 2,
          fieldCapacity: 0,
          wiltPoint: 0,
          saturatedSoilWeight: 0,
          drySoilWeight: 0,
          saturatedVolume: 0,
          slope: 0,
          offset: 0,
        },
        {
          soilType: "0",
          dryPoint: 3,
          fieldCapacity: 0,
          wiltPoint: 0,
          saturatedSoilWeight: 0,
          drySoilWeight: 0,
          saturatedVolume: 0,
          slope: 0,
          offset: 0,
        },
        {
          soilType: "0",
          dryPoint: 4,
          fieldCapacity: 0,
          wiltPoint: 0,
          saturatedSoilWeight: 0,
          drySoilWeight: 0,
          saturatedVolume: 0,
          slope: 0,
          offset: 0,
        },
        {
          soilType: "0",
          dryPoint: 5,
          fieldCapacity: 0,
          wiltPoint: 0,
          saturatedSoilWeight: 0,
          drySoilWeight: 0,
          saturatedVolume: 0,
          slope: 0,
          offset: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sensors",
  });

  // ---------------------------------------------------------------------------
  // Derived Values
  // ---------------------------------------------------------------------------
  // Convert the selected sensor from string to array index
  const sensorIndex = Number(selectedSensor);
  const currentSoilType = useWatch({control: form.control, name:`sensors.${sensorIndex}.soilType`});
  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------
  function onSubmit() {
    console.log("SUBMITTED");
  }

  function handleSoilTypeChange(value: string) {
    const defaults = soilTypeDefaults[value];

    if (!defaults) {
      return;
    }

    const { dryPoint, fieldCapacity, wiltPoint } = defaults;

    const { slope, offset } = calculateCalibrationValues(
      dryPoint,
      fieldCapacity,
    );

    const sensor = form.getValues(`sensors.${sensorIndex}`);

    form.setValue(`sensors.${sensorIndex}`, {
      ...sensor,
      soilType: value,
      dryPoint,
      fieldCapacity,
      wiltPoint,
      slope,
      offset,
    });
  }

  // ---------------------------------------------------------------------------
  // Helper Functions
  // ---------------------------------------------------------------------------
  function calculateCalibrationValues(dryPoint: number, fieldCapacity: number) {
    const slope = (100 / ((dryPoint/100)-(fieldCapacity/100)));
    const offset = 0 - slope * (dryPoint/100 / 100);
    return {
      slope: Number(slope.toFixed(4)),
      offset: Number(offset.toFixed(4)),
    };
  }

  function getFormState(calibrationType: boolean, calculationMethod: boolean) {
    if (!calibrationType && !calculationMethod) {
      return {
        soilFieldDisabled: true,
        dryPointFcFieldsDisabled: true,
        slopeOffsetFieldDisabled: true,
      };
    }

    if (!calibrationType && calculationMethod) {
      return {
        soilFieldDisabled: true,
        dryPointFcFieldsDisabled: false,
        slopeOffsetFieldDisabled: false,
      };
    }

    if (calibrationType && !calculationMethod) {
      return {
        soilFieldDisabled: false,
        dryPointFcFieldsDisabled: false,
        slopeOffsetFieldDisabled: true,
      };
    }

    return {
      soilFieldDisabled: true,
      dryPointFcFieldsDisabled: false,
      slopeOffsetFieldDisabled: false,
    };
  }

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!calibrationType) {
      form.setValue("units", "0");
    }
  }, [calibrationType, form]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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
        Moisture Calibration
      </h2>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Logger ID: <strong className="font-medium text-foreground">{selectedLoggerId}</strong>
        </span>
        <span>
          UID: <strong className="font-medium text-foreground">{selectedLoggerUid}</strong>
        </span>
        <span>
          Type: <strong className="font-medium text-foreground">{loggerTypeId}</strong>
        </span>
      </div>
    </div>

    {/* Calibration Settings */}
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold">Calibration Settings</h3>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {/* Sensor */}
        <div className="md:col-span-2">
          <FormSelect
            name="sensorSelector"
            label="Sensor"
            options={[
              { value: "0", label: "Sensor 1" },
              { value: "1", label: "Sensor 2" },
              { value: "2", label: "Sensor 3" },
              { value: "3", label: "Sensor 4" },
              { value: "4", label: "Sensor 5" },
            ]}
            value={selectedSensor}
            onValueChange={setSelectedSensor}
          />
        </div>

        {/* Units */}
        <Controller
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormSelect
              name={field.name}
              label="Units"
              options={[
                { value: "0", label: "%" },
                { value: "1", label: "mm" },
              ]}
              value={field.value}
              onValueChange={field.onChange}
              disabled={!calibrationType}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
        <FormSwitch
          name="calType"
          label="Calibration Type"
          checked={calibrationType}
          onCheckedChange={setCalibrationType}
          checkedLabel="Volumetric"
          uncheckedLabel="% of Saturation"
        />

        <FormSwitch
          name="calcMethod"
          label="Calculation Method"
          checked={calculationMethod}
          onCheckedChange={setCalculationMethod}
          checkedLabel="User Defined"
          uncheckedLabel="Calculated"
        />
      </div>
    </section>

    {/* Selected Sensor Details */}
    {fields[sensorIndex] && (
      <div className="space-y-4">
        {/* Soil Parameters */}
        <section
          key={fields[sensorIndex].id}
          className="rounded-lg border bg-card p-4 space-y-4"
        >
          <h3 className="text-sm font-semibold">Soil Parameters</h3>

          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Controller
              control={form.control}
              name={`sensors.${sensorIndex}.soilType`}
              render={({ field }) => (
                <FormSelect
                  name={field.name}
                  label="Soil Type"
                  options={[
                    { value: "1", label: "Sand" },
                    { value: "2", label: "Loamy Sand" },
                    { value: "3", label: "Sandy Loam" },
                    { value: "4", label: "Loam" },
                    { value: "5", label: "Silt Loam" },
                    { value: "6", label: "Silt" },
                    { value: "7", label: "Sandy Clay Loam" },
                    { value: "8", label: "Clay Loam" },
                    { value: "9", label: "Silt Clay Loam" },
                    { value: "10", label: "Silt Clay" },
                    { value: "11", label: "Sand Clay" },
                    { value: "12", label: "Clay" },
                    { value: "13", label: "Custom" },
                    { value: "14", label: "Soil Test" },
                  ]}
                  value={String(field.value)}
                  onValueChange={handleSoilTypeChange}
                />
              )}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.dryPoint`}
              label="Dry Point"
              control={form.control}
              placeholder="Enter value"
              disabled={currentSoilType !== "13"}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.fieldCapacity`}
              label="Field Capacity"
              control={form.control}
              placeholder="Enter value"
              disabled={currentSoilType !== "13"}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.wiltPoint`}
              label="Wilt Point"
              control={form.control}
              placeholder="Enter value"
            />
          </div>
        </section>

        {/* Soil Measurements and Coefficients */}
        <section className="rounded-lg border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold">
            Measurements & Calibration Coefficients
          </h3>

          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormNumberField
              name={`sensors.${sensorIndex}.saturatedSoilWeight`}
              label="Saturated Soil Weight"
              control={form.control}
              placeholder="Enter value"
              disabled={formState.soilFieldDisabled}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.drySoilWeight`}
              label="Dry Soil Weight"
              control={form.control}
              placeholder="Enter value"
              disabled={formState.soilFieldDisabled}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.saturatedVolume`}
              label="Saturated Volume"
              control={form.control}
              placeholder="Enter value"
              disabled={formState.soilFieldDisabled}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.slope`}
              label="Slope"
              control={form.control}
              placeholder="Enter value"
              disabled={formState.slopeOffsetFieldDisabled}
            />

            <FormNumberField
              name={`sensors.${sensorIndex}.offset`}
              label="Offset"
              control={form.control}
              placeholder="Enter value"
              disabled={formState.slopeOffsetFieldDisabled}
            />
          </div>
        </section>
      </div>
    )}

    {/* Save */}
    <div className="flex justify-end border-t pt-4">
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        Save Calibration
      </button>
    </div>
  </form>
);
}
