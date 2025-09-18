import express from "express";
import mongoose from "mongoose"; 
import Chat from "../models/Chat.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* --------------------- STUDENT → INSTRUCTOR + ADMINS --------------------- */
router.post("/:courseId", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const studentId = req.user._id;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const admins = await User.find({ role: "admin" }, "_id name");
    const participantIds = [course.instructor._id, ...admins.map((a) => a._id)];

    // ✅ Ensure course is part of query
    let chat = await Chat.findOne({
      course: courseId,
      student: studentId,
    });

    if (!chat) {
      chat = new Chat({
        course: courseId,
        student: studentId,
        participants: participantIds,
        messages: [],
      });
    }

    chat.messages.push({ sender: studentId, content });
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate("student", "name role")
      .populate("participants", "name role")
      .populate("messages.sender", "name role");

    // 🔔 Notifications for instructor + admins
    for (const recipientId of participantIds) {
      await Notification.create({
        recipient: recipientId,
        title: "New Message from Student",
        message: `${req.user.name} sent: "${content}"`,
        type: "chat",
        relatedId: chat._id,
      });
    }

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* --------------------- INSTRUCTOR/ADMIN → STUDENT --------------------- */
router.post("/:courseId/:studentId", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const admins = await User.find({ role: "admin" }, "_id name");
    const participantIds = [course.instructor._id, ...admins.map(a => a._id)];

    let chat = await Chat.findOne({
      course: new mongoose.Types.ObjectId(courseId),
      student: new mongoose.Types.ObjectId(studentId),
      participants: { $in: participantIds }
    });

    if (!chat) {
      chat = new Chat({
        course: new mongoose.Types.ObjectId(courseId),
        student: new mongoose.Types.ObjectId(studentId),
        participants: participantIds,
        messages: []
      });
    }

    chat.messages.push({ sender: req.user._id, content });
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate("student", "name role")
      .populate("participants", "name role")
      .populate("messages.sender", "name role");

    // 🔔 Notify student
    await Notification.create({
      recipient: studentId,
      title: "New Message from Mentor/Admin",
      message: `${req.user.name} sent: "${content}"`,
      type: "chat",
      relatedId: chat._id
    });

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("Error in mentor→student chat:", error); // ✅ debug
    res.status(500).json({ message: error.message });
  }
});


/* --------------------- GET STUDENT'S CHATS --------------------- */
router.get("/student", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ student: req.user._id })
      .populate("participants", "name role")
      .populate("messages.sender", "name role")
      .populate("course", "title");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* --------------------- GET MENTOR/ADMIN CHATS --------------------- */
router.get("/mentor", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("student", "_id name role")    // ✅ include _id
      .populate("course", "_id title")         // ✅ include _id and title
      .populate("messages.sender", "name role");

    res.json(chats);
  } catch (error) {
    console.error("Error fetching mentor chats:", error);
    res.status(500).json({ message: error.message });
  }
});
/* --------------------- GET CHAT BY ID --------------------- */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("student", "name role")
      .populate("participants", "name role")
      .populate("messages.sender", "name role")
      .populate("course", "title");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
