import { useState } from "react";
import "./index.scss";

export interface CheckboxGroupProps {
  values: string[];
  handleChange: (values: string[]) => void;
  label: string;
  options: string[];
  darkMode?: boolean;
  required?: boolean;
  validate?: (values: string[]) => string | null;
  customStyle?: string;
  className?: string;
}

const CheckboxGroup = ({
  values = [],
  handleChange = () => {},
  label,
  options,
  darkMode = false,
  required = false,
  validate,
  customStyle = "",
  className = "",
}: CheckboxGroupProps) => {
  const [error, setError] = useState<string | null>(null);

  const toggleValue = (option: string) => {
    const safeValues = Array.isArray(values) ? values : [];

    const updatedValues = safeValues.includes(option)
      ? safeValues.filter((v) => v !== option)
      : [...safeValues, option];

    handleChange(updatedValues);

    if (required && updatedValues.length === 0) {
      setError("Please select at least one option");
    } else if (validate) {
      setError(validate(updatedValues));
    } else {
      setError(null);
    }
  };

  const containerClassName = `input-field-container ${
    darkMode ? "dark-mode" : ""
  }`;

  return (
    <div className={`${containerClassName} ${customStyle} ${className}`}>
      <label className="input-field-label">
        {label} {required && <span className="required">*</span>}
      </label>

      <div className="checkbox-group">
        {options.map((option) => (
          <>
            <label
              key={option}
              htmlFor={`checkbox-${option}`}
              className="checkbox-item"
            >
              <span>{option}</span>
            </label>
            <input
              type="checkbox"
              id={`checkbox-${option}`}
              checked={values.includes(option)}
              onChange={() => toggleValue(option)}
            />
          </>
        ))}
      </div>

      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default CheckboxGroup;
