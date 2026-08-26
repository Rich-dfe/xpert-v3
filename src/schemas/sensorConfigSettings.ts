import { z } from "zod";

export const sensorConfigSettingsSchema = z.object({
    sensorSetting: z.string(),
});

export type SensorConfigSettingValues = z.infer<typeof sensorConfigSettingsSchema>;