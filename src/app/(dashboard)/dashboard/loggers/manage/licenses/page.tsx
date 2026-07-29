'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function LicensesPage() {
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
      <h1>Licenses {selectedLoggerId}</h1>
    </div>
  );
}