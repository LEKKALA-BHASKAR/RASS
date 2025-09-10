import express from 'express';
import LiveSession from '../models/LiveSession.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get live sessions for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const sessions = await LiveSession.find({ course: req.params.courseId })
      .populate('instructor', 'name email')
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create live session (Instructor/Admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      instructor: req.user._id
    };

    const session = new LiveSession(sessionData);
    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join live session
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if already joined
    const existingAttendee = session.attendees.find(
      a => a.student.toString() === req.user._id.toString()
    );

    if (!existingAttendee) {
      session.attendees.push({
        student: req.user._id,
        joinedAt: new Date()
      });
      await session.save();
    }

    res.json({ meetingLink: session.meetingLink, meetingId: session.meetingId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update session status
router.put('/:id/status', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const session = await LiveSession.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;