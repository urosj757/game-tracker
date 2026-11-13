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
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

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
});

app.delete('/api/games/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM games WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json({ message: 'Game deleted', game: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong'});
    }
});

app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { title, platform, status, rating, hours_played, notes } = req.body;

    try {
        const result = await pool.query(
            `UPDATE games
             SET title = COALESCE($1, title),
                platform = COALESCE($2, platform), 
                status = COALESCE($3, status),
                rating = COALESCE($4, rating),
                hours_played = COALESCE($5, hours_played),
                notes = COALESCE($6, notes)
            WHERE id = $7 RETURNING *`,
            [title, platform, status, rating, hours_played, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json({ message: 'Game edited', game: result.rows[0] });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong.'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});