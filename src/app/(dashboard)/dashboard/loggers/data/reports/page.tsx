'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function ReportsPage() {
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
      <h1>Reports {selectedLoggerId}</h1>
    </div>
  );
}