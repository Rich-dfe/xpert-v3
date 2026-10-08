"use client";

import { useState, useEffect } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  CalibrationMptSensor,
  calibrationSettingsMptProbeSchema,
} from "@/schemas/calibrationSettingsSchema";
import { useFieldArray, useForm, Controller } from "react-hook-form";
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
  const currentSoilType = form.watch(`sensors.${sensorIndex}.soilType`);

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
    return {
      slope: dryPoint * 2,
      offset: fieldCapacity * 2,
    };
  }

  function getFormState(calibrationType: boolean, calculationMethod: boolean) {
    if (!calibrationType && !calculationMethod) {
      return {
        soilFieldDisabled: true,
        slopeOffsetFieldDisabled: true,
      };
    }

    if (!calibrationType && calculationMethod) {
      return {
        soilFieldDisabled: true,
        slopeOffsetFieldDisabled: false,
      };
    }

    if (calibrationType && !calculationMethod) {
      return {
        soilFieldDisabled: false,
        slopeOffsetFieldDisabled: true,
      };
    }

    return {
      soilFieldDisabled: true,
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
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h5>Moisture Calibration</h5>
      </div>

      <div>
        {selectedLoggerId} - {selectedLoggerUid} - {loggerTypeId}
      </div>

      {/* Sensor selector */}
      <div className="col-span-12 md:col-span-3">
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
          onValueChange={(value) => setSelectedSensor(value)}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <FormSwitch
          name="calType"
          label="Calibration Type"
          checked={calibrationType}
          onCheckedChange={setCalibrationType}
          checkedLabel="Volumetric"
          uncheckedLabel="% of Saturation"
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <FormSwitch
          name="calcMethod"
          label="Calculation Method"
          checked={calculationMethod}
          onCheckedChange={setCalculationMethod}
          checkedLabel="User Defined"
          uncheckedLabel="Calculated"
        />
      </div>
      <div className="col-span-12 md:col-span-3">
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
      <Separator />
      {/* Currently selected sensor */}
      {fields[sensorIndex] && (
        <div
          key={fields[sensorIndex].id}
          className="grid grid-cols-12 gap-6 items-start"
        >
          {/* Row 1 - 4 fields */}
          <div className="col-span-12 md:col-span-3">
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
          </div>

          <div className="col-span-12 md:col-span-3">
            <FormNumberField
              name={`sensors.${sensorIndex}.dryPoint`}
              label="Dry Point"
              control={form.control}
              placeholder="Enter Value"
              disabled={currentSoilType !== "13"}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <FormNumberField
              name={`sensors.${sensorIndex}.fieldCapacity`}
              label="Field Capacity"
              control={form.control}
              placeholder="Enter Value"
              disabled={currentSoilType !== "13"}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <FormNumberField
              name={`sensors.${sensorIndex}.wiltPoint`}
              label="Wilt Point"
              control={form.control}
              placeholder="Enter Value"
            />
          </div>

          {/* Row 2 - 3 fields */}
          <div className="col-span-12 md:col-span-4">
            <FormNumberField
              name={`sensors.${sensorIndex}.saturatedSoilWeight`}
              label="Saturated Soil Weight"
              control={form.control}
              placeholder="Enter Value"
              disabled={formState.soilFieldDisabled}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormNumberField
              name={`sensors.${sensorIndex}.drySoilWeight`}
              label="Dry Soil Weight"
              control={form.control}
              placeholder="Enter Value"
              disabled={formState.soilFieldDisabled}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormNumberField
              name={`sensors.${sensorIndex}.saturatedVolume`}
              label="Saturated Volume"
              control={form.control}
              placeholder="Enter Value"
              disabled={formState.soilFieldDisabled}
            />
          </div>

          {/* Row 3 - 2 fields */}
          <div className="col-span-12 md:col-span-6">
            <FormNumberField
              name={`sensors.${sensorIndex}.slope`}
              label="Slope"
              control={form.control}
              placeholder="Enter Value"
              disabled={formState.slopeOffsetFieldDisabled}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormNumberField
              name={`sensors.${sensorIndex}.offset`}
              label="Offset"
              control={form.control}
              placeholder="Enter Value"
              disabled={formState.slopeOffsetFieldDisabled}
            />
          </div>
        </div>
      )}

      <button type="submit">Save Calibration</button>
    </form>
  );
}
