document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const authMessage = document.getElementById('auth-message');
    const tasksMessage = document.getElementById('tasks-message');
    const authSection = document.getElementById('auth');
    const tasksSection = document.getElementById('tasks');

    let token = null; // To store the JWT token

    // Handle Login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                token = data.token;

                // Switch to the tasks section
                authSection.style.display = 'none';
                tasksSection.style.display = 'block';
                authMessage.textContent = '';
                loadTasks();
            } else {
                const error = await response.json();
                authMessage.textContent = error.error || 'Login failed.';
            }
        } catch (error) {
            console.error('Error logging in:', error);
            authMessage.textContent = 'An error occurred while logging in.';
        }
    });

    // Load Tasks
    async function loadTasks() {
        try {
            const response = await fetch('/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const tasks = await response.json();
                taskList.innerHTML = '';

                tasks.forEach((task) => {
                    const li = document.createElement('li');
                    li.textContent = `${task.title} (${task.priority}) - ${task.deadline || 'No deadline'}`;
                    taskList.appendChild(li);
                });

                tasksMessage.textContent = '';
            } else {
                tasksMessage.textContent = 'Failed to load tasks.';
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksMessage.textContent = 'An error occurred while loading tasks.';
        }
    }

    // Add New Task
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const priority = document.getElementById('priority').value;

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, deadline, priority }),
            });

            if (response.ok) {
                taskForm.reset();
                loadTasks();
                tasksMessage.textContent = 'Task added successfully!';
            } else {
                tasksMessage.textContent = 'Failed to add task.';
            }
        } catch (error) {
            console.error('Error adding task:', error);
            tasksMessage.textContent = 'An error occurred while adding the task.';
        }
    });
});
