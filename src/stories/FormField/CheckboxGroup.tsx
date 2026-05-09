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
}: CheckboxGroupProps) => {
  const [error, setError] = useState<string | null>(null);

  const toggleValue = (option: string) => {
    const updatedValues = values.includes(option)
      ? values.filter((v) => v !== option)
      : [...values, option];

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
    <div className={`${containerClassName} ${customStyle}`}>
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
