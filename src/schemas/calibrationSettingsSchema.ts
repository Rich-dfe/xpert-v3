import { boolean, z } from "zod";

export const calibrationSettingsWaterLevelSchema = z.object({
  firstReadingReference: z
    .number({error: (issue) => issue.input === undefined 
      ? "Value is required." 
      : "Must be a number."})
    .min(100, "No less than 100 please")
    .max(5000, "No more than 5000 please"),
  secondReadingReference: z
    .number()
    .min(100, "No less than 100 please")
    .max(5000, "No more than 5000 please"),

  firstReadingLogger: z.number().min(1000).max(60000),

  secondReadingLogger: z.number().min(1000).max(60000),

  temperature: z
    .number()
    .min(1, "No less that one please")
    .max(99.99, "No more than 99 please"),
  resolution: z.number(),
  temperatureCompensation: z.number(),
  serverSideCalFlag: z.boolean(),  
  reset: z.boolean()
});

export const calibrationSettingsParSchema = z.object({
  loggerReadingTotal:z.number().min(100, "Invalid value").max(100000000,"Exceeds maximum allowed value."), //based on 65535 per minute over 24 hours 
  refReadingAverage:z.number().min(0, "No less than zero please").max(100000000, "Exceeds maximum allowed value."), //based maximum-intensity, direct midday sunlight over a day
  testDuration: z.number().min(0.1,"A suitable test duration is required").max(2880,"Excceds maximum allowed value"), //based on a duration of two days
  units: z.string(),
  reset: z.boolean(),
});

//Defines one MPT sensor characteristics
export const calibrationSettingsMptSenorSchema = z.object({
  soilType:z.string(),
  dryPoint:z.number(),
  fieldCapacity:z.number(),
  wiltPoint:z.number(),
  saturatedSoilWeight:z.number(),
  drySoilWeight:z.number(),
  saturatedVolume:z.number(),
  slope:z.number(),
  offset:z.number()
});

//Defines an array of sensor characteristics that can have a variable length ie. 3 sensors or 5 sensors
export const calibrationSettingsMptProbeSchema = z.object({
  sensors:z.array(calibrationSettingsMptSenorSchema)
});

export type CalibrationSettingsWaterLevelTypes = z.infer<typeof calibrationSettingsWaterLevelSchema>;
export type CalibrationSettingsParTypes = z.infer<typeof calibrationSettingsParSchema>;
export type CalibrationMptSensor = z.infer<typeof calibrationSettingsMptProbeSchema>;
