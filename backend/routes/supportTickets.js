import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user's support tickets
router.get('/my-tickets', authenticate, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all support tickets (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create support ticket
router.post('/', authenticate, async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      user: req.user._id,
      messages: [{
        sender: req.user._id,
        message: req.body.description,
        isStaff: false
      }]
    };

    const ticket = new SupportTicket(ticketData);
    await ticket.save();

    const populatedTicket = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email role');

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add message to ticket
router.post('/:id/message', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can access this ticket
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
      isStaff: req.user.role === 'admin'
    });

    // Update status if admin is responding
    if (req.user.role === 'admin' && ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email role');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ticket status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, ...(assignedTo && { assignedTo }) },
      { new: true }
    ).populate('user', 'name email')
     .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;