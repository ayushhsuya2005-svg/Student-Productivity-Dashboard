const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, priority, category, dueDate } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      priority,
      category,
      dueDate
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
