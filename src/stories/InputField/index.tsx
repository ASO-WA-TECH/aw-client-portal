import React, { useState } from "react";
import "./index.scss";

export interface InputFieldProps {
  value: string;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  label: string;
  placeholder?: string;
  isReadOnly?: boolean;
  customStyle?: React.CSSProperties;
  darkMode?: boolean;
  required?: boolean;
  validate?: (value: string) => string | null;
  type?: "text" | "password" | "email" | "number" | "date" | "textarea";
  className?: string;
}

export const InputField = ({
  value = "",
  handleChange = () => {},
  label,
  placeholder = "",
  darkMode = false,
  isReadOnly = false,
  customStyle,
  required = false,
  validate,
  type = "text",
  className,
}: InputFieldProps) => {
  const [error, setError] = useState<string | null>(null);
  const isFilled = value.length > 0;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    handleChange(event);

    if (required && newValue.trim() === "") {
      setError("This field is required");
    } else if (validate) {
      const validationMessage = validate(newValue);
      setError(validationMessage);
    } else {
      setError(null);
    }
  };

  const containerClassName = `input-field-container ${darkMode ? "dark-mode" : ""}`;
  const inputClassName = `input-field-input ${isReadOnly ? "read-only" : ""} ${isFilled ? "filled" : ""} ${error ? "error" : ""} ${className ?? ""}`;

  return (
    <div
      className={containerClassName}
      style={customStyle}
      data-testid="input-field-container"
    >
      <label className="input-field-label">
        {label} {required && <span className="required">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          className={inputClassName}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          readOnly={isReadOnly}
        />
      ) : (
        <input
          type={type}
          className={inputClassName}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          readOnly={isReadOnly}
        />
      )}
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default InputField;
