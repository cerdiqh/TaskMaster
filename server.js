require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middlewares/auth'); // Import authentication middleware

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

app.use('/users', userRoutes);
app.use('/tasks', authenticateToken, taskRoutes); // Protect task routes

// Root route serves the frontend's index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmaster';
mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1); // Exit the process if the database connection fails
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
