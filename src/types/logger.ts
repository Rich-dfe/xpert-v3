import { LoggerConfigSettingValues } from "@/schemas/loggerConfigSettings";

export interface LoggerListSelect {
    id: number;
    loggerName: string | null;
    productId: number;
    loggerUid: number;
}

export type UpdateLoggerConfigSettingsPayload =
  Omit<LoggerConfigSettingValues, "startDate" | "stopDate"> & {
    startDate: number;
    stopDate: number;
    loggerId: string;
  };