import type { ReactNode } from 'react';
import { useState } from 'react';

interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
  description?: string;
}

interface CommandFormProps {
  command: string;
  parameters: CommandParameter[];
  onSubmit: (args: string[]) => void;
  onCancel: () => void;
}

export function CommandForm({
  command,
  parameters,
  onSubmit,
  onCancel,
}: CommandFormProps): ReactNode {
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    parameters.forEach((param) => {
      initial[param.name] = param.defaultValue ?? '';
    });
    return initial;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const args: string[] = [];
    parameters.forEach((param) => {
      const value = formData[param.name];
      if (value !== undefined && value !== '' && value !== false) {
        if (param.type === 'boolean' && value === true) {
          args.push(`--${param.name}`);
        } else if (param.type !== 'boolean') {
          args.push(`--${param.name}`, String(value));
        }
      }
    });
    onSubmit(args);
  };

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Command: {command}</h3>
        <p className="text-sm text-muted-foreground">Configure parameters for this command</p>
      </div>

      {parameters.map((param) => (
        <div key={param.name} className="space-y-2">
          <label htmlFor={param.name} className="block text-sm font-medium">
            {param.label}
            {param.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {param.description && (
            <p className="text-xs text-muted-foreground">{param.description}</p>
          )}

          {param.type === 'string' && (
            <input
              type="text"
              id={param.name}
              value={formData[param.name] as string}
              onChange={(e) => handleChange(param.name, e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
            />
          )}

          {param.type === 'number' && (
            <input
              type="number"
              id={param.name}
              value={formData[param.name] as number}
              onChange={(e) => handleChange(param.name, Number(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
            />
          )}

          {param.type === 'boolean' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id={param.name}
                checked={formData[param.name] as boolean}
                onChange={(e) => handleChange(param.name, e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Enable</span>
            </label>
          )}

          {param.type === 'select' && (
            <select
              id={param.name}
              value={formData[param.name] as string}
              onChange={(e) => handleChange(param.name, e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
            >
              {param.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Run Command
        </button>
      </div>
    </form>
  );
}
