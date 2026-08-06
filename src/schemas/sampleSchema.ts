import { z } from "zod";

export const sampleFormSchema = z.object({
    loggerName: z.string().min(1, "Logger name is required"),
    loggingInterval: z.number().min(10,"No less than 10 seconds please"),
    continuousLogging: z.boolean(),
    startDate: z.date({message: "Please select a start date and time"}),
    stopDate: z.date({message: "Please select a stop date and time"}),
    siteName: z.string(),
    loggerNotes: z.string().min(1, "Logger notes are required"),
    timezone:z.number(),
    group:z.string(),
    applyToGroup: z.boolean(),
    FirmWareUpdate: z.boolean(),
    settingsVersion: z.number(),

    interval: z.number().min(10,"No less than 10 please").max(15,"No more than 15 allowed"),
    
    loggerType: z.string().min(1,"Please select a logger type"),
    
    enabled: z.boolean(),
    
})

export type SampleFormValues = z.infer<typeof sampleFormSchema>;