'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "@/service/api/groupService";

export function useListGroupsByUser(custId?:string, userId?: string) {
    return useQuery({
        queryKey: ["groups", userId],
        queryFn: () => groupService.client.listByUserId(custId!, userId!),
        enabled: !!userId
    });
}