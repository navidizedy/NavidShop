import {
  forwardRef,
  SelectHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FieldProps {
  label: string;
  error?: any;
}

export const InputField = forwardRef<
  HTMLInputElement,
  FieldProps & InputHTMLAttributes<HTMLInputElement>
>(({ label, error, ...props }, ref) => (
  <div className="space-y-2 w-full">
    <label className="text-white font-semibold text-sm">{label}</label>
    <input
      ref={ref}
      {...props}
      className={`w-full p-3 rounded-lg border transition-all ${
        error
          ? "border-red-500 ring-1 ring-red-500"
          : "border-gray-600 focus:border-blue-500"
      } bg-gray-700 text-white outline-none`}
    />
    <p className="text-red-400 text-xs min-h-[1.25rem] mt-1">
      {error?.message || error || ""}
    </p>
  </div>
));
InputField.displayName = "InputField";

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ label, error, ...props }, ref) => (
  <div className="space-y-2 w-full">
    <label className="text-white font-semibold text-sm">{label}</label>
    <textarea
      ref={ref}
      {...props}
      className={`w-full p-3 rounded-lg border transition-all ${
        error
          ? "border-red-500 ring-1 ring-red-500"
          : "border-gray-600 focus:border-blue-500"
      } bg-gray-700 text-white outline-none`}
    />
    <p className="text-red-400 text-xs min-h-[1.25rem] mt-1">
      {error?.message || error || ""}
    </p>
  </div>
));
TextAreaField.displayName = "TextAreaField";

interface SelectFieldProps
  extends FieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, placeholder = "Select...", ...props }, ref) => (
    <div className="space-y-2 w-full">
      <label className="text-white font-semibold text-sm">{label}</label>
      <select
        ref={ref}
        {...props}
        className={`w-full p-3 rounded-lg border transition-all ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-gray-600 focus:border-blue-500"
        } bg-gray-700 text-white outline-none disabled:opacity-50`}
      >
        {!props.multiple && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="text-red-400 text-xs min-h-[1.25rem] mt-1">
        {error?.message || error || ""}
      </p>
    </div>
  ),
);
SelectField.displayName = "SelectField";

export const LoadingSelect = ({ label, error }: FieldProps) => (
  <div className="space-y-2 w-full">
    <label className="text-white font-semibold text-sm">{label}</label>
    <div className="w-full h-[50px] p-3 rounded-lg border border-gray-600 bg-gray-700 animate-pulse flex items-center">
      <span className="text-gray-400 text-sm">
        Loading {label.toLowerCase()}...
      </span>
    </div>
    <p className="text-red-400 text-xs min-h-[1.25rem] mt-1">
      {error?.message || error || ""}
    </p>
  </div>
);
