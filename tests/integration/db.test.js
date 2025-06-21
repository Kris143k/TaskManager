const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

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

describe('Database Operations', () => {
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it('should save a task to the database', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    const savedTask = await task.save();
    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe('Test Task');
  });

  it('should retrieve all tasks from the database', async () => {
    await Task.create([
      { title: 'Task 1' },
      { title: 'Task 2' }
    ]);
    
    const tasks = await Task.find();
    expect(tasks.length).toBe(2);
  });
});