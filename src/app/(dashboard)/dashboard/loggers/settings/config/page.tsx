'use client'

import { useApplicationContext } from "@/context/ApplicationContext";
import LoggerConfigSettingsForm from "@/components/built-forms/LoggerConfigForm";
import SensorConfigSettingsForm from "@/components/built-forms/SensorConfigForm";
import CalibrationSettingsForm from "@/components/built-forms/CalibrationSettingsForm";
import { FormCard } from "@/components/forms/FormCard";
import { Separator } from "@/components/ui/separator";

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

        <FormCard
          title="Sensor Config"
          description="Configure sensor settings."
        >
          <SensorConfigSettingsForm />
          <Separator />
          <CalibrationSettingsForm />
        </FormCard>
  </div>
  );
}