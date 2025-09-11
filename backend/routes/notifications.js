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

export default router;
