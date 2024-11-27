const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required.'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Task description is required.'],
            trim: true,
        },
        deadline: {
            type: Date,
            validate: {
                validator: (value) => !isNaN(Date.parse(value)),
                message: 'Deadline must be a valid date.',
            },
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: [true, 'Task priority is required.'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Task', taskSchema);
