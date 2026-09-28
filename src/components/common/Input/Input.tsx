import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  className = "",
  error,
  id,
  label,
  name,
  required,
  ...props
}: InputProps) {
  const inputId = id ?? name;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-rose-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        {...props}
        id={inputId}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${error ? "border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"} ${className}`}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-sm text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
