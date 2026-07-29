'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function HelpPage() {
const {
  selectedCustomerId,
  setSelectedCustomerId,
  selectedUserId,
  setSelectedUserId,
  selectedGroupId,
  setSelectedGroupId,
  selectedLoggerId,
  setSelectedLoggerId,
} = useApplicationContext();


  return (
    <div>
      <h1>Help {selectedLoggerId} {selectedCustomerId} {selectedGroupId} {selectedUserId}</h1>
    </div>
  );
}