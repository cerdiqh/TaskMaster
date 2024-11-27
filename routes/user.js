const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Attempting to log in user:', username);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found in database.');
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log('User found. Checking password...');
        console.log('Hashed password in database:', user.password);

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful. Token generated.');
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to log in.' });
    }
});

module.exports = router;
