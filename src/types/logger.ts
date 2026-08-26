import { LoggerConfigSettingValues } from "@/schemas/loggerConfigSettings";

export interface LoggerListSelect {
    id: number;
    loggerName: string | null;
    productId: number;
    loggerUid: number | null;
}

export type UpdateLoggerConfigSettingsPayload =
  Omit<LoggerConfigSettingValues, "startDate" | "stopDate"> & {
    startDate: number;
    stopDate: number;
    loggerId: string;
    loggerUid: number | null;
    groupId?: string;
  };

  export type LoggerConfigSettingsResponse =
  Omit<LoggerConfigSettingValues, "startDate" | "stopDate"> & {
    startDate: number;
    stopDate: number;
    loggerId: string;
    loggerUid: number | null;
    groupId?: string;
    loggerSettingsVersion: number;
    typeId: number;
  };

  export type SensorConfigSettingsResponse = {
    sensorSetting: string
  } 

  export type UpdateSensorConfigSettingsPayload = {
    sensorSetting: string,
    typeId: number | null,
    loggerUid: number | null,
    loggerId:string
  } 