import React from "react";
import "./index.scss";

// Define the props for the InputField component
export interface InputFieldProps {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  isReadOnly?: boolean;
  customStyle?: React.CSSProperties;
  darkMode?: boolean;
}

/**
 * A reusable input field component with a label and placeholder.
 * It supports read-only mode and custom styling.
 */
export const InputField = ({
  value = "",
  handleChange = () => {},
  label,
  placeholder = "",
  darkMode = false,
  isReadOnly = false,
  customStyle,
}: InputFieldProps) => {
  const isFilled = value.length > 0;

  // Generate a unique ID for the input
  const inputId = `input-${label
    .toLowerCase()
    .replace(/\s+/g, "-")}-${Math.random().toString(36).substr(2, 9)}`;

  // Apply dark-mode class to the container, not the input
  const containerClassName = `input-field-container ${
    darkMode ? "dark-mode" : ""
  }`;
  const inputClassName = `input-field-input ${isReadOnly ? "read-only" : ""} ${
    isFilled ? "filled" : ""
  }`;

  return (
    <div
      className={containerClassName}
      style={customStyle}
      data-testid="input-field-container"
    >
      <label className="input-field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        className={inputClassName}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
      />
    </div>
  );
};

export default InputField;
