const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4400;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/sudoku', { useNewUrlParser: true, useUnifiedTopology: true });

const scoreSchema = new mongoose.Schema({
    username: String,
    time: Number,
});

const Score = mongoose.model('Score', scoreSchema);

// Generate Sudoku puzzle (dummy implementation)
app.get('/generate-puzzle', (req, res) => {
    // Dummy Sudoku puzzle
    const puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];

    res.json({ puzzle });
});

// Submit score
app.post('/submit-score', async (req, res) => {
    const { username, time } = req.body;
    const newScore = new Score({ username, time });
    await newScore.save();
    res.json({ message: 'Score saved successfully!' });
});

// Get leaderboard
app.get('/leaderboard', async (req, res) => {
    const scores = await Score.find().sort({ time: 1 }).limit(10);
    res.json(scores);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
