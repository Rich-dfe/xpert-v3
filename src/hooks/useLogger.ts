'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { loggerService } from "@/service/api/loggerService";

export function useListLoggersByUser(userId: string, options?:any) {
    return useQuery({
        queryKey: ["userLoggers", userId],
        queryFn: () => loggerService.client.listByUserId(userId),
        ...options
    });
}

export function useListLoggersByGroup(groupId: string, options?:any) {
    return useQuery({
        queryKey: ["groupLoggers", groupId],
        queryFn: () => loggerService.client.listByGroupId(groupId),
        ...options
    });
}