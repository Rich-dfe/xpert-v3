"use client"

import { useApplicationContext } from "@/context/ApplicationContext";
import { useFetchLatestLoggerInfo } from "@/hooks/useLogger";


export default function LatestLoggerInfo() {
// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const { selectedLoggerUid } =
  useApplicationContext();

  const {
      data: latestInfoData,
      isLoading: isFetchLoading,
      isError: isFetchError,
      error: fetchError,
    } = useFetchLatestLoggerInfo(selectedLoggerUid);

    console.log('LATEST INFO', latestInfoData);
    console.log('LATEST INFO ERROR', fetchError);

  return <>Latest Logger Info</>;
}
