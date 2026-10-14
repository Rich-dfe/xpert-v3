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
  reset:boolean;
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
  reset:boolean;
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

export type MptCalibrationSettingsRow = {
  soil_moisture_units: number | string | null;
  soil_type_id: number | null;
  dry_limit_line: number | null;
  fc_limit_line: number | null;
  wilt_point: number | null;
  sat_soil_weight: number | null;
  dry_soil_weight: number | null;
  sat_soil_volume: number | null;
  slope: number | null;
  offset: number | null;
};

export type MptCalibrationSettingsResponse = MptCalibrationSettingsRow[];