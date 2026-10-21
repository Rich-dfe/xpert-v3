"use client";

import { createContext, useState, ReactNode, useContext } from "react";

export interface ApplicationContextType {
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;

  selectedUserId: string;
  setSelectedUserId: (id: string) => void;

  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;

  selectedLoggerId: string;
  setSelectedLoggerId: (id: string) => void;

  selectedLoggerUid: number | null;
  setSelectedLoggerUid: (id: number | null) => void;

  loggerSettingsVersion: number | null;
  setLoggerSettingsVersion: (id: number | null) => void;

  loggerTypeId: number | null;
  setLoggerTypeId: (id: number | null) => void;

  latitude: number | null;
  setLatitude: (lat: number | null) => void;

  longitude: number | null;
  setLongitude: (lat: number | null) => void;

  selectedLoggerName: string | null;
  setSelectedLoggerName: (name: string | null) => void;

  loggerUidToHex: (uid: number | null) => string;

  selectedLoggerUidHex: string;
}

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export function ApplicationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedLoggerId, setSelectedLoggerId] = useState("");
  const [selectedLoggerUid, setSelectedLoggerUid] = useState<number | null>(
    null,
  );
  const [loggerSettingsVersion, setLoggerSettingsVersion] = useState<
    number | null
  >(null);
  const [loggerTypeId, setLoggerTypeId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedLoggerName, setSelectedLoggerName] = useState<string | null>(
    null,
  );

  const loggerUidToHex = (uid: number | null): string => {
    if (uid === null) return "";

    return uid.toString(16).toUpperCase();
  };

  const selectedLoggerUidHex =
    selectedLoggerUid === null
      ? ""
      : selectedLoggerUid.toString(16).toUpperCase();

  return (
    <ApplicationContext.Provider
      value={{
        selectedCustomerId,
        setSelectedCustomerId,
        selectedUserId,
        setSelectedUserId,
        selectedGroupId,
        setSelectedGroupId,
        selectedLoggerId,
        setSelectedLoggerId,
        selectedLoggerUid,
        setSelectedLoggerUid,
        loggerSettingsVersion,
        setLoggerSettingsVersion,
        loggerTypeId,
        setLoggerTypeId,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        selectedLoggerName,
        setSelectedLoggerName,
        loggerUidToHex,
        selectedLoggerUidHex,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider");
  }

  return context;
}
