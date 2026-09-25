'use client'

import SensorConfigSettingsForm from "@/components/built-forms/SensorConfigForm";
import CalibrationSettingsForm from "@/components/built-forms/CalibrationSettingsForm";
import { FormCard } from "@/components/forms/FormCard";


export default function CalibrationPage() {

  return (
    <div className="grid gap-6 md:grid-cols-2">
        <FormCard
          title="Logger Calibration"
          description="Set logger calibration settings."
        >
          <CalibrationSettingsForm />
        </FormCard>

        <FormCard
          title="Sensor Config"
          description="Configure sensor settings."
        >
          <SensorConfigSettingsForm />
        </FormCard>
  </div>
  );
}