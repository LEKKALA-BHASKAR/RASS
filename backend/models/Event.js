import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  registeredAt: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: String,
    default: ""
  }
});

// Schema for agenda items
const agendaItemSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

// Schema for FAQ items
const faqItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Free", "Paid"],
    default: "Free"
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ""
  },
  // New fields for event details page
  aboutEvent: {
    type: String,
    default: ""
  },
  highlights: {
    type: [String],
    default: []
  },
  agenda: {
    type: [agendaItemSchema],
    default: []
  },
  faq: {
    type: [faqItemSchema],
    default: []
  },
  attendees: {
    type: [attendeeSchema],
    default: []
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.model("Event", eventSchema);