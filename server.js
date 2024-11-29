require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Ensure correct path to your User model
const { authenticateToken } = require('./middlewares/auth'); // Authentication middleware

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
app.use('/users', userRoutes);
app.use('/tasks', authenticateToken, taskRoutes); // Protect task routes

// Register route for new users
app.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;

    // Ensure email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Check if the email is already taken (if email is unique)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ error: 'Email is already taken.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        username,
        password: hashedPassword,
        role: role || 'user', // Default to 'user' role if no role is provided
        email, // Ensure the email is provided
    });

    try {
        // Save the new user to the database
        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                role: savedUser.role,
                email: savedUser.email, // Return email too if necessary
            },
        });
    } catch (error) {
        console.error('Error during user registration:', error); // Log the error
        res.status(500).json({ error: 'Failed to register user.', details: error.message });
    }
});

// Login route for user authentication and JWT token generation
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Debugging: Log the received username and password
    console.log("Received Login Attempt:", { username, password });

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        console.log("User not found:", username);  // Log if the user is not found
        return res.status(400).json({ error: 'Invalid username or password.' });
    }

    console.log("User found:", { username: user.username, email: user.email, role: user.role });  // Log user details (not password)

    // Manually hash the password and compare it
    const bcryptPasswordComparison = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", bcryptPasswordComparison);  // Log the comparison result

    if (!bcryptPasswordComparison) {
        console.log("Password mismatch:", { username, password });  // Log mismatched password
        return res.status(400).json({ error: 'Invalid username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Generated JWT Token:", token);  // Debugging: Log the generated token

    res.json({ token });
});

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
