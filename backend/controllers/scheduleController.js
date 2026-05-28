const Schedule = require('../models/Schedule');

// @desc    Get all schedule events for a user
// @route   GET /api/schedule
// @access  Private
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ user: req.user.id }).sort({ startTime: 1 });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a schedule event
// @route   POST /api/schedule
// @access  Private
const createSchedule = async (req, res) => {
  const { title, type, dayOfWeek, startTime, endTime, location, color } = req.body;

  try {
    const newSchedule = new Schedule({
      user: req.user.id,
      title,
      type,
      dayOfWeek,
      startTime,
      endTime,
      location,
      color
    });

    const event = await newSchedule.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a schedule event
// @route   PUT /api/schedule/:id
// @access  Private
const updateSchedule = async (req, res) => {
  try {
    let event = await Schedule.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a schedule event
// @route   DELETE /api/schedule/:id
// @access  Private
const deleteSchedule = async (req, res) => {
  try {
    const event = await Schedule.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Schedule.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
