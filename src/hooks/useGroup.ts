'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "@/service/api/groupService";

export function useListGroupsByUser(userId?: string) {
    return useQuery({
        queryKey: ["groups", userId],
        queryFn: () => groupService.client.listByUserId(userId!),
        enabled: !!userId
    });
}