"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loggerService } from "@/service/api/loggerService";
import { useSession } from "next-auth/react";
import {
  UpdateLoggerConfigSettingsPayload,
  LoggerListSelect,
  LoggerConfigSettingsResponse,
  SensorConfigSettingsResponse,
  UpdateSensorConfigSettingsPayload,
} from "@/types/logger";
import { LoggerCalibrationSettingsResponse } from "@/types/calibration";
import { LoggerConfigSettingValues } from "@/schemas/loggerConfigSettings";

export function useListLoggersByCustomerUser(
  custId: string,
  userId: string,
  groupId: string,
  options?: any,
) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useQuery<LoggerListSelect[]>({
    queryKey: ["userLoggers", userId],
    queryFn: () =>
      loggerService.client.listByCustomerUser(custId, userId, groupId, idToken),
    ...options,
  });
}

export function useListLoggersByCustomerUserGroup(
  custId: string,
  userId: string,
  groupId: string,
  options?: any,
) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useQuery<LoggerListSelect[]>({
    queryKey: ["groupLoggers", groupId],
    queryFn: () =>
      loggerService.client.listByCustomerUserGroup(
        custId,
        userId,
        groupId,
        idToken,
      ),
    ...options,
  });
}

export function useUpdateLoggerConfigSettings(options?: any) {
  const { data: session } = useSession();
  const idToken = session?.idToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: UpdateLoggerConfigSettingsPayload }) =>
      loggerService.client.updateLoggerConfigSettings(data, idToken),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["configSettings", variables.data.loggerId],
      });
    },

    ...options,
  });
}

export function useFetchLoggerConfigSettings(loggerId: string) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useQuery<LoggerConfigSettingsResponse[], Error>({
    queryKey: ["configSettings", loggerId],

    queryFn: () =>
      loggerService.client.fetchLoggerConfigSettings(loggerId, idToken),

    enabled: !!loggerId,
  });
}

export function useFetchSensorConfigSettings(
  loggerId: string,
  typeId: number | null,
) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useQuery<SensorConfigSettingsResponse[], Error>({
    queryKey: ["sensorConfigSettings", loggerId],

    queryFn: () =>
      loggerService.client.fetchSensorConfigSettings(
        loggerId,
        typeId!,
        idToken,
      ),

    enabled: !!loggerId && typeId !== null,
  });
}

export function useUpdateSensorConfigSettings(loggerId: string) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: UpdateSensorConfigSettingsPayload }) =>
      loggerService.client.updateSensorConfigSettings(data, idToken),
   
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sensorConfigSettings", loggerId],
      });
    },
  });
}


