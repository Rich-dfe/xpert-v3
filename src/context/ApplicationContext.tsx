"use client"

import { createContext,useState,ReactNode, useContext } from "react"

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
}

export const ApplicationContext =
  createContext<ApplicationContextType | undefined>(undefined);

  export function ApplicationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedLoggerId, setSelectedLoggerId] = useState("");
  const [selectedLoggerUid, setSelectedLoggerUid] = useState<number | null>(null);

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
        setSelectedLoggerUid
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useSelection must be used inside SelectionProvider"
    );
  }

  return context;
}