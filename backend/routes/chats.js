import express from 'express';
import Chat from '../models/Chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Start chat / send message
router.post('/:mentorId', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const studentId = req.user._id;
        const mentorId = req.params.mentorId;

        let chat = await Chat.findOne({ student: studentId, mentor: mentorId });
        if (!chat) {
            chat = new Chat({ student: studentId, mentor: mentorId, messages: [] });
        }

        chat.messages.push({ sender: studentId, content });
        await chat.save();

        const populatedChat = await Chat.findById(chat._id)
            .populate('student', 'name profile.avatar role')
            .populate('mentor', 'name profile.avatar role')
            .populate('messages.sender', 'name profile.avatar role');

        res.status(201).json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all chats for student
router.get('/student', authenticate, async (req, res) => {
    try {
        const chats = await Chat.find({ student: req.user._id })
            .populate('mentor', 'name profile.avatar role')
            .populate('messages.sender', 'name profile.avatar role');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all chats for mentor
router.get('/mentor', authenticate, async (req, res) => {
    try {
        const chats = await Chat.find({ mentor: req.user._id })
            .populate('student', 'name profile.avatar role')
            .populate('messages.sender', 'name profile.avatar role');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single chat conversation
router.get('/:chatId', authenticate, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('student', 'name profile.avatar role')
            .populate('mentor', 'name profile.avatar role')
            .populate('messages.sender', 'name profile.avatar role');
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
