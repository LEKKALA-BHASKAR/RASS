import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import { authenticate, authorize } from '../middleware/auth.js';
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js"; // if you track enrollments separately

const router = express.Router();

// --------------------
// Get user's support tickets with pagination
// --------------------
router.get('/my-tickets', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const tickets = await SupportTicket.find({ user: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Get all support tickets (Admin only) with filters & pagination
// --------------------
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Create a support ticket
// --------------------
router.post('/', authenticate, async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (!subject || !description || !category) {
      return res.status(400).json({ message: "Subject, description, and category are required" });
    }

    const ticketData = {
      subject,
      description,
      category,
      priority: priority || 'medium',
      user: req.user._id,
      messages: [{ sender: req.user._id, message: description, isStaff: false }]
    };

    const ticket = new SupportTicket(ticketData);
    await ticket.save();

    const populatedTicket = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email role');

    // 🔔 Notify all admins
    const admins = await User.find({ role: "admin" }, "_id");
    const notifications = admins.map(
      (a) =>
        new Notification({
          recipient: a._id,
          title: "New Support Ticket",
          type: "support",
          message: `New ticket "${subject}" created by ${req.user.name}`,
          relatedId: ticket._id,
        })
    );
    await Notification.insertMany(notifications);

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// --------------------
// Add message to ticket
// --------------------
router.post("/:id/message", authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message cannot be empty" });

    const ticket = await SupportTicket.findById(req.params.id).populate("user", "_id name");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ✅ Check permissions
    const isStudent = ticket.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    let isInstructor = false;
    if (req.user.role === "instructor") {
      const studentEnrollments = await Enrollment.find({ student: ticket.user._id });
      const courseIds = studentEnrollments.map((e) => e.course);
      const instructorCourses = await Course.find({
        _id: { $in: courseIds },
        instructor: req.user._id,
      });
      isInstructor = instructorCourses.length > 0;
    }

    if (!isStudent && !isAdmin && !isInstructor) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Push message
    ticket.messages.push({
      sender: req.user._id,
      message,
      isStaff: req.user.role === "admin" || req.user.role === "instructor",
    });

    if ((req.user.role === "admin" || req.user.role === "instructor") && ticket.status === "open") {
      ticket.status = "in-progress";
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("messages.sender", "name email role");

    // 🔔 Notifications
    if (req.user.role === "admin" || req.user.role === "instructor") {
      // notify student
      await new Notification({
        recipient: ticket.user._id,
        title: "Support Ticket Reply",
        type: "support",
        message: `Your ticket "${ticket.subject}" has a reply from ${req.user.name}`,
        relatedId: ticket._id,
      }).save();
    } else {
      // student replied → notify assigned admin/instructor if exists
      if (ticket.assignedTo) {
        await new Notification({
          recipient: ticket.assignedTo,
          title: "Ticket Updated",
          type: "support",
          message: `Ticket "${ticket.subject}" has a new reply from ${req.user.name}`,
          relatedId: ticket._id,
        }).save();
      }
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error adding ticket message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Update ticket status (Admin/Instructor)
// --------------------
router.put("/:id/status", authenticate, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const allowedStatuses = ["open", "in-progress", "resolved", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await SupportTicket.findById(req.params.id).populate("user", "_id name");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isAdmin = req.user.role === "admin";

    let isInstructor = false;
    if (req.user.role === "instructor") {
      const studentEnrollments = await Enrollment.find({ student: ticket.user._id });
      const courseIds = studentEnrollments.map((e) => e.course);
      const instructorCourses = await Course.find({
        _id: { $in: courseIds },
        instructor: req.user._id,
      });
      isInstructor = instructorCourses.length > 0;
    }

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({ message: "Access denied" });
    }

    ticket.status = status;
    if (isAdmin && assignedTo) ticket.assignedTo = assignedTo;
    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    // 🔔 Notify student of status change
    await new Notification({
      recipient: ticket.user._id,
      title: "Support Ticket Status Updated",
      type: "support",
      message: `Your ticket "${ticket.subject}" status is now "${ticket.status}"`,
      relatedId: ticket._id,
    }).save();

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// --------------------
// Delete ticket (User or Admin)
// --------------------
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    await ticket.remove();
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Add attachment to ticket
// --------------------
router.post('/:id/attachments', authenticate, async (req, res) => {
  try {
    const { filename, url } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.attachments.push({ filename, url });
    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email role')
      .populate('assignedTo', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/instructor", authenticate, authorize("instructor"), async (req, res) => {
  try {
    // 1️⃣ Get courses owned by this instructor
    const instructorCourses = await Course.find({ instructor: req.user._id }, "_id");
    const courseIds = instructorCourses.map((c) => c._id);

    // 2️⃣ Get all students enrolled in these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } }, "student");
    const studentIds = enrollments.map((e) => e.student);

    // 3️⃣ Fetch tickets raised by those students
    const tickets = await SupportTicket.find({ user: { $in: studentIds } })
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("messages.sender", "name email role")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching instructor tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// --------------------
// Get all support tickets (Admin only) with filters & pagination
// --------------------
router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
