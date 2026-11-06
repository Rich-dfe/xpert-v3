export interface LoggerReading {
  createdAt: number;
  data1: number;
  data2: number;
  loggerUid: string;
  ttlDate: number;
  type: number;
  logDateTime: number;

  s1: number | null;
  s2: number | null;
  s3: number | null;
  s4: number | null;
  s5: number | null;
  st1: number | null;
  st2: number | null;
  st3: number | null;
  st4: number | null;
  st5: number | null;
  st11: number | null;
}

export interface LoggerMeasurement {
  field: string;
  name: string;
  availableUnits: string[];
  defaultUnit: string;
}

export interface LoggerChartResponse {
  success: boolean;
  readings: LoggerReading[];
  measurements: LoggerMeasurement[];
}