import { LoggerListProps } from "@/types";
import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { LoggerListSelect } from "@/types/logger";

export const loggerService = {
    server:{

    },
    client:{
      listByGroupId: (groupId: string) =>
        apiFetch<LoggerListSelect[]>(`/loggers?groupId=${groupId}`),
    
      listByUserId: (userId: string) =>
        apiFetch<LoggerListSelect[]>(`/loggers?userId=${userId}`),
    }   
}