const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
