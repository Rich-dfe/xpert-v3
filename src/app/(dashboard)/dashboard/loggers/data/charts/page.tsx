"use client";

import { useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import ChartForm from "@/components/built-forms/ChartForm";
import ChartContainer, { sensors } from "@/components/ChartContainer";
import { useFetchPrimaryChartData } from "@/hooks/useData";
import { ChartFormValues } from "@/schemas/chartFormSchema";
import { LoggerChartResponse } from "@/types/chart";
import { Spinner } from "@/components/ui/spinner";

const loggerColors: Record<
  number,
  { channel1: string; channel2?: string }
> = {
  4131: {
    channel1: "#25a2eb",
    channel2: "#dc5d26",
  },
  4132: {
    channel1: "#ead308",
    channel2: "#dc5d26",
  },
  4137: {
    channel1: "#ead308",
    channel2: "#dc5d26",
  },
  4161: {
    channel1: "#07ad28",
    channel2: "#dc5d26",
  },
  4181: {
    channel1: "#dc9d26",
    channel2: "#dc5d26",
  },
  4294: {
    channel1: "#dc9d26",
    channel2: "#dc5d26",
  }
};

const defaultColors = {
  channel1: "#2563eb",
  channel2: "#dc2626",
};

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

  const currentLoggerType = chartData?.readings?.[0]?.type;
  const colors = loggerColors[currentLoggerType ?? 0] ?? defaultColors;

  const availableSensors = chartData?.readings?.length
    ? [4131,4132,4137,4161,4181,4294].includes(chartData.readings[0].type)
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

            <ChartContainer data={chartData} sensorId={sensor.id} colors={colors} />
          </div>
        ))}
      </div>
    </div>
  );
}
