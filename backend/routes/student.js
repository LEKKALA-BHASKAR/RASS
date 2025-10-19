// routes/student.js
import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Get all events for students
router.get("/events", async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const events = await Event.find({
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(parseInt(limit));

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get featured events for students
router.get("/events/featured", async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(5);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register for an event (deprecated - using admin route instead)
router.post("/events/:id/register", async (req, res) => {
  try {
    // This endpoint is deprecated. Use the admin route instead.
    res.status(400).json({ 
      error: "This endpoint is deprecated. Please use the admin registration endpoint instead.",
      endpoint: "/api/admin/events/:id/attendees"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;