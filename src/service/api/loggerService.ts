import { LoggerListProps } from "@/types";
import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { LoggerListSelect } from "@/types/logger";
import { UpdateLoggerConfigSettingsPayload, LoggerConfigSettingsResponse } from "@/types/logger";

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
    }   
}