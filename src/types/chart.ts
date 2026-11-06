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
  s1t: number | null;
  s2t: number | null;
  s3t: number | null;
  s4t: number | null;
  s5t: number | null;
  s11t: number | null;
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