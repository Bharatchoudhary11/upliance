import React from 'react';

export default function MyForms({ forms, onSelect }) {
  return (
    <div>
      <h2>My Forms</h2>
      <ul>
        {forms.map((f) => (
          <li key={f.created} className="form-list-item">
            <button type="button" onClick={() => onSelect(f)}>
              {f.name} - {new Date(f.created).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
      {forms.length === 0 && <div>No forms saved.</div>}
    </div>
  );
}

