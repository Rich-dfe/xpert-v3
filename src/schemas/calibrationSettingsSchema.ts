import { z } from "zod";

export const calibrationSettingsWaterLevelSchema = z.object({
  firstReadingReference: z
    .number()
    .min(100, "No less than 100 please")
    .max(5000, "No more than 5000 please"),
  secondReadingReference: z
    .number()
    .min(100, "No less than 100 please")
    .max(5000, "No more than 5000 please"),

  firstReadingLogger: z.number().min(1000).max(10000),

  secondReadingLogger: z.number().min(1000).max(65535),

  temperature: z
    .number()
    .min(0, "No less that zero please")
    .max(99.99, "No more than 99 please"),
  resolution: z.number(),
  temperatureCompensation: z.number(),
  serverSideCalFlag: z.boolean(),  
});

export const calibrationSettingsParSchema = z.object({
  loggerReadingTotal:z.number().min(100, "Invalid value").max(100000000,"Exceeds maximum allowed value."), //based on 65535 per minute over 24 hours 
  refReadingAverage:z.number().min(0, "No less than zero please").max(100000000, "Exceeds maximum allowed value."), //based maximum-intensity, direct midday sunlight over a day
  testDuration: z.number().min(0.1,"A suitable test duration is required").max(2880,"Excceds maximum allowed value"), //based on a duration of two days
  units: z.string(),
  reset: z.boolean(),
});

export type CalibrationSettingsWaterLevelTypes = z.infer<typeof calibrationSettingsWaterLevelSchema>;
export type CalibrationSettingsParTypes = z.infer<typeof calibrationSettingsParSchema>
