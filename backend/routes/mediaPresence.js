import express from 'express';
import MediaPresence from '../models/MediaPresence.js';
import { authenticate as auth } from '../middleware/auth.js';

console.log('Loading mediaPresence.js route file');

const router = express.Router();

console.log('Created router for mediaPresence');

// Get all active media presence items (public route)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/media-presence called');
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
    console.log('GET /api/media-presence/all called');
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
    console.log('POST /api/media-presence called');
    console.log('User:', req.user);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, imageUrl, journalLink, order, isActive } = req.body;
    console.log('Request body:', req.body);

    const newMediaItem = new MediaPresence({
      title,
      description,
      imageUrl,
      journalLink,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const mediaItem = await newMediaItem.save();
    console.log('Media item saved:', mediaItem);
    res.json(mediaItem);
  } catch (err) {
    console.error('Error creating media item:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a media presence item (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('PUT /api/media-presence/:id called');
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
    console.log('DELETE /api/media-presence/:id called');
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const mediaItem = await MediaPresence.findById(req.params.id);

    if (!mediaItem) {
      return res.status(404).json({ msg: 'Media item not found' });
    }

    await MediaPresence.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Media item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

console.log('Exporting mediaPresence router');

export default router;