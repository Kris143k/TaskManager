require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();

// Serve static files (frontend)
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Task Model
const Task = mongoose.model('Task', new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}));

// API Endpoints

// 1. Get all tasks (READ)
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. Create a new task (CREATE)
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description
        });
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// 3. Update a task (UPDATE)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        }, { new: true });
        
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// 4. Delete a task (DELETE)
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));