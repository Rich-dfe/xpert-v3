'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function LoggersPage() {
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
      <h1>Config {selectedLoggerId}</h1>
    </div>
  );
}