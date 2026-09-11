  export interface WaterlevelCalibrationSettings {
  typeId: 4131;
  loggerUid: number | null,
  firstReadingReference: number;
  secondReadingReference: number;
  firstReadingLogger: number;
  secondReadingLogger: number;
  temperature: number;
  resolution: number;
  temperatureCompensation: number;
  serverSideCalFlag: boolean;
}

export interface UpdateWaterlevelCalibrationSettingsPayload {
  typeId: 4131;
  loggerId: string;
  loggerUid: number | null,
  firstReadingReference: number;
  secondReadingReference: number;
  firstReadingLogger: number;
  secondReadingLogger: number;
  temperature: number;
  resolution: number;
  temperatureCompensation: number;
  serverSideCalFlag: boolean;
}

export interface ParCalibrationSettings {
  typeId: 4132;
  zeroReference: number;
  spanReference: number;
  temperature: number;
  resolution: number;
}

export type LoggerCalibrationSettingsResponse =
  | WaterlevelCalibrationSettings
  | ParCalibrationSettings;