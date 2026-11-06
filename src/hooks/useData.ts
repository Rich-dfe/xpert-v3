'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dataService } from "@/service/api/dataService";
import { useSession } from "next-auth/react";

export function useFetchPrimaryChartData(lid?:number | null, tid?: number | null, start?:number, end?:number) {
    const { data: session } = useSession();

    const idToken = session?.idToken;

    return useQuery({
        queryKey: ["chartDataPrimary", lid, tid, start, end],
        queryFn: () => dataService.client.fetchPrimaryChartData(lid!, tid!,start!,end!,idToken),
        enabled: !!lid && !!tid && start !== undefined && end !== undefined && !!idToken
    });
}