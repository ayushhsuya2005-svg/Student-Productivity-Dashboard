const express = require('express');
const router = express.Router();
const {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getSchedule)
  .post(protect, createSchedule);

router.route('/:id')
  .put(protect, updateSchedule)
  .delete(protect, deleteSchedule);

module.exports = router;
