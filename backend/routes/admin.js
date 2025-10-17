// routes/admin.js
import express from "express";
import Event from "../models/Event.js";
import XLSX from "xlsx";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const eventValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("type").isIn(["Free", "Paid"]).withMessage("Type must be Free or Paid"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be a valid URL")
];

// Create Event
router.post("/create-event", eventValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ 
      message: "Event created successfully", 
      event 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Events with pagination and filtering
router.get("/events", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      search,
      sortBy = "date",
      sortOrder = "asc" 
    } = req.query;

    const query = {};
    
    // Filter by type
    if (type && type !== "all") {
      query.type = type;
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
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalEvents: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Event
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Event
router.put("/events/:id", eventValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ 
      message: "Event updated successfully", 
      event 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Event
router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ 
      message: "Event deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk Delete Events
router.delete("/events", async (req, res) => {
  try {
    const { eventIds } = req.body;
    
    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ error: "Event IDs array is required" });
    }

    const result = await Event.deleteMany({ _id: { $in: eventIds } });
    
    res.json({ 
      message: `${result.deletedCount} events deleted successfully` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Attendee to Event
router.post("/events/:id/attendees", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if attendee already exists
    const existingAttendee = event.attendees.find(
      attendee => attendee.email === email
    );

    if (existingAttendee) {
      return res.status(400).json({ error: "Attendee already registered" });
    }

    event.attendees.push({ name, email, phone, registeredAt: new Date() });
    await event.save();

    res.status(201).json({ 
      message: "Attendee added successfully", 
      attendee: event.attendees[event.attendees.length - 1] 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove Attendee from Event
router.delete("/events/:eventId/attendees/:attendeeId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.attendees = event.attendees.filter(
      attendee => attendee._id.toString() !== req.params.attendeeId
    );

    await event.save();

    res.json({ 
      message: "Attendee removed successfully" 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Event Attendees
router.get("/events/:id/attendees", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select("attendees title");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      eventTitle: event.title,
      attendees: event.attendees,
      totalAttendees: event.attendees.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export Attendees Excel
router.get("/export/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Format attendees data for Excel
    const attendeesData = event.attendees.map(attendee => ({
      Name: attendee.name,
      Email: attendee.email,
      Phone: attendee.phone || "N/A",
      "Registered Date": new Date(attendee.registeredAt).toLocaleDateString(),
      "Registered Time": new Date(attendee.registeredAt).toLocaleTimeString()
    }));

    const ws = XLSX.utils.json_to_sheet(attendeesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendees");

    // Add event info as a second sheet
    const eventInfo = [
      { "Event Title": event.title },
      { "Event Date": new Date(event.date).toLocaleDateString() },
      { "Event Location": event.location },
      { "Event Type": event.type },
      { "Total Attendees": event.attendees.length },
      { "Image URL": event.imageUrl || "N/A" }
    ];
    const eventWs = XLSX.utils.json_to_sheet(eventInfo);
    XLSX.utils.book_append_sheet(wb, eventWs, "Event Info");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    
    res.setHeader("Content-Disposition", `attachment; filename=${event.title.replace(/\s+/g, '_')}_attendees.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export All Events to Excel
router.get("/export-all/events", async (req, res) => {
  try {
    const events = await Event.find().populate("attendees");
    
    const eventsData = events.map(event => ({
      Title: event.title,
      Description: event.description,
      Date: new Date(event.date).toLocaleDateString(),
      Location: event.location,
      Type: event.type,
      Price: event.price,
      "Image URL": event.imageUrl || "N/A",
      "Total Attendees": event.attendees.length,
      "Created Date": new Date(event.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(eventsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Events");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    
    res.setHeader("Content-Disposition", "attachment; filename=all_events.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Dashboard Statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalAttendees = await Event.aggregate([
      { $project: { attendeesCount: { $size: "$attendees" } } },
      { $group: { _id: null, total: { $sum: "$attendeesCount" } } }
    ]);
    
    const eventsByType = await Event.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title date attendees imageUrl");

    const upcomingEvents = await Event.find({
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(5)
    .select("title date location imageUrl");

    res.json({
      totalEvents,
      totalAttendees: totalAttendees[0]?.total || 0,
      eventsByType,
      recentEvents,
      upcomingEvents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Duplicate Event
router.post("/events/:id/duplicate", async (req, res) => {
  try {
    const originalEvent = await Event.findById(req.params.id);
    if (!originalEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const duplicatedEvent = new Event({
      ...originalEvent.toObject(),
      _id: undefined,
      title: `${originalEvent.title} (Copy)`,
      attendees: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedEvent.save();

    res.status(201).json({
      message: "Event duplicated successfully",
      event: duplicatedEvent
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;