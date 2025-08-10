import React, { useState, useEffect } from 'react';

interface Field {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: string;
  minLength?: string;
  maxLength?: string;
  email?: boolean;
  password?: boolean;
  derived?: boolean;
  parents?: string;
  formula?: string;
}

interface Form {
  name: string;
  fields: Field[];
}

interface PreviewFormProps {
  form: Form;
  onBack: () => void;
}

function evaluateFormula(formula: string, values: Record<string, any>): any {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('values', `return ${formula}`);
    return fn(values);
  } catch (e) {
    return '';
  }
}

export default function PreviewForm({ form, onBack }: PreviewFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, any> = {};
    form.fields.forEach(f => {
      initial[f.id] = f.defaultValue || '';
    });
    // compute derived fields on mount
    form.fields.forEach(f => {
      if (f.derived && f.formula) {
        initial[f.id] = evaluateFormula(f.formula, initial);
      }
    });
    setValues(initial);
  }, [form]);

  const handleChange = (id: string, value: any) => {
    const newValues: Record<string, any> = { ...values, [id]: value };
    form.fields.forEach(f => {
      if (f.derived && f.formula) {
        newValues[f.id] = evaluateFormula(f.formula, newValues);
      }
    });
    setValues(newValues);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    form.fields.forEach(f => {
      const val = values[f.id];
      if (f.required && !val) newErrors[f.id] = 'Required';
      if (f.minLength && val.length < parseInt(f.minLength)) newErrors[f.id] = `Min ${f.minLength}`;
      if (f.maxLength && val.length > parseInt(f.maxLength)) newErrors[f.id] = `Max ${f.maxLength}`;
      if (f.email && val && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) newErrors[f.id] = 'Invalid email';
      if (f.password && val && (!/[0-9]/.test(val) || val.length < 8)) newErrors[f.id] = 'Weak password';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert('Form valid!');
    }
  };

  const renderField = (field: Field) => {
    const isDerived = field.derived;
    const common = {
      id: field.id,
      value: values[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(field.id, e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value),
      readOnly: isDerived && !['select', 'radio', 'checkbox'].includes(field.type),
      disabled: isDerived && ['select', 'radio', 'checkbox'].includes(field.type),
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...common} />;
      case 'number':
        return <input type="number" {...common} />;
      case 'select':
        return (
          <select {...common}>
            <option value="" />
            {(field.options || '').split(',').map(opt => (
              <option key={opt} value={opt.trim()}>{opt.trim()}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div>
            {(field.options || '').split(',').map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.trim()}
                  checked={values[field.id] === opt.trim()}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  disabled={isDerived}
                />
                {opt.trim()}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div>
            {(field.options || '').split(',').map(opt => (
              <label key={opt}>
                <input
                  type="checkbox"
                  checked={(values[field.id] || {})[opt.trim()] || false}
                  onChange={(e) => {
                    const current = values[field.id] || {};
                    current[opt.trim()] = (e.target as HTMLInputElement).checked;
                    handleChange(field.id, { ...current });
                  }}
                  disabled={isDerived}
                />
                {opt.trim()}
              </label>
            ))}
          </div>
        );
      case 'date':
        return <input type="date" {...common} />;
      default:
        return <input type="text" {...common} />;
    }
  };

  return (
    <div>
      <h2>Preview: {form.name}</h2>
      <form onSubmit={handleSubmit}>
        {form.fields.map(f => (
          <div key={f.id} className="preview-field">
            <label>
              {f.label} {f.required && '*'}
              {renderField(f)}
            </label>
            {errors[f.id] && <div className="error-text">{errors[f.id]}</div>}
          </div>
        ))}
        <button type="submit">Submit</button>
        <button type="button" onClick={onBack} className="back-button">Back</button>
      </form>
    </div>
  );
}

