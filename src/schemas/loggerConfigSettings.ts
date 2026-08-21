import { z } from "zod";

export const loggerConfigSettingsSchema = z.object({
    loggerName: z.string().min(1, "Logger name is required"),
    loggingInterval: z.number().min(10,"No less than 10 seconds please"),
    continuousLogging: z.boolean(),
    startDate: z.date({message: "Please select a start date and time"}).optional(),
    stopDate: z.date({message: "Please select a stop date and time"}).optional(),
    loggerNotes: z.string().min(1, "Logger notes are required"),
    timezone:z.string(),
    applyToGroup: z.boolean(),
    //loggerId: z.string(),
})
.refine((data) =>{
    if(!data.startDate || !data.stopDate){
        return true;
    }

    return data.startDate < data.stopDate;
},
{
    message: "Start date must be before stop date.",
    path: ["stopDate"],
}
)

export type LoggerConfigSettingValues = z.infer<typeof loggerConfigSettingsSchema>;