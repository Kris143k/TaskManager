# Task Manager Application

A simple task management application with a Node.js backend and HTML frontend.

## Features

- Create tasks with title, description, and status
- View all tasks
- Edit existing tasks
- Delete tasks
- Filter tasks by status (pending/completed)

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: HTML, JavaScript
- **Testing**: Jest, Supertest, MongoDB Memory Server

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   
2. Install dependencies:
```bash
npm install
Set up environment variables:
```

3. Create a .env file
Add your MongoDB connection string:
```bash
MONGODB_URI=mongodb://localhost:27017/taskmanager
PORT=3000
```

4. Start the application:
```bash
node server.js
Access the application at http://localhost:3000
```

## Testing
-The application includes three types of tests:

1. Unit Tests
Test the Task model validation:
```bash
npm run test:unit
```
Tests:
Task creation with default values
Title requirement validation

2. Integration Tests
Test database operations:
```bash
npm run test:integration
```
Tests:
Saving tasks to database
Retrieving tasks from database

3. API Tests
Test all API endpoints:
```bash
npm run test:api
```
Tests:
GET /api/tasks - Retrieve all tasks
POST /api/tasks - Create new task
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task

4. Running All Tests
```bash
npm test
```

5. Test Coverage
To generate a coverage report:
```bash
npm run test:coverage
```
