"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { X } from "lucide-react";

import { LoggerChartResponse } from "@/types/chart";
import { exportCSV } from "@/lib/exportCsv";
import { useApplicationContext } from "@/context/ApplicationContext";

interface LoggerChartProps {
  data?: LoggerChartResponse;
  sensorId: number;
  colors?: {
    channel1: string;
    channel2?: string;
  };
}

export const sensors = [
  { id: 1, channel1: "s1", channel2: "s1t" },
  { id: 2, channel1: "s2", channel2: "s2t" },
  { id: 3, channel1: "s3", channel2: "s3t" },
  { id: 4, channel1: "s4", channel2: "s4t" },
  { id: 5, channel1: "s5", channel2: "s5t" },
  { id: 6, channel1: "s11t", channel2: null },
];

const STANDARD_LOGGER_TYPES = [4131, 4132, 4137, 4161, 4181, 4294];

interface ProcessingMetadata {
  downsampled: boolean;
  algorithm: string;
  originalPoints: number;
  resultingPoints: number;
  reductionPercentage: number;
}

interface ProcessingMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProcessingMetadata;
}

// Processing Metadata Modal
function ProcessingMetadataModal({
  isOpen,
  onClose,
  metadata,
}: ProcessingMetadataModalProps) {
  if (!isOpen) return null;

  const rows = [
    {
      label: "Downsampled",
      value: metadata.downsampled ? "Yes" : "No",
    },
    {
      label: "Algorithm",
      value: metadata.algorithm,
    },
    {
      label: "Original points",
      value: metadata.originalPoints.toLocaleString(),
    },
    {
      label: "Resulting points",
      value: metadata.resultingPoints.toLocaleString(),
    },
    {
      label: "Reduction",
      value: `${metadata.reductionPercentage.toFixed(2)}%`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Processing Metadata
          </h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metadata */}
        <div className="divide-y px-5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-gray-500">{row.label}</span>

              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Logger Chart
export default function LoggerChart({
  data,
  sensorId,
  colors = {
    channel1: "#2563eb",
    channel2: "#dc2626",
  },
}: LoggerChartProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const loggerType = data?.readings?.[0]?.type;

  const { selectedLoggerUidHex, selectedLoggerName } = useApplicationContext();

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

  const dataPointCount = data.readings.length;

  // Measurement information
  const primaryMeasurement = data.measurements.find(
    (measurement) => measurement.field === channel1,
  );

  const secondaryMeasurement = channel2
    ? data.measurements.find((measurement) => measurement.field === channel2)
    : undefined;

  // CSV Download
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

    exportCSV({
      filename: `logger-${selectedLoggerUidHex}-${timestamp}.csv`,
      headers,
      rows,
    });
  }

  // Primary series
  const series = [
    {
      name: primaryMeasurement?.name ?? `Sensor ${sensorId} Channel 1`,
      type: "line" as const,
      color: colors.channel1,
      yAxisIndex: 0,
      showSymbol: false,
      sampling: "lttb" as const,
      smooth: false,
      data: data.readings.map((reading) => [
        reading.logDateTime * 1000,
        reading[channel1 as keyof typeof reading],
      ]),
    },
  ];

  // Secondary series
  if (channel2) {
    series.push({
      name: secondaryMeasurement?.name ?? `Sensor ${sensorId} Channel 2`,
      type: "line" as const,
      color: colors.channel2 ?? "#dc2626",
      yAxisIndex: 1,
      showSymbol: false,
      sampling: "lttb" as const,
      smooth: false,
      data: data.readings.map((reading) => [
        reading.logDateTime * 1000,
        reading[channel2 as keyof typeof reading],
      ]),
    });
  }

  // ECharts options
  const option = {
    title: {
      text: selectedLoggerName,
      left: "center",
      top: 30,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      },
    },

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
              type: "value" as const,
              name: `${secondaryMeasurement?.name ?? "Channel 2"} (${secondaryMeasurement?.defaultUnit ?? ""})`,
              nameLocation: "middle" as const,
              nameGap: 55,
              nameTextStyle: {
                fontWeight: "bold",
                fontSize: 14,
              },
              position: "right" as const,
              scale: true,
              axisLabel: {
                fontSize: 11,
              },
            },
          ]
        : []),
    ],

    dataZoom: [{ type: "inside" }, { type: "slider" }],

    series,
  };

  return (
    <div className="w-full rounded-lg border bg-white p-4">
      {/* Chart Header */}
      <div className="text-sm text-gray-600">
        Data points: <strong>{dataPointCount.toLocaleString()}</strong>
      </div>

      {/* CSV Download */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleDownloadCSV}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>

      {/* Chart and Information Button */}
      <div className="relative">
        <ReactECharts
          option={option}
          style={{
            height: "600px",
            width: "100%",
          }}
          notMerge={true}
          lazyUpdate={true}
        />

        {/* Information Button */}
        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          title="Processing Metadata"
          aria-label="View processing metadata"
          className="
    absolute left-[5px] top-[5px] z-20
    flex h-9 w-9 items-center justify-center
    rounded-full
    bg-blue-600
    text-white
    shadow-md
    ring-2 ring-white
    transition-all duration-200
    hover:bg-blue-700
    hover:scale-110
    hover:shadow-lg
    focus:outline-none
    focus:ring-4 focus:ring-blue-300
  "
        >
          <span className="text-lg font-bold">i</span>
        </button>
      </div>

      {/* Processing Metadata Modal */}
      {data.metadata && (
        <ProcessingMetadataModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          metadata={data.metadata}
        />
      )}
    </div>
  );
}
