import { Switch } from "../ui/switch";

interface FormSwitchProps {
  name: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  helpText?: string;
  disabled?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
}

export function FormSwitch({
  name,
  label,
  checked,
  onCheckedChange,
  helpText,
  disabled,
  checkedLabel,
  uncheckedLabel,
}: FormSwitchProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div>
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>

        {helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm">
          {checked ? checkedLabel : uncheckedLabel}
        </span>

      <Switch
        id={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      </div>
    </div>
  );
}
