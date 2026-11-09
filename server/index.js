const express = require('express');
const { Pool } = require ('pg');

const pool = new Pool({
    host : 'localhost',
    port: 5432,
    database: 'game_tracker',
});

const app = express();
app.use(express.json());
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello from the game tracker!');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/games', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games');
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.post('/api/games', async (req, res) => {
    const { title, platform, status, rating, hours_played, notes } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required'});
    }

    try {
        const result = await pool.query(
        `INSERT INTO games (title, platform, status, rating, hours_played, notes)
        VALUES ($1, $2, COALESCE($3, 'backlog'), $4, COALESCE($5, 0), $6)
        RETURNING *`,
        [title, platform, status, rating, hours_played, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});