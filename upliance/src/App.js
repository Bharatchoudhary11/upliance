import React, { useState, useEffect } from 'react';
import './App.css';
import FormBuilder from './FormBuilder';
import PreviewForm from './PreviewForm';
import MyForms from './MyForms';

function App() {
  const [page, setPage] = useState('create');
  const [currentForm, setCurrentForm] = useState({ name: '', fields: [] });
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('forms');
    if (stored) setForms(JSON.parse(stored));
  }, []);

  const saveForm = (form) => {
    const updated = [...forms, form];
    setForms(updated);
    localStorage.setItem('forms', JSON.stringify(updated));
  };

  const selectForm = (form) => {
    setCurrentForm(form);
    setPage('preview');
  };

  let content = null;
  if (page === 'create') {
    content = (
      <FormBuilder
        form={currentForm}
        setForm={setCurrentForm}
        onSave={(f) => {
          saveForm(f);
          setPage('preview');
        }}
        onPreview={() => setPage('preview')}
      />
    );
  } else if (page === 'preview') {
    content = <PreviewForm form={currentForm} onBack={() => setPage('create')} />;
  } else if (page === 'myforms') {
    content = <MyForms forms={forms} onSelect={selectForm} />;
  }

  return (
    <div className="App">
      <nav className="nav-bar">
        <button onClick={() => setPage('create')}>Create</button>
        <button onClick={() => setPage('preview')}>Preview</button>
        <button onClick={() => setPage('myforms')}>My Forms</button>
      </nav>
      {content}
    </div>
  );
}

export default App;

