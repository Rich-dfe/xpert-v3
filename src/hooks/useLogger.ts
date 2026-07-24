'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { loggerService } from "@/service/api/loggerService";
import { useSession } from "next-auth/react";

export function useListLoggersByCustomerUser(custId: string, userId: string, groupId: string, options?:any) {

    const { data: session } = useSession();
    const idToken = session?.idToken;

    return useQuery({
        queryKey: ["userLoggers", userId],
        queryFn: () => loggerService.client.listByCustomerUser(custId,userId,groupId,idToken),
        ...options
    });
}

export function useListLoggersByCustomerUserGroup(custId: string, userId: string, groupId: string, options?:any) {

    const { data: session } = useSession();
    const idToken = session?.idToken;

    return useQuery({
        queryKey: ["groupLoggers", groupId],
        queryFn: () => loggerService.client.listByCustomerUserGroup(custId,userId,groupId,idToken),
        ...options
    });
}