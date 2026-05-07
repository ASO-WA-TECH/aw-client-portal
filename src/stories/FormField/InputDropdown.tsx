import React, { useState } from "react";
import "./index.scss";

export interface InputDropdownProps {
    value: string | number;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
    options: (string | number)[];
    placeholder?: string;
    isReadOnly?: boolean;
    darkMode?: boolean;
    required?: boolean;
    validate?: (value: string) => string | null;
    customStyle?: string
}

const InputDropdown = ({
    value = "",
    handleChange = () => { },
    label,
    options,
    placeholder = "Select an option",
    darkMode = false,
    isReadOnly = false,
    required = false,
    validate,
    customStyle
}: InputDropdownProps) => {
    const [error, setError] = useState<string | null>(null);
    const isFilled = value.length > 0;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        handleChange(event);

        if (required && newValue.trim() === "") {
            setError("This field is required");
        } else if (validate) {
            setError(validate(newValue));
        } else {
            setError(null);
        }
    };

    const containerClassName = `input-field-container ${darkMode ? "dark-mode" : ""
        }`;

    const selectClassName = `input-field-input ${isReadOnly ? "read-only" : ""
        } ${isFilled ? "filled" : ""} ${error ? "error" : ""}`;

    return (
        <div className={`${containerClassName} ${customStyle}`}>
            <label className="input-field-label">
                {label} {required && <span className="required">*</span>}
            </label>

            <select
                className={selectClassName}
                value={value}
                onChange={handleSelectChange}
                disabled={isReadOnly}
            >
                <option value="" disabled>
                    {placeholder}
                </option>

                {options.map(option => (
                    <option key={option} value={String(option)}>
                        {option}
                    </option>
                ))}
            </select>

            {error && <p className="input-error-message">{error}</p>}
        </div>
    );
};

export default InputDropdown;
