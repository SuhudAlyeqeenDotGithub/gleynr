import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

const FormField = ({ label, error, hint, children }: FormFieldProps) => (
  <label className={error ? "has-error" : undefined}>
    {label}
    {children}
    {error ? (
      <span className="field-error" role="alert">
        {error}
      </span>
    ) : (
      hint && <span className="field-hint">{hint}</span>
    )}
  </label>
);

export default FormField;
