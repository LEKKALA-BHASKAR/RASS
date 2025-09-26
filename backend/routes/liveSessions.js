import express from 'express';
import LiveSession from '../models/LiveSession.js';
import Notification from '../models/Notification.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/course/:courseId',authenticate,authorize('instructor', 'admin'),
  async (req, res) => {
    try {
      const sessionData = {
        ...req.body,
        course: req.params.courseId,
        instructor: req.user._id,
      };

      const session = new LiveSession(sessionData);
      await session.save();

      // 🔔 Notify enrolled students
const enrolledStudents = await Enrollment.find({ course: req.params.courseId }).populate("student");
const notifications = enrolledStudents
  .filter(enroll => enroll.student)
  .map(enroll =>
    new Notification({
      recipient: enroll.student._id,
      title: "New Live Session Scheduled",
      type: "live-session",
      message: `A live session "${session.title}" has been scheduled for your course.`,
      relatedId: session._id,
    })
  );

if (notifications.length > 0) {
  await Notification.insertMany(notifications);
}

    return res.status(201).json({ success: true, session });
    } catch (error) {
      console.error("❌ Error creating session:", error);
    }
  }
);


// 🔹 Get sessions for a course
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

// 🔹 Get all sessions for logged-in student
router.get('/my', authenticate, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).select("course");
    const courseIds = enrollments.map((e) => e.course);

    const sessions = await LiveSession.find({ course: { $in: courseIds } })
      .populate("instructor", "name email")
      .populate("course", "title")
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 🔹 Update live session
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const updatedSession = await LiveSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Delete live session
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Live session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Join session
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const existingAttendee = session.attendees.find(
      (a) => a.student.toString() === req.user._id.toString()
    );

    if (!existingAttendee) {
      session.attendees.push({
        student: req.user._id,
        joinedAt: new Date(),
      });
      await session.save();
    }

    res.json({ meetingLink: session.meetingLink, meetingId: session.meetingId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Update session status (e.g. go LIVE)
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

    if (status === "live") {
      const enrolledStudents = await Enrollment.find({ course: session.course }).populate("student");
      const notifications = enrolledStudents.map(
        (enroll) =>
          new Notification({
            recipient: enroll.student._id,
            title: "Live Session Started",
            type: "live-session",
            message: `Your session "${session.title}" is now LIVE. Join now!`,
            relatedId: session._id,
          })
      );
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
