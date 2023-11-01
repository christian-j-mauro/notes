import React, { useEffect, useState } from 'react';
import NoteForm from './NoteForm';

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('/notes')
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const handleSave = (note) => {
    fetch('/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })
    .then(res => res.json())
    .then(newNote => setNotes([...notes, newNote]));
  };

  const handleDelete = (id) => {
    fetch(`/notes/${id}`, { method: 'DELETE' })
      .then(() => setNotes(notes.filter(note => note.id !== id)));
  };

  return (
    <div className="App">
      <NoteForm onSave={handleSave} />

      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <h2 className='title'>{note.title}</h2>
            <p className='content'>{note.content}</p>
            <button className='btn' onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
