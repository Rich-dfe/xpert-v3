import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loggerService } from "@/service/api/loggerService";
import { useSession } from "next-auth/react";
import { LoggerCalibrationSettingsResponse, WaterlevelCalibrationSettings, UpdateParCalibrationSettingsPayload } from "@/types/calibration";

export function useFetchLoggerCalibrationSettings(
  loggerId: string,
  typeId: number | null,
) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useQuery<LoggerCalibrationSettingsResponse | undefined, Error>({
    queryKey: ["calibrationSettings", loggerId],

    queryFn: () =>
      loggerService.client.fetchLoggerCalibrationSettings(
        loggerId,
        typeId!,
        idToken,
      ),

    enabled: !!loggerId && typeId !== null,
  });
}

export function useUpdateWaterLevelLoggerCalibrationSettings(loggerId: string) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: WaterlevelCalibrationSettings }) =>
      loggerService.client.updateWaterLevelCalibrationSettings(data, idToken),
   
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["sensorConfigSettings", loggerId],
    //   });
    // },
  });
}

export function useUpdateParLoggerCalibrationSettings(loggerId: string) {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: UpdateParCalibrationSettingsPayload }) =>
      loggerService.client.updateParCalibrationSettings(data, idToken),
   
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["sensorConfigSettings", loggerId],
    //   });
    // },
  });
}



