import express from "express";
import Chat from "../models/Chat.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// 📌 Student → Course Instructor + Admins
router.post("/:courseId", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const studentId = req.user._id;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const admins = await User.find({ role: "admin" }, "_id name");

    const participantIds = [course.instructor._id, ...admins.map(a => a._id)];

    let chat = await Chat.findOne({ student: studentId, participants: { $in: participantIds } });
    if (!chat) {
      chat = new Chat({ student: studentId, participants: participantIds, messages: [] });
    }

    chat.messages.push({ sender: studentId, content });
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate("student", "name role")
      .populate("participants", "name role")
      .populate("messages.sender", "name role");

    // 🔔 Create notifications for instructor + all admins
    for (const recipientId of participantIds) {
      await Notification.create({
        recipient: recipientId,
        title: "New Message from Student",
        message: `${req.user.name} sent: "${content}"`,
        type: "chat",
        relatedId: chat._id
      });
    }

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Mentor/Admin → Student
router.post("/:courseId/:studentId", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const admins = await User.find({ role: "admin" }, "_id name");
    const participantIds = [course.instructor._id, ...admins.map(a => a._id)];

    let chat = await Chat.findOne({ student: studentId, participants: { $in: participantIds } });
    if (!chat) {
      chat = new Chat({ student: studentId, participants: participantIds, messages: [] });
    }

    chat.messages.push({ sender: req.user._id, content });
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate("student", "name role")
      .populate("participants", "name role")
      .populate("messages.sender", "name role");

    // 🔔 Create notification for student
    await Notification.create({
      recipient: studentId,
      title: "New Message from Mentor/Admin",
      message: `${req.user.name} sent: "${content}"`,
      type: "chat",
      relatedId: chat._id
    });

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Student's chats
router.get("/student", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ student: req.user._id })
      .populate("participants", "name role")
      .populate("messages.sender", "name role");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Mentor/Admin chats
router.get("/mentor", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("student", "name role")
      .populate("messages.sender", "name role");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
