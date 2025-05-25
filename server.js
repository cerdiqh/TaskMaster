require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Ensure correct path to your User model
const { authenticateToken } = require('./middlewares/auth'); // Authentication middleware

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS - consider configuring for production
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
app.use('/users', userRoutes);
app.use('/tasks', authenticateToken, taskRoutes); // Protect task routes

// Register route for new users
app.post('/register', async (req, res) => {
  try {
    const { username, password, role, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'user',
      email,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Login route for user authentication and JWT token generation
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route serves the frontend's index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmaster';
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));