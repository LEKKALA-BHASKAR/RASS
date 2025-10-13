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
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
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
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

dotenv.config();
app.use(express.json());
app.use(cors());

/* ------------------ Transporter Setup ------------------ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD,
  },
});

/* ------------------ API Endpoint ------------------ */
app.post("/api/send-mail", async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;

    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

const mailOptions = {
  from: `"Course Inquiry" <${process.env.NODEMAILER_USER_EMAIL}>`,
  to: [process.env.NODEMAILER_USER_EMAIL, "sangarajuvamsi6@gmail.com"],
  subject: `🎓 New Course Inquiry from ${name}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Course Inquiry</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="%23ffffff" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
            background-size: cover;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease;
        }
        
        .info-item:hover {
            transform: translateY(-2px);
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .info-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            flex-shrink: 0;
        }
        
        .name-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
        .email-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
        .phone-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
        
        .info-icon svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        
        .info-text {
            flex: 1;
        }
        
        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .cta-section {
            text-align: center;
            padding: 25px;
            background: linear-gradient(135deg, #10b981, #34d399);
            border-radius: 16px;
            color: white;
            margin-bottom: 30px;
        }
        
        .cta-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .cta-subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .action-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .action-btn {
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .call-btn {
            background: white;
            color: #10b981;
        }
        
        .email-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        
        .timestamp {
            background: white;
            padding: 12px 20px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 10px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 600px) {
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .info-card {
                padding: 20px;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .action-btn {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <div class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                </div>
                <h1>New Course Inquiry 🎓</h1>
                <p class="subtitle">Someone is interested in your course!</p>
            </div>
        </div>
        
        <div class="content">
            <div class="info-card">
                <div class="info-item">
                    <div class="info-icon name-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="info-text">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${name}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon email-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    </div>
                    <div class="info-text">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">${email}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon phone-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                    </div>
                    <div class="info-text">
                        <div class="info-label">Mobile Number</div>
                        <div class="info-value">${mobileNumber}</div>
                    </div>
                </div>
            </div>
            
            <div class="cta-section">
                <div class="cta-title">🚀 Ready to Connect!</div>
                <div class="cta-subtitle">This potential student is waiting for your response</div>
                
                <div class="action-buttons">
                    <a href="tel:${mobileNumber}" class="action-btn call-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                        Call Now
                    </a>
                    <a href="mailto:${email}" class="action-btn email-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        Send Email
                    </a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>📧 This inquiry was sent automatically from your website contact form</p>
            <div class="timestamp">
                ⏰ Received: ${new Date().toLocaleString('en-IN', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Kolkata'
                })}
            </div>
        </div>
    </div>
</body>
</html>
  `,
};


    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
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