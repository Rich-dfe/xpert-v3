import { z } from "zod";

export const loggerConfigSettingsSchema = z.object({
    loggerName: z.string().min(1, "Logger name is required"),
    loggingInterval: z.number().min(10,"No less than 10 seconds please"),
    continuousLogging: z.boolean(),
    startDate: z.date({message: "Please select a start date and time"}).optional(),
    stopDate: z.date({message: "Please select a stop date and time"}).optional(),
    //siteName: z.string(),
    loggerNotes: z.string().min(1, "Logger notes are required"),
    timezone:z.string(),
    //group:z.string(),
    applyToGroup: z.boolean(),
    loggerId: z.string().optional(),
    //FirmWareUpdate: z.boolean(),
    //settingsVersion: z.number(),
})

export type LoggerConfigSettingValues = z.infer<typeof loggerConfigSettingsSchema>;