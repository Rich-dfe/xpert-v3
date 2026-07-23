'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "@/service/api/groupService";
import { useSession } from "next-auth/react";

export function useListGroupsByUser(custId?:string, userId?: string) {
    const { data: session } = useSession();

    const idToken = session?.idToken;

    return useQuery({
        queryKey: ["groups", userId],
        queryFn: () => groupService.client.listGroupsByCustomerIdUserId(custId!, userId!,idToken),
        enabled: !!userId || !!idToken
    });
}