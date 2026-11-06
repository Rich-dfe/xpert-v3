"use client";

import ReactECharts from "echarts-for-react";
import { LoggerChartResponse } from "@/types/chart";

interface LoggerChartProps {
  data?: LoggerChartResponse;
  sensorId: number;
}

export const sensors = [
  { id: 1, channel1: "s1", channel2: "s1t" },
  { id: 2, channel1: "s2", channel2: "s2t" },
  { id: 3, channel1: "s3", channel2: "s3t" },
  { id: 4, channel1: "s4", channel2: "s4t" },
  { id: 5, channel1: "s5", channel2: "s5t" },
  { id: 6, channel1: "s11t", channel2: null },
];

const STANDARD_LOGGER_TYPE = 4131;

function hasSensorReadings(
  readings: LoggerChartResponse["readings"],
  sensor: (typeof sensors)[number],
) {
  return readings.some((reading) => {
    const channel1Value = reading[sensor.channel1 as keyof typeof reading];

    const channel2Value = sensor.channel2
      ? reading[sensor.channel2 as keyof typeof reading]
      : null;

    return channel1Value != null || channel2Value != null;
  });
}

export default function LoggerChart({ data, sensorId }: LoggerChartProps) {
  const isStandardLogger = data?.readings?.[0]?.type === STANDARD_LOGGER_TYPE;

  const sensor = sensors.find((s) => s.id === sensorId);

  const channel1 = isStandardLogger ? "data1" : sensor?.channel1;

  const channel2 = isStandardLogger ? "data2" : sensor?.channel2;

  if (!sensor) {
    return <div>Invalid sensor selection.</div>;
  }

  if (!data?.readings?.length || !data?.measurements?.length) {
    return (
      <div className="w-full rounded-lg border bg-card p-4">
        No logger readings available.
      </div>
    );
  }

  // Get measurement information for the selected sensor.
  const primaryMeasurement = data.measurements.find(
    (measurement) => measurement.field === channel1,
  );

  const secondaryMeasurement = sensor.channel2
    ? data.measurements.find((measurement) => measurement.field === channel2)
    : undefined;

  // Create the primary chart series.
  const series = [
    {
      name: primaryMeasurement?.name ?? `Sensor ${sensorId} Channel 1`,
      type: "line",
      yAxisIndex: 0,
      showSymbol: false,
      data: data.readings.map((reading) => [
        reading.logDateTime * 1000,
        reading[channel1 as keyof typeof reading],
      ]),
    },
  ];

  if (channel2) {
    series.push({
      name: secondaryMeasurement?.name ?? `Sensor ${sensorId} Channel 2`,
      type: "line",
      yAxisIndex: 1,
      showSymbol: false,
      data: data.readings.map((reading) => [
        reading.logDateTime * 1000,
        reading[channel2 as keyof typeof reading],
      ]),
    });
  }

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const date = new Date(params[0].value[0]);

        const formattedDate = date.toLocaleString("en-NZ", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        return `${formattedDate}<br/>${params
          .map((item: any) => {
            return `${item.marker} ${item.seriesName}: ${item.value[1]}`;
          })
          .join("<br/>")}`;
      },
    },

    toolbox: {
      show: true,
      right: 20,
      top: 10,
      feature: {
        dataView: {
          show: true,
          readOnly: true,
          title: "View Data",
        },
        saveAsImage: {
          show: true,
          type: "png",
          name: "logger-chart",
          title: "Save Chart",
          pixelRatio: 2,
        },
        restore: {
          show: true,
          title: "Reset Chart",
        },
      },
    },

    backgroundColor: "#ffffff",

    legend: {
      top: 10,
    },

    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },

    xAxis: {
      type: "time",
      name: "Date / Time",
    },

    yAxis: [
      {
        type: "value",
        name: `${primaryMeasurement?.name ?? "Channel 1"} (${primaryMeasurement?.defaultUnit ?? ""})`,
        nameLocation: "middle",
        nameGap: 55,
        nameTextStyle: {
          fontWeight: "bold",
          fontSize: 14,
        },
        position: "left",
        scale: true,
        axisLabel: {
          fontSize: 11,
        },
      },

      ...(channel2
        ? [
            {
              type: "value",
              name: `${secondaryMeasurement?.name ?? "Channel 2"} (${secondaryMeasurement?.defaultUnit ?? ""})`,
              nameLocation: "middle",
              nameGap: 55,
              nameTextStyle: {
                fontWeight: "bold",
                fontSize: 14,
              },
              position: "right",
              scale: true,
              axisLabel: {
                fontSize: 11,
              },
            },
          ]
        : []),
    ],

    dataZoom: [
      {
        type: "inside",
      },
      {
        type: "slider",
      },
    ],

    series,
  };

  return (
    <div className="w-full rounded-lg border bg-white p-4">
      <ReactECharts
        option={option}
        style={{
          height: "600px",
          width: "100%",
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
