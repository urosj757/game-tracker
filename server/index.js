const express = require('express');
const { Pool } = require ('pg');

const pool = new Pool({
    host : 'localhost',
    port: 5432,
    database: 'game_tracker',
});
const app = express();
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});