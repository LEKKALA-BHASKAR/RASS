import express from 'express';
import Forum from '../models/Forum.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get forum posts for a course (with optional category filter)
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { category } = req.query;
    let query = { course: req.params.courseId };

    if (category) query.category = category;

    const posts = await Forum.find(query)
      .populate('author', 'name profile.avatar role')
      .populate('replies.author', 'name profile.avatar role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single forum post by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id)
      .populate('author', 'name profile.avatar role')
      .populate('replies.author', 'name profile.avatar role');

    if (!post) return res.status(404).json({ message: 'Forum post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create forum post
router.post('/', authenticate, async (req, res) => {
  try {
    const forumPost = new Forum({
      ...req.body,
      author: req.user._id
    });

    await forumPost.save();

    const populatedPost = await Forum.findById(forumPost._id)
      .populate('author', 'name profile.avatar role');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add reply to forum post
router.post('/:id/reply', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    const forumPost = await Forum.findById(req.params.id);
    if (!forumPost) return res.status(404).json({ message: 'Forum post not found' });
    if (forumPost.isLocked) return res.status(403).json({ message: 'This forum post is locked' });

    forumPost.replies.push({
      author: req.user._id,
      content
    });

    await forumPost.save();

    const updatedPost = await Forum.findById(forumPost._id)
      .populate('author', 'name profile.avatar role')
      .populate('replies.author', 'name profile.avatar role');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike forum post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const forumPost = await Forum.findById(req.params.id);
    if (!forumPost) return res.status(404).json({ message: 'Forum post not found' });

    const likeIndex = forumPost.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      forumPost.likes.push(req.user._id);
    } else {
      forumPost.likes.splice(likeIndex, 1);
    }

    await forumPost.save();
    res.json(forumPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike reply
router.post('/:forumId/reply/:replyId/like', authenticate, async (req, res) => {
  try {
    const forumPost = await Forum.findById(req.params.forumId);
    if (!forumPost) return res.status(404).json({ message: 'Forum post not found' });

    const reply = forumPost.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const likeIndex = reply.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      reply.likes.push(req.user._id);
    } else {
      reply.likes.splice(likeIndex, 1);
    }

    await forumPost.save();
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pin/Unpin post (admin/instructor only)
router.post('/:id/pin', authenticate, async (req, res) => {
  try {
    const forumPost = await Forum.findById(req.params.id);
    if (!forumPost) return res.status(404).json({ message: 'Forum post not found' });

    forumPost.isPinned = !forumPost.isPinned;
    await forumPost.save();

    res.json(forumPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lock/Unlock post (admin/instructor only)
router.post('/:id/lock', authenticate, async (req, res) => {
  try {
    const forumPost = await Forum.findById(req.params.id);
    if (!forumPost) return res.status(404).json({ message: 'Forum post not found' });

    forumPost.isLocked = !forumPost.isLocked;
    await forumPost.save();

    res.json(forumPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
