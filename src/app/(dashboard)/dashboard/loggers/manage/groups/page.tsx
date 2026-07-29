'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function GroupsPage() {
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
      <h1>Groups {selectedLoggerId}</h1>
    </div>
  );
}