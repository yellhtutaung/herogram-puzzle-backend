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

// Function to generate a Sudoku puzzle

// Function to generate a Sudoku puzzle
function generateSudoku() {
    const grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    // Function to check if placing a number is valid
    function isValid(grid, row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) {
                return false;
            }
        }
        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) {
                return false;
            }
        }
        // Check 3x3 sub-grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (grid[r][c] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    // Function to solve Sudoku using backtracking
    function solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solveSudoku(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Generate a fully solved Sudoku puzzle
    solveSudoku(grid);

    // Randomly remove numbers to create a puzzle (remove approximately 40 numbers)
    let emptyCells = 40; // Adjust this number for difficulty
    while (emptyCells > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            emptyCells--;
        }
    }

    return grid;
}


// Generate Sudoku puzzle (dummy implementation)
app.get('/generate-puzzle', (req, res) => {
    // Dummy Sudoku puzzle
    const puzzle = generateSudoku();

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
