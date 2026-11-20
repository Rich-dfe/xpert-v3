import { LoggerChartResponse } from "@/types/chart";

interface LoggerChartProps {
  data?: LoggerChartResponse;
  sensorId: number;
  colors?: {
    channel1: string;
    channel2?: string;
  };
}

export default function ChartContainerWiper({
  data,
  sensorId,
  colors = {
    channel1: "#2563eb",
    channel2: "#dc2626",
  },
}: LoggerChartProps) {
  return (
    <>
      <div>WIPER CHARTS</div>
    </>
  );
}
