import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import { authenticate, authorize } from '../middleware/auth.js';

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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Create a support ticket
// --------------------
router.post('/', authenticate, async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;

    // Validation
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

    res.status(201).json(populatedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Add message to ticket
// --------------------
router.post('/:id/message', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message cannot be empty" });

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Authorization check
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
      isStaff: req.user.role === 'admin'
    });

    if (req.user.role === 'admin' && ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email role');

    res.json(updatedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Update ticket status (Admin only)
// --------------------
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const allowedStatuses = ['open', 'in-progress', 'resolved', 'closed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, ...(assignedTo && { assignedTo }) },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(ticket);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Add attachment to ticket
router.post('/:id/attachments', authenticate, async (req, res) => {
  try {
    const { filename, url } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can access this ticket
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

export default router;
