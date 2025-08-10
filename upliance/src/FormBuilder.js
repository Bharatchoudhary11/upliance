import React, { useState } from 'react';

function FieldEditor({ field, index, fields, onChange, onRemove, onMove }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange(index, { ...field, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div>
        <label>Type: </label>
        <select name="type" value={field.type} onChange={handleChange}>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="textarea">Textarea</option>
          <option value="select">Select</option>
          <option value="radio">Radio</option>
          <option value="checkbox">Checkbox</option>
          <option value="date">Date</option>
        </select>
      </div>
      <div>
        <label>Label: </label>
        <input name="label" value={field.label} onChange={handleChange} />
      </div>
      <div>
        <label>Required: </label>
        <input type="checkbox" name="required" checked={field.required} onChange={handleChange} />
      </div>
      <div>
        <label>Default: </label>
        <input name="defaultValue" value={field.defaultValue} onChange={handleChange} />
      </div>
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <div>
          <label>Options (comma separated): </label>
          <input name="options" value={field.options || ''} onChange={handleChange} />
        </div>
      )}
      <div>
        <label>Min Length: </label>
        <input name="minLength" value={field.minLength || ''} onChange={handleChange} />
      </div>
      <div>
        <label>Max Length: </label>
        <input name="maxLength" value={field.maxLength || ''} onChange={handleChange} />
      </div>
      <div>
        <label>Email: </label>
        <input type="checkbox" name="email" checked={field.email || false} onChange={handleChange} />
      </div>
      <div>
        <label>Password Rule: </label>
        <input type="checkbox" name="password" checked={field.password || false} onChange={handleChange} />
      </div>
      <div>
        <label>Derived: </label>
        <input type="checkbox" name="derived" checked={field.derived || false} onChange={handleChange} />
      </div>
      {field.derived && (
        <>
          <div>
            <label>Parent IDs (comma separated): </label>
            <input name="parents" value={field.parents || ''} onChange={handleChange} />
          </div>
          <div>
            <label>Formula (use values.parentId): </label>
            <input name="formula" value={field.formula || ''} onChange={handleChange} />
          </div>
        </>
      )}
      <div>
        <button type="button" onClick={() => onMove(index, -1)}>Up</button>
        <button type="button" onClick={() => onMove(index, 1)}>Down</button>
        <button type="button" onClick={() => onRemove(index)}>Delete</button>
      </div>
    </div>
  );
}

export default function FormBuilder({ form, setForm, onSave, onPreview }) {
  const [fields, setFields] = useState(form.fields || []);

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
      },
    ]);
  };

  const updateField = (index, newField) => {
    const updated = fields.slice();
    updated[index] = newField;
    setFields(updated);
  };

  const removeField = (index) => {
    const updated = fields.slice();
    updated.splice(index, 1);
    setFields(updated);
  };

  const moveField = (index, dir) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const updated = fields.slice();
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setFields(updated);
  };

  const save = () => {
    const name = window.prompt('Form name');
    if (!name) return;
    const newForm = { ...form, name, created: new Date().toISOString(), fields };
    setForm(newForm);
    onSave(newForm);
  };

  return (
    <div>
      <h2>Create Form</h2>
      {fields.map((field, idx) => (
        <FieldEditor
          key={field.id}
          field={field}
          index={idx}
          fields={fields}
          onChange={updateField}
          onRemove={removeField}
          onMove={moveField}
        />
      ))}
      <button type="button" onClick={addField}>Add Field</button>
      <div style={{ marginTop: '20px' }}>
        <button type="button" onClick={save}>Save Form</button>
        <button type="button" onClick={onPreview}>Preview</button>
      </div>
    </div>
  );
}

