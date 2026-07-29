'use client'

import { useApplicationContext } from "@/context/ApplicationContext";

export default function AccountsPage() {
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
      <h1>Accounts {selectedLoggerId}</h1>
    </div>
  );
}