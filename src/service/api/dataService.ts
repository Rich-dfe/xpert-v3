import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { LoggerChartResponse } from "@/types/chart";

export const dataService = {
    server:{

    },
    client:{
     
    fetchPrimaryChartData: (lid: number,tid: number, start: number, end: number,idToken?:string) =>
        apiFetch<LoggerChartResponse>(`/loggers/${lid}/${tid}/chart-data?startDate=${start}&endDate=${end}`,{},idToken),
    }
}