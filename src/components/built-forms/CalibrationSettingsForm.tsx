import { useApplicationContext } from "@/context/ApplicationContext";
import CalibrationSettingsMpt from "./CalibrationSettingsMpt";
import CalibrationSettingsPar from "./CalibrationSettingsPar";
import CalibrationSettingsWaterLevel from "./CalibrationSettingsWaterLevel";

export default function CalibrationSettingsForm() {
  const { loggerTypeId } = useApplicationContext();

  if (loggerTypeId === null) {
    return <div>Waiting for logger type...</div>;
  }

  switch (loggerTypeId) {
    case 4131:
      return <CalibrationSettingsWaterLevel />;

    case 4132:
      return <CalibrationSettingsPar />;

    case 4161:
      return <CalibrationSettingsMpt />;

    default:
      return <div>Unsupported logger type.</div>;
  }
}