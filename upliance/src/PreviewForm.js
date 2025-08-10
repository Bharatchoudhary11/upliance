import React, { useState, useEffect } from 'react';

function evaluateFormula(formula, values) {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('values', `return ${formula}`);
    return fn(values);
  } catch (e) {
    return '';
  }
}

export default function PreviewForm({ form, onBack }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initial = {};
    form.fields.forEach(f => {
      initial[f.id] = f.defaultValue || '';
    });
    setValues(initial);
  }, [form]);

  const handleChange = (id, value) => {
    const newValues = { ...values, [id]: value };
    // handle derived fields
    form.fields.forEach(f => {
      if (f.derived && f.formula) {
        newValues[f.id] = evaluateFormula(f.formula, newValues);
      }
    });
    setValues(newValues);
  };

  const validate = () => {
    const newErrors = {};
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Form valid!');
    }
  };

  const renderField = (field) => {
    const common = {
      id: field.id,
      value: values[field.id] || '',
      onChange: (e) => handleChange(field.id, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
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
                    current[opt.trim()] = e.target.checked;
                    handleChange(field.id, { ...current });
                  }}
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
          <div key={f.id} style={{ marginBottom: '10px' }}>
            <label>
              {f.label} {f.required && '*'}
              {renderField(f)}
            </label>
            {errors[f.id] && <div style={{ color: 'red' }}>{errors[f.id]}</div>}
          </div>
        ))}
        <button type="submit">Submit</button>
        <button type="button" onClick={onBack} style={{ marginLeft: '10px' }}>Back</button>
      </form>
    </div>
  );
}

