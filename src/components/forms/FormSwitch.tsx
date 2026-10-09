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
  <div className="flex items-center justify-start gap-3">
    {/* Label */}
    <div className="shrink-0">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      {helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>

    {/* Current Value and Switch */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
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
