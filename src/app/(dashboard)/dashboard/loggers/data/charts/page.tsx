"use client";

import { useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import ChartForm from "@/components/built-forms/ChartForm";
import ChartContainer, { sensors } from "@/components/ChartContainer";
import { useFetchPrimaryChartData } from "@/hooks/useData";
import { ChartFormValues } from "@/schemas/chartFormSchema";
import { LoggerChartResponse } from "@/types/chart";
import { Spinner } from "@/components/ui/spinner";

export default function ChartsPage() {
  const { selectedLoggerId, selectedLoggerUid, loggerTypeId } =
    useApplicationContext();

  // Store the selected date range as Unix timestamps.
  const [dateRange, setDateRange] = useState<
    | {
        start: number;
        end: number;
      }
    | undefined
  >(undefined);

  const {
    data: chartData,
    isLoading,
    isError,
    error,
  } = useFetchPrimaryChartData(
    selectedLoggerUid,
    loggerTypeId,
    dateRange?.start,
    dateRange?.end,
  );

  const availableSensors = chartData?.readings?.length
    ? [4131].includes(chartData.readings[0].type)
      ? [sensors[0]]
      : sensors.filter((sensor) =>
          chartData.readings.some((reading) => {
            const channel1Value =
              reading[sensor.channel1 as keyof typeof reading];

            const channel2Value = sensor.channel2
              ? reading[sensor.channel2 as keyof typeof reading]
              : null;

            return channel1Value != null || channel2Value != null;
          }),
        )
    : [];

  function handleFormSubmit(values: ChartFormValues) {
    if (!values.startDate || !values.stopDate) {
      return;
    }

    setDateRange({
      start: values.startDate
        ? Math.floor(values.startDate.getTime() / 1000)
        : 0,

      end: values.stopDate ? Math.floor(values.stopDate.getTime() / 1000) : 0,
    });
  }

  return (
    <div>
      <h1>Charts</h1>
      <ChartForm onSubmit={handleFormSubmit} />
      {isLoading && <p>Loading chart data... <Spinner /></p>}

      {isError && (
        <p className="text-red-500">
          Failed to load chart data: {error?.message}
        </p>
      )}
      <div className="space-y-6">
        {availableSensors.map((sensor) => (
          <div key={sensor.id}>
            
            <h2 className="mb-2 text-lg font-semibold">Sensor {sensor.id}</h2>

            <ChartContainer data={chartData} sensorId={sensor.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
