"use client";

import { useApplicationContext } from "@/context/ApplicationContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chartFormSchema, ChartFormValues } from "@/schemas/chartFormSchema";
import { DateTimePicker } from "../forms/DateTimePicker";
import {
  useUpdateLoggerConfigSettings,
  useFetchLoggerConfigSettings,
} from "@/hooks/useLogger";
import { UpdateLoggerConfigSettingsPayload } from "@/types/logger";
import { Spinner } from "../ui/spinner";
import { Button } from "@/components/ui/button";

interface LoggerConfigSettingsFormProps {
  onSubmit: (values: ChartFormValues) => void;
}

export default function ChartForm({
  onSubmit,
}: LoggerConfigSettingsFormProps) {
  const {
    selectedLoggerId,
    selectedLoggerUid,
    selectedGroupId,
    loggerSettingsVersion,
    setLoggerSettingsVersion,
  } = useApplicationContext();

  const form = useForm<ChartFormValues>({
    resolver: zodResolver(chartFormSchema),
    defaultValues: {
      startDate: undefined,
      stopDate: undefined,
    },
  });

  const startDate = form.watch("startDate");
  const stopDate = form.watch("stopDate");

  const { mutate: updateLoggerConfigSettings, isPending: isUpdatePending } =
    useUpdateLoggerConfigSettings();

  /////////////////////////////////////////////////
  // FUNCTIONS
  /////////////////////////////////////////////////

  function setDateRange(range: "day" | "7days" | "month") {
    const stopDate = new Date();
    const startDate = new Date(stopDate);

    switch (range) {
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;

      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;

      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    form.setValue("startDate", startDate, {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue("stopDate", stopDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  useEffect(() => {
    // We'll implement the chart configuration logic here.
  }, []);

  return (
  <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="flex flex-col gap-3"
>
  {/* Date pickers */}
  <div className="flex flex-wrap gap-3">
    <div className="w-full sm:w-60">
      <DateTimePicker
        name="startDate"
        label="Start date"
        value={startDate}
        onChange={(date) =>
          form.setValue("startDate", date ?? undefined, {
            shouldValidate: true,
          })
        }
        required={false}
        error={form.formState.errors.startDate?.message}
      />
    </div>

    <div className="w-full sm:w-60">
      <DateTimePicker
        name="stopDate"
        label="Stop date"
        value={stopDate}
        onChange={(date) =>
          form.setValue("stopDate", date ?? undefined, {
            shouldValidate: true,
          })
        }
        required={false}
        error={form.formState.errors.stopDate?.message}
      />
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-wrap items-center gap-2 mb-3">
    <Button type="button" size="sm" variant="outline"
      onClick={() => setDateRange("day")}>
      Last day
    </Button>

    <Button type="button" size="sm" variant="outline"
      onClick={() => setDateRange("7days")}>
      Last 7 days
    </Button>

    <Button type="button" size="sm" variant="outline"
      onClick={() => setDateRange("month")}>
      Last month
    </Button>

    <Button type="submit" size="sm" disabled={isUpdatePending}>
      {isUpdatePending ? "Loading..." : "Apply"}
    </Button>
  </div>
</form>
);
}
