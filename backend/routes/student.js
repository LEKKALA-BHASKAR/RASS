// routes/student.js
import express from "express";
import Event from "../models/Event.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware for registration
const registrationValidation = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").optional().isMobilePhone().withMessage("Valid phone number is required")
];

// Get All Events with filtering and pagination
router.get("/events", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      type, 
      search,
      sortBy = "date",
      sortOrder = "asc",
      upcoming = "true" 
    } = req.query;

    const query = {};
    
    // Filter by type
    if (type && type !== "all") {
      query.type = type;
    }

    // Filter for upcoming events only
    if (upcoming === "true") {
      query.date = { $gte: new Date() };
    }

    // Search in title, description, or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const events = await Event.find(query)
      .select("title description date location type price imageUrl attendees")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalEvents: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get Featured Events (upcoming events with most attendees)
router.get("/events/featured", async (req, res) => {
  try {
    const featuredEvents = await Event.find({
      date: { $gte: new Date() }
    })
    .select("title description date location type price imageUrl attendees")
    .sort({ "attendees.length": -1, date: 1 })
    .limit(6);

    res.json(featuredEvents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured events" });
  }
});

// Get Event Details
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select("title description date location type price imageUrl attendees createdAt");
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event has passed
    const isPastEvent = new Date(event.date) < new Date();
    const availableSpots = event.type === "Paid" ? 1000 : 500; // Example capacity

    res.json({
      ...event.toObject(),
      isPastEvent,
      availableSpots,
      totalAttendees: event.attendees.length
    });
  } catch (err) {
    res.status(404).json({ error: "Event not found" });
  }
});

// Register for an Event
router.post("/events/:id/register", registrationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ error: "Cannot register for past events" });
    }

    // Check if attendee already registered
    const existingAttendee = event.attendees.find(
      attendee => attendee.email === req.body.email
    );

    if (existingAttendee) {
      return res.status(400).json({ error: "You are already registered for this event" });
    }

    // Check capacity (example limits)
    const maxCapacity = event.type === "Paid" ? 1000 : 500;
    if (event.attendees.length >= maxCapacity) {
      return res.status(400).json({ error: "This event is full" });
    }

    const newAttendee = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      registeredAt: new Date()
    };

    event.attendees.push(newAttendee);
    await event.save();

    res.status(201).json({ 
      message: "Successfully registered for the event!",
      registration: {
        eventTitle: event.title,
        eventDate: event.date,
        location: event.location,
        attendee: newAttendee,
        confirmationId: `EVT-${event._id.toString().slice(-6)}-${Date.now().toString().slice(-6)}`
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Check Registration Status
router.get("/events/:id/check-registration/:email", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isRegistered = event.attendees.some(
      attendee => attendee.email === req.params.email
    );

    res.json({ isRegistered });
  } catch (err) {
    res.status(500).json({ error: "Failed to check registration status" });
  }
});

// Get Upcoming Events (next 30 days)
router.get("/events/upcoming", async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingEvents = await Event.find({
      date: { 
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    })
    .select("title description date location type price imageUrl attendees")
    .sort({ date: 1 })
    .limit(20);

    res.json(upcomingEvents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
});

// Get Events by Category
router.get("/events/category/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 12 } = req.query;

    if (!["Free", "Paid"].includes(type)) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    const events = await Event.find({ 
      type,
      date: { $gte: new Date() }
    })
    .select("title description date location type price imageUrl attendees")
    .sort({ date: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Event.countDocuments({ 
      type,
      date: { $gte: new Date() }
    });

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalEvents: total
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events by category" });
  }
});

// Search Events
router.get("/events/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const events = await Event.find({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } }
          ]
        },
        { date: { $gte: new Date() } }
      ]
    })
    .select("title description date location type price imageUrl attendees")
    .sort({ date: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Event.countDocuments({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } }
          ]
        },
        { date: { $gte: new Date() } }
      ]
    });

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalEvents: total,
      searchQuery: query
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to search events" });
  }
});

// Get Event Statistics (for student dashboard)
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalUpcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() }
    });

    const freeEventsCount = await Event.countDocuments({
      type: "Free",
      date: { $gte: new Date() }
    });

    const paidEventsCount = await Event.countDocuments({
      type: "Paid",
      date: { $gte: new Date() }
    });

    const nextWeekEvents = await Event.countDocuments({
      date: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      totalUpcomingEvents,
      freeEventsCount,
      paidEventsCount,
      nextWeekEvents
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// Get Similar Events
router.get("/events/:id/similar", async (req, res) => {
  try {
    const currentEvent = await Event.findById(req.params.id);
    if (!currentEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const similarEvents = await Event.find({
      _id: { $ne: currentEvent._id },
      type: currentEvent.type,
      date: { $gte: new Date() }
    })
    .select("title description date location type price imageUrl attendees")
    .sort({ date: 1 })
    .limit(4);

    res.json(similarEvents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch similar events" });
  }
});

export default router;