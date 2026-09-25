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
  loggerReadingTotal: number;
  refReadingAverage: number;
  testDuration: number;
  units: string;
}

export interface ParCalibrationFormValues {
  loggerReadingTotal: number;
  refReadingAverage: number;
  testDuration: number;
  units: string;
}

export interface UpdateParCalibrationSettingsPayload extends ParCalibrationSettings {
  typeId: 4132;
  loggerId: string;
  loggerUid: number | null,
}

export type LoggerCalibrationSettingsResponse =
  | WaterlevelCalibrationSettings
  | ParCalibrationSettings;