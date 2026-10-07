"use client";

import { useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  CalibrationMptSensor,
  calibrationSettingsMptProbeSchema,
} from "@/schemas/calibrationSettingsSchema";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../forms/FormSelect";
import { FormNumberField } from "../forms/FormNumberField";

export default function CalibrationSettingsMpt() {
  const { selectedLoggerId, loggerTypeId, selectedLoggerUid } =
    useApplicationContext();

  // Currently selected sensor
  const [selectedSensor, setSelectedSensor] = useState("0");

  const soilTypeDefaults: Record<
    string,
    {
      dryPoint: number;
      fieldCapacity: number;
    }
  > = {
    "1": {
      dryPoint: 10,
      fieldCapacity: 25,
    },
    "2": {
      dryPoint: 12,
      fieldCapacity: 30,
    },
    "3": {
      dryPoint: 15,
      fieldCapacity: 35,
    },
    "4": {
      dryPoint: 18,
      fieldCapacity: 40,
    },
    "5": {
      dryPoint: 20,
      fieldCapacity: 45,
    },
    "6": {
      dryPoint: 22,
      fieldCapacity: 48,
    },
    "7": {
      dryPoint: 17,
      fieldCapacity: 38,
    },
    "8": {
      dryPoint: 21,
      fieldCapacity: 43,
    },
    "9": {
      dryPoint: 23,
      fieldCapacity: 46,
    },
    "10": {
      dryPoint: 25,
      fieldCapacity: 50,
    },
    "11": {
      dryPoint: 22,
      fieldCapacity: 44,
    },
    "12": {
      dryPoint: 27,
      fieldCapacity: 52,
    },
  };

  const form = useForm<CalibrationMptSensor>({
    resolver: zodResolver(calibrationSettingsMptProbeSchema),
    defaultValues: {
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

  function onSubmit() {
    console.log("SUBMITTED");
  }

  // Convert the selected sensor from string to array index
  const sensorIndex = Number(selectedSensor);

  const currentSoilType = form.watch(`sensors.${sensorIndex}.soilType`);

  function handleSoilTypeChange(value: string) {
    form.setValue(`sensors.${sensorIndex}.soilType`, value);

    const defaults = soilTypeDefaults[value];

    if (!defaults) {
      return;
    }

    const { dryPoint, fieldCapacity } = defaults;

    form.setValue(`sensors.${sensorIndex}.dryPoint`, defaults.dryPoint);

    form.setValue(
      `sensors.${sensorIndex}.fieldCapacity`,
      defaults.fieldCapacity,
    );

    //Calculate the slope and offet values
    const calculated = calculateCalibrationValues(
    dryPoint,
    fieldCapacity
  );

  //Populate the slope and offset values
  form.setValue(
    `sensors.${sensorIndex}.slope`,
    calculated.slope
  );

  form.setValue(
    `sensors.${sensorIndex}.offset`,
    calculated.offset
  );
  }

  function calculateCalibrationValues(dryPoint: number, fieldCapacity: number) {
    return {
      slope: dryPoint * 2,
      offset: fieldCapacity * 2,
    };
  }

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
      <div className="max-w-xs">
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
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormNumberField
              name={`sensors.${sensorIndex}.drySoilWeight`}
              label="Dry Soil Weight"
              control={form.control}
              placeholder="Enter Value"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormNumberField
              name={`sensors.${sensorIndex}.saturatedVolume`}
              label="Saturated Volume"
              control={form.control}
              placeholder="Enter Value"
            />
          </div>

          {/* Row 3 - 2 fields */}
          <div className="col-span-12 md:col-span-6">
            <FormNumberField
              name={`sensors.${sensorIndex}.slope`}
              label="Slope"
              control={form.control}
              placeholder="Enter Value"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormNumberField
              name={`sensors.${sensorIndex}.offset`}
              label="Offset"
              control={form.control}
              placeholder="Enter Value"
            />
          </div>
        </div>
      )}

      <button type="submit">Save Calibration</button>
    </form>
  );
}
