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

    const path = window.location.pathname.replace('/', '') || 'create';
    setPage(path);

    const onPop = () => {
      const newPath = window.location.pathname.replace('/', '') || 'create';
      setPage(newPath);
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const saveForm = (form) => {
    const updated = [...forms, form];
    setForms(updated);
    localStorage.setItem('forms', JSON.stringify(updated));
  };

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    const newPage = path.replace('/', '') || 'create';
    setPage(newPage);
  };

  const selectForm = (form) => {
    setCurrentForm(form);
    navigate('/preview');
  };

  let content = null;
  if (page === 'create') {
    content = (
      <FormBuilder
        form={currentForm}
        setForm={setCurrentForm}
        onSave={(f) => {
          saveForm(f);
          navigate('/preview');
        }}
        onPreview={() => navigate('/preview')}
      />
    );
  } else if (page === 'preview') {
    content = <PreviewForm form={currentForm} onBack={() => navigate('/create')} />;
  } else if (page === 'myforms') {
    content = <MyForms forms={forms} onSelect={selectForm} />;
  }

  return (
    <div className="App">
      <nav className="nav-bar">
        <button onClick={() => navigate('/create')}>Create</button>
        <button onClick={() => navigate('/preview')}>Preview</button>
        <button onClick={() => navigate('/myforms')}>My Forms</button>
      </nav>
      {content}
    </div>
  );
}

export default App;

