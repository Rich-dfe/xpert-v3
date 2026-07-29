'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function ChartsPage() {
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
      <h1>Charts {selectedLoggerId}</h1>
    </div>
  );
}