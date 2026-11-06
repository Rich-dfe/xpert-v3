'use client'

import { useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import ChartForm from "@/components/built-forms/ChartForm";
import ChartContainer from "@/components/ChartContainer";
import { useFetchPrimaryChartData } from "@/hooks/useData";
import { ChartFormValues } from "@/schemas/chartFormSchema";
import { LoggerChartResponse } from "@/types/chart";

export default function ChartsPage() {
const {
  selectedLoggerId,
  selectedLoggerUid,
  loggerTypeId
} = useApplicationContext();

// Store the selected date range as Unix timestamps.
  const [dateRange, setDateRange] = useState<{
    start: number;
    end: number;
  } | undefined>(undefined);

  const {
    data: chartData,
    isLoading,
    isError,
    error,
  } = useFetchPrimaryChartData(
    selectedLoggerUid,
    loggerTypeId,
    dateRange?.start,
    dateRange?.end
  )

  function handleFormSubmit(values: ChartFormValues) {
    if (!values.startDate || !values.stopDate) {
    return;
  }

  setDateRange({
    start: values.startDate
      ? Math.floor(values.startDate.getTime() / 1000)
      : 0,

    end: values.stopDate
      ? Math.floor(values.stopDate.getTime() / 1000)
      : 0,
  });
}


  return (
    <div>
      <h1>Charts {selectedLoggerId}</h1>
      <ChartForm onSubmit={handleFormSubmit}/>
      <ChartContainer data={chartData} sensorId={1}/>
    </div>
  );
}