import { LoggerConfigSettingValues } from "@/schemas/loggerConfigSettings";

export interface LoggerListSelect {
    id: number;
    loggerName: string | null;
    productId: number;
    loggerUid: number | null;
    typeId:number;
    lat:number | null;
    lng: number | null;
    name: string | null;
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
  
  export type LatestDiagnosticData = {
  data1: number,
  data2: number,
  type: number
}

export type LatestDiagnosticDataResponse = {
  loggerUid: string,
  logDateTime: number,
  createdAt: number,
  ttlDate: number,
  diagnostics: LatestDiagnosticData[],
}

export type GeneralLoggerInfoResponse = {
  loggerName: string,
  type: string,
  model: string,
  serialNumber: string,
  serverSettingsVersion: number,
  loggerSettingsVersion: number,
  firmwareVersionInUse: number,
  productName: string,
}