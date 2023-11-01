const request = require('supertest');
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '5x5H.9yYl8+M',
    database: 'NotesApp'
};

app.get('/notes', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM notes');
    connection.end();
    res.status(200).send(rows);
});

jest.mock('mysql2/promise', () => ({
    createConnection: jest.fn().mockResolvedValue({
        execute: jest.fn().mockResolvedValueOnce([[{ id: 1, note: 'test note' }]]),
        end: jest.fn()
    })
}));

describe('GET /notes', () => {
    it('should return notes from the database', async () => {
        const response = await request(app).get('/notes');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, note: 'test note' }]);
    });
});
