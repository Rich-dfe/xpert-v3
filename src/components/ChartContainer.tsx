"use client";

import ReactECharts from "echarts-for-react";
import { LoggerChartResponse } from "@/types/chart";
import { exportCSV } from "@/lib/exportCsv";

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

const STANDARD_LOGGER_TYPES = [4131];

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
  const loggerType = data?.readings?.[0]?.type;

  const isStandardLogger =
    loggerType !== undefined && STANDARD_LOGGER_TYPES.includes(loggerType);

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

  //Get the number of data points
  const dataPointCount = data?.readings?.length ?? 0;

  // Get measurement information for the selected sensor.
  const primaryMeasurement = data.measurements.find(
    (measurement) => measurement.field === channel1,
  );

  const secondaryMeasurement = sensor.channel2
    ? data.measurements.find((measurement) => measurement.field === channel2)
    : undefined;

  ///////////////////////////////////////////////
  // CSV Download Code
  //////////////////////////////////////////////
  function handleDownloadCSV() {
    if (!data?.readings?.length || !channel1) return;

    const headers = [
      "Date / Time",
      primaryMeasurement?.name ?? "Channel 1",
      ...(channel2 ? [secondaryMeasurement?.name ?? "Channel 2"] : []),
    ];

    const rows = data.readings.map((reading) => {
      const primaryValue = reading[channel1 as keyof typeof reading];

      const secondaryValue = channel2
        ? reading[channel2 as keyof typeof reading]
        : undefined;

      return [
        new Date(reading.logDateTime * 1000).toISOString(),
        primaryValue == null ? "" : String(primaryValue),
        ...(channel2
          ? [secondaryValue == null ? "" : String(secondaryValue)]
          : []),
      ];
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\.\d{3}Z$/, "");

      const loggerUidHex = Number(data.readings[0].loggerUid).toString(16);

    exportCSV({
      filename: `logger-${loggerUidHex}-${timestamp}.csv`,
      headers,
      rows,
    });
  }
  ///////////////////////////////////////////////
  // CSV Download Code
  //////////////////////////////////////////////

  // Create the primary chart series.
  const series = [
    {
      name: primaryMeasurement?.name ?? `Sensor ${sensorId} Channel 1`,
      type: "line",
      yAxisIndex: 0,
      showSymbol: false,
      sampling: "lttb",
      smooth: false,
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
      sampling: "lttb",
      smooth: false,
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

    animation: false,
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
      <div className="text-sm text-gray-600">
        Data points: <strong>{dataPointCount.toLocaleString()}</strong>
      </div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleDownloadCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>

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
