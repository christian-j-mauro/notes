const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());

/* use your database info to connect to a database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', //set to your password
    database: 'NotesApp'
};
*/

app.get('/', (req, res) => {
    res.send("Welcome to the Notes API!");
});

app.get('/notes', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM notes');
    connection.end();
    res.status(200).send(rows);
});

app.post('/notes', async (req, res) => {
    const note = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content
    };

    if (!note.title || !note.content) {
        return res.status(400).send({ error: "Note title and content are required." });
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)', [note.id, note.title, note.content]);
    connection.end();
    res.status(201).send(note);
});

app.delete('/notes/:id', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM notes WHERE id = ?', [req.params.id]);
    connection.end();

    if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Note not found." });
    }

    res.status(200).send({ message: "Note deleted successfully." });
});

app.put('/notes/:id', async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
    connection.end();

    if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Note not found." });
    }

    res.status(200).send({ message: "Note updated successfully." });
});

app.listen(3000, () => {
    console.log("Success!");
    console.log('The server is running on port 3000');
});
