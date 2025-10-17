import express from 'express';
import MediaPresence from '../models/MediaPresence.js';
import { authenticate as auth } from '../middleware/auth.js';


const router = express.Router();


// Get all active media presence items (public route)
router.get('/', async (req, res) => {
  try {
    const mediaItems = await MediaPresence.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json(mediaItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all media presence items (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const mediaItems = await MediaPresence.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json(mediaItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new media presence item (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, imageUrl, journalLink, order, isActive } = req.body;

    const newMediaItem = new MediaPresence({
      title,
      description,
      imageUrl,
      journalLink,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const mediaItem = await newMediaItem.save();
    res.json(mediaItem);
  } catch (err) {
    console.error('Error creating media item:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a media presence item (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, imageUrl, journalLink, order, isActive } = req.body;
    
    // Build media item object
    const mediaItemFields = {};
    if (title !== undefined) mediaItemFields.title = title;
    if (description !== undefined) mediaItemFields.description = description;
    if (imageUrl !== undefined) mediaItemFields.imageUrl = imageUrl;
    if (journalLink !== undefined) mediaItemFields.journalLink = journalLink;
    if (order !== undefined) mediaItemFields.order = order;
    if (isActive !== undefined) mediaItemFields.isActive = isActive;

    let mediaItem = await MediaPresence.findById(req.params.id);

    if (!mediaItem) {
      return res.status(404).json({ msg: 'Media item not found' });
    }

    mediaItem = await MediaPresence.findByIdAndUpdate(
      req.params.id,
      { $set: mediaItemFields },
      { new: true }
    );

    res.json(mediaItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a media presence item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const mediaItem = await MediaPresence.findById(req.params.id);

    if (!mediaItem) {
      return res.status(404).json({ msg: 'Media item not found' });
    }

    await MediaPresence.findByIdAndRemove(req.params.id);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;