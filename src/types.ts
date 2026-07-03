import { Dispatch, SetStateAction,ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import { FieldValues,Path,Control } from "react-hook-form";

//The key names are capitalized here to match the returned results from the Lambda API.
export interface LoggerRecordProps {
    SerialNumber: string,
    SK: string,
    PK: string,
    OrderNo?: string,
    DateAssigned: string,
    CustomerName: string,
    Notes: string
}

export interface FetchRecordProps {
  setLoggerRecord: Dispatch<SetStateAction<LoggerRecordProps | null>>;
}

export interface recordDisplayProps {
  record: LoggerRecordProps | null;
}

export interface CustomerPayload {
    id?: number;
    companyName: string;
}

export interface AddProductPayload {
  customer: string,
  product?: string,
  serialNoStart: string,
  serialNoEnd: string,
  orderNumber?: string,
  notes?: string
}

export interface RegisterLoggerFormProps {
  onCustomerSelect: (customerId: string) => void;
}

export interface LoggerListProps {
  customerId: string;
  listTitle: string;
}

export interface InputProps extends ComponentPropsWithRef<"input">{
    label:string;
    error?:string
}

export interface RadioOptions {
    label: string;
    value: string
}

export interface FormRadioGroupProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: String;
    options: RadioOptions[]
}

interface DropdownOption{
    value: string;
    label: string;
}

export interface DropdownProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
}