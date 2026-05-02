import React from "react";
import "./index.scss";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string | null;
    darkMode?: boolean;
    children: React.ReactNode;
}

const FormField = ({
    label,
    required,
    error,
    darkMode = false,
    children,
}: FormFieldProps) => {
    return (
        <div
            className={`form-field ${darkMode ? "dark-mode" : ""} ${error ? "has-error" : ""
                }`}
        >
            <label className="form-field__label">
                {label} {required && <span className="required">*</span>}
            </label>

            {children}

            {error && <p className="form-field__error">{error}</p>}
        </div>
    );
};

export default FormField;
