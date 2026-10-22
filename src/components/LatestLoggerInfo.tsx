"use client";

import { useApplicationContext } from "@/context/ApplicationContext";
import { useFetchLatestDiagnosticData, useFetchGeneralLoggerInfo } from "@/hooks/useLogger";
import {
  Settings,
  BatteryIcon,
  BatteryMediumIcon,
  Signal,
  RotateCcw,
  CalendarClock,
} from "lucide-react";

export default function LatestLoggerInfo() {
  //////////////////////////////////////////////////////////////////////////////
  // Context
  //////////////////////////////////////////////////////////////////////////////
  const { selectedLoggerUid, selectedLoggerId } = useApplicationContext();

  const {
    data: latestDiagnosticData,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useFetchLatestDiagnosticData(selectedLoggerUid);

const {
    data: generalInfoData,
    isLoading: isFetchInfoLoading,
    isError: isFetchInfoError,
    error: fetchInfoError,
  } = useFetchGeneralLoggerInfo(selectedLoggerId);

  console.log("LATEST INFO", generalInfoData);

  const latestInfoDate = latestDiagnosticData?.createdAt;
  const printDate = latestInfoDate
    ? new Date(latestInfoDate).toLocaleString("en-NZ", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No date available";

  ///////////////////////////////////////////////
  //BATTERY STATUS CALCULATIONS
  //////////////////////////////////////////////
  const batteryStatus = latestDiagnosticData?.diagnostics?.find(
    (item) => item.type === 4099,
  );
  const batteryVoltage = batteryStatus?.data1;

  const calculatedBatteryPercentage =
  batteryVoltage != null
    ? Math.min((batteryVoltage / 1000 - 2) * 100, 100)
    : null;

const batteryPercentage =
  calculatedBatteryPercentage != null
    ? Math.floor(calculatedBatteryPercentage * 100) / 100
    : "";

  const batteryRemainingLife = batteryStatus?.data2;

  /////////////////////////////////////////////////////

  const restarts = latestDiagnosticData?.diagnostics?.find(
    (item) => item.type === 4101,
  );
  const restartData1 = restarts?.data1;

  const rssi = latestDiagnosticData?.diagnostics?.find((item) => item.type === 4100);
  const rssiData1 = rssi?.data1;
  const rssiData2 = rssi?.data2;
  const rssiCalculated = rssiData1
    ? -32768 + (rssiData1 - 32768)
    : "";

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Logger Information */}
        <section className="rounded-lg border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold">
            {isFetchLoading ? "Loading..." : `Recorded - ${printDate}`}
          </h3>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BatteryMediumIcon className="h-4 w-4 shrink-0" />
                Battery Capacity
              </span>
              <span className="font-medium">{batteryPercentage}%</span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="h-4 w-4 shrink-0" />
                Remaining Battery Life
              </span>
              <span className="font-medium">
                {batteryRemainingLife != null
                  ? `${batteryRemainingLife} Days`
                  : ""}
              </span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BatteryIcon className="h-4 w-4 shrink-0" />
                Battery Voltage
              </span>
              <span className="font-medium">
                {batteryVoltage != null ? `${batteryVoltage / 1000}V` : ""}
              </span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Signal className="h-4 w-4 shrink-0" />
                RSSI
              </span>
              <span className="font-medium">{rssiCalculated}</span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4 shrink-0" />
                Restarts
              </span>
              <span className="font-medium">
                {restarts != null ? `${restartData1}` : ""}
              </span>
            </li>
          </ul>
        </section>

        {/* Calibration Information */}
        <section className="rounded-lg border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold">General Information</h3>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4 shrink-0" />
                Name
              </span>
              <span className="font-medium">{generalInfoData ? generalInfoData[0].loggerName : ""}</span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4 shrink-0" />
                Product
              </span>
              <span className="font-medium">{generalInfoData ? generalInfoData[0].productName : ""}</span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4 shrink-0" />
                Model
              </span>
              <span className="font-medium">{generalInfoData ? generalInfoData[0].model : ""}</span>
            </li>

            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4 shrink-0" />
                Firmware Version
              </span>
              <span className="font-medium">{generalInfoData ? generalInfoData[0].firmwareVersionInUse /100 : ""}</span>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
