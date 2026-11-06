import { z } from "zod";

export const chartFormSchema = z.object({
    startDate: z.date({message: "Please select a start date and time"}).optional(),
    stopDate: z.date({message: "Please select a stop date and time"}).optional(),
});

export type ChartFormValues = z.infer<typeof chartFormSchema>;