const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateToken } = require('../middlewares/auth');

// Get all tasks for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks.' });
    }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, deadline, priority } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            deadline,
            priority,
            userId: req.user.id,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task.' });
    }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, priority, completed } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { title, description, deadline, priority, completed },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task.' });
    }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task.' });
    }
});

module.exports = router;
