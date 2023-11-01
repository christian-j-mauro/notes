import React, { useState } from 'react';
import './NoteForm.css';

function NoteForm({ onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <div className='container'>
    <form onSubmit={handleSubmit} className='note-form'>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
      />
      <button className='btn' type="submit">Save</button>
    </form>
    </div>
  );
}

export default NoteForm;
