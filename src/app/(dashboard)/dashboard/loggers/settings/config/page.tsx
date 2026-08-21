'use client'

import { useApplicationContext } from "@/context/ApplicationContext";
import LoggerConfigSettingsForm from "@/components/built-forms/LoggerConfigForm";
import { FormCard } from "@/components/forms/FormCard";

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
    <div className="grid gap-6 md:grid-cols-2">
        <FormCard
          title="Logger Config"
          description="Configure the main logger settings."
        >
          <LoggerConfigSettingsForm />
        </FormCard>
  </div>
  );
}