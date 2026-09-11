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

export type CalibrationSettingsWaterLevelValues = z.infer<
  typeof calibrationSettingsWaterLevelSchema
>;
