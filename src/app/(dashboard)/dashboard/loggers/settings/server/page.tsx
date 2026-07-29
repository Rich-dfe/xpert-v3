'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function ServerSettingsPage() {
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
      <h1>Server Settings {selectedLoggerId}</h1>
    </div>
  );
}