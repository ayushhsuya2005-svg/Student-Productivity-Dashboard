const Note = require('../models/Note');

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const newNote = new Note({
      user: req.user.id,
      title,
      content,
      tags
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};
