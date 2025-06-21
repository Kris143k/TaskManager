const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Setup in-memory MongoDB
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

// Define the Task schema with required title
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },  // This makes title required
  description: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

describe('Task Model', () => {
  it('should create a task with default values', () => {
    const task = new Task({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.status).toBe('pending');
    expect(task.createdAt).toBeInstanceOf(Date);
  });
  
  it('should require a title', async () => {
    const task = new Task({ description: 'Test Description' });
    
    let error;
    try {
      await task.validate();
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.title.message).toContain('required');
  });
});