"use client"

import { createContext,useState,ReactNode, useContext } from "react"

export interface SelectionContextType {
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;

  selectedUserId: string;
  setSelectedUserId: (id: string) => void;

  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;

  selectedLoggerId: string;
  setSelectedLoggerId: (id: string) => void;
}

export const SelectionContext =
  createContext<SelectionContextType | undefined>(undefined);

  export function SelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedLoggerId, setSelectedLoggerId] = useState("");

  return (
    <SelectionContext.Provider
      value={{
        selectedCustomerId,
        setSelectedCustomerId,
        selectedUserId,
        setSelectedUserId,
        selectedGroupId,
        setSelectedGroupId,
        selectedLoggerId,
        setSelectedLoggerId,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error(
      "useSelection must be used inside SelectionProvider"
    );
  }

  return context;
}