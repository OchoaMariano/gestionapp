interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, name, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
} 