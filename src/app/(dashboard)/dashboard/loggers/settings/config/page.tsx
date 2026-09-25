'use client'

import LoggerConfigSettingsForm from "@/components/built-forms/LoggerConfigForm";
import { FormCard } from "@/components/forms/FormCard";

export default function LoggersPage() {

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