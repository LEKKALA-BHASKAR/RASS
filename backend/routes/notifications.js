import express from "express";
import Notification from "../models/Notification.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// 📌 Get notifications for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Create a new notification (Instructor/Admin only)
router.post("/", authenticate, authorize("instructor", "admin"), async (req, res) => {
  try {
    const { recipientId, title, type, message } = req.body;

    const notification = new Notification({
      recipient: recipientId,
      title,
      type,
      message,
      read: false,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📌 Mark single notification as read
router.put("/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Mark all notifications as read
router.put("/read-all", authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Get unread notifications count
router.get("/unread-count", authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all live sessions for a student (all enrolled courses)
router.get('/my-sessions', authenticate, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course");
    const courseIds = enrollments.map(e => e.course._id);

    const sessions = await LiveSession.find({ course: { $in: courseIds } })
      .populate("instructor", "name email")
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
