import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';
import assignmentRoutes from './routes/assignments.js';
import forumRoutes from './routes/forums.js';
import notificationRoutes from './routes/notifications.js';
import liveSessionRoutes from './routes/liveSessions.js';
import certificateRoutes from './routes/certificates.js';
import supportTicketRoutes from './routes/supportTickets.js';
import chatRoutes from './routes/chats.js';
import paymentRoutes from './routes/payment.js';
import mediaPresenceRoutes from './routes/mediaPresence.js';
import nodemailer from "nodemailer";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
import StudentAmbassadorForm from './routes/StudentAmbassadorForm.js';
import CompanyPartnershipForm from './routes/CompanyPartnershipForm.js';
import universityPartnershipRoutes from "./routes/universityPartnership.js";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/media-presence', mediaPresenceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student-ambassador-form", StudentAmbassadorForm);
app.use("/api/company-partnership", CompanyPartnershipForm);
app.use("/api/university-partnership", universityPartnershipRoutes);




// Add logging for all requests
app.use((req, res, next) => {
  console.log(`=== REQUEST: ${req.method} ${req.path} ===`);
  next();
});

// Error handling middleware (moved to the end)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});