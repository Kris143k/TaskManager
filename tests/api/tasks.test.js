const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create a test app with the same setup as server.js
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

// Add routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Tasks API', () => {
  it('GET /api/tasks - should return all tasks', async () => {
    await Task.create({ title: 'Test Task' });
    
    const response = await request(app)
      .get('/api/tasks')
      .expect(200);
      
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Test Task');
  });

  it('POST /api/tasks - should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', description: 'Task Description' })
      .expect(200);
      
    expect(response.body.title).toBe('New Task');
    expect(response.body.status).toBe('pending');
  });

  it('PUT /api/tasks/:id - should update a task', async () => {
    const task = await Task.create({ title: 'Old Title' });
    
    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: 'New Title' })
      .expect(200);
      
    expect(response.body.title).toBe('New Title');
  });

  it('DELETE /api/tasks/:id - should delete a task', async () => {
    const task = await Task.create({ title: 'Task to delete' });
    
    await request(app)
      .delete(`/api/tasks/${task._id}`)
      .expect(200);
      
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});