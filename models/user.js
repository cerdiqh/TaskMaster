const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
            required: [true, 'User role is required.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true, // Ensure email is unique
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('User', userSchema);
