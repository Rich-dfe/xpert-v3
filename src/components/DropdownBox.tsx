import { DropdownProps } from "@/types";
import { forwardRef } from "react";

export const DropdownBox = forwardRef<HTMLSelectElement,DropdownProps>(
({label,options,placeholder,error,...props},ref) =>{
    return(
        <div className="flex flex-col gap-1 w-full max-w-84 px-5 py-1">
            <label className="text-sm font-medium text-gray-100">{label}</label>

            <select
                ref={ref}
                {...props}
                className="border rounded p-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {/* <option value="" disabled>{placeholder ?? "Select an option"}</option> */}
                    <option value="">Select an option</option>
                    {options.map((opt) => (
                        <option key = {opt.value} value = {opt.value}>
                        {opt.label}
                    </option>
                    ))}
            </select>

            {error && <span className="text-red-300">{error}</span>}
        </div>
        )
    }
)
