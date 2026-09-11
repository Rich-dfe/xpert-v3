import { LoggerListProps } from "@/types";
import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { LoggerListSelect } from "@/types/logger";
import { UpdateLoggerConfigSettingsPayload, LoggerConfigSettingsResponse, UpdateSensorConfigSettingsPayload, SensorConfigSettingsResponse } from "@/types/logger";
import { LoggerCalibrationSettingsResponse, WaterlevelCalibrationSettings } from "@/types/calibration";

export const loggerService = {
    server:{

    },
    client:{
      listByCustomerUserGroup: (custId:string, userId:string,groupId: string,idToken?:string) =>
        apiFetch<LoggerListSelect[]>(`/customers/${custId}/users/${userId}/group/${groupId}/loggers`,{},idToken),
        //apiFetch<LoggerListSelect[]>(`/loggers?groupId=${groupId}`),
    
      listByCustomerUser: (custId:string, userId:string,groupId: string,idToken?:string) =>
        apiFetch<LoggerListSelect[]>(`/customers/${custId}/users/${userId}/group/${groupId}/loggers`,{},idToken),

      updateLoggerConfigSettings: (payload: UpdateLoggerConfigSettingsPayload, idToken?:string) =>
        apiFetch<UpdateLoggerConfigSettingsPayload[]>(`/loggers/config`,{method: "PATCH", body: JSON.stringify(payload),},idToken),

      fetchLoggerConfigSettings: (loggerId:string, idToken?:string) =>
        apiFetch<LoggerConfigSettingsResponse[]>(`/loggers/${loggerId}/config`,{},idToken),

      updateSensorConfigSettings: (payload: UpdateSensorConfigSettingsPayload, idToken?:string) =>
        apiFetch<UpdateSensorConfigSettingsPayload[]>(`/loggers/sensor/config`,{method: "PATCH", body: JSON.stringify(payload),},idToken),

      fetchSensorConfigSettings: (loggerId:string, typeId:number, idToken?:string) => 
        apiFetch<SensorConfigSettingsResponse[]>(`/loggers/${loggerId}/sensor/${typeId}`,{},idToken),

      fetchLoggerCalibrationSettings: (loggerId:string, typeId:number, idToken?:string) => 
        apiFetch<LoggerCalibrationSettingsResponse>(`/loggers/${loggerId}/calibration/${typeId}`,{},idToken),

      updateWaterLevelCalibrationSettings: (payload: WaterlevelCalibrationSettings, idToken?:string) =>
        apiFetch<WaterlevelCalibrationSettings[]>(`/loggers/calibration`,{method: "PATCH", body: JSON.stringify(payload),},idToken),
    }   
}