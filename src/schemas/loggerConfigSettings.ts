import { z } from "zod";

export const loggerConfigSettingsSchema = z.object({
    loggerName: z.string().min(1, "Logger name is required"),
    interval: z.number().min(10,"No less than 10 please").max(15,"No more than 15 allowed"),
    loggerNotes: z.string().min(1, "Logger notes are required"),
    loggerType: z.string().min(1,"Please select a logger type"),
})

export type LoggerConfigSettingValues = z.infer<typeof loggerConfigSettingsSchema>;