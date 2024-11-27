# TaskMaster

TaskMaster is a role-based task management system designed to support both users and admins. It allows task creation, filtering, and management with authentication.

---

## Features

- **User Roles**: Supports two roles: regular users and admins.
- **Task Management**:
  - Add tasks (all users).
  - View tasks (all users).
  - Delete tasks (admins only).
  - Mark tasks as completed.
- **Filters**:
  - Filter tasks by priority or deadline.
- **Admin Features**:
  - Manage users (view and delete).

---

## Live Demo

The live version of the application is available here: [TaskMaster Live App](#)  
*(Replace `#` with your app's URL after deployment.)*

---

## Screenshots

### 1. **User Login**
Users can log in with their credentials, selecting a role (`user` or `admin`):

![User Login Screenshot](screenshots/login.png)

---

### 2. **Task Dashboard**
Users can view tasks, add new tasks, and apply filters for better organization:

![Task Dashboard Screenshot](screenshots/dashboard.png)

---

### 3. **Admin View**
Admins can manage users and delete tasks. Admin-only features are restricted to admin roles:

![Admin View Screenshot](screenshots/admin.png)

---

## How to Run Locally

### Prerequisites

- Node.js
- MongoDB

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd taskmaster
