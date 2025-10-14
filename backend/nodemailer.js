import nodemailer from "nodemailer";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  from: `"RASS Academy" <${process.env.NODEMAILER_USER_EMAIL}>`,
  to: [process.env.NODEMAILER_USER_EMAIL, "sangarajuvamsi6@gmail.com"],
  subject: `🚀 New Course Inquiry - ${name}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Course Inquiry - RASS Academy</title>
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
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
        }
        
        .header {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
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
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(239, 225, 225, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #1f1717ff 0%, #1b50e0ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 400;
            color: #E0E7FF;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .info-grid {
            display: grid;
            gap: 16px;
            margin-bottom: 40px;
        }
        
        .info-card {
            background: linear-gradient(135deg, #181d22ff 0%, #0e0f10ff 100%);
            border-radius: 20px;
            padding: 32px;
            border: 1px solid #E2E8F0;
            position: relative;
            overflow: hidden;
        }
        
        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
        }
        
        .info-item {
            display: flex;
            align-items: center;
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: 1px solid #F1F5F9;
        }
        
        .info-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .info-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            flex-shrink: 0;
        }
        
        .name-icon { 
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }
        
        .email-icon { 
            background: linear-gradient(135deg, #EC4899, #F59E0B);
            box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
        }
        
        .phone-icon { 
            background: linear-gradient(135deg, #10B981, #3B82F6);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        
        .info-icon svg {
            width: 28px;
            height: 28px;
            fill: white;
        }
        
        .info-text {
            flex: 1;
        }
        
        .info-label {
            font-size: 13px;
            font-weight: 700;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .info-value {
            font-size: 18px;
            font-weight: 700;
            color: #1E293B;
            letter-spacing: -0.2px;
        }
        
        .priority-section {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            border-radius: 20px;
            padding: 40px;
            color: white;
            text-align: center;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }
        
        .priority-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="%23ffffff" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
            background-size: cover;
        }
        
        .priority-content {
            position: relative;
            z-index: 2;
        }
        
        .priority-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.2);
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .priority-title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        
        .priority-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 24px;
        }
        
        .action-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .action-btn {
            padding: 16px 28px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-width: 140px;
            justify-content: center;
        }
        
        .call-btn {
            background: white;
            color: #4F46E5;
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }
        
        .email-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(10px);
        }
        
        .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }
        
        .stats-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 32px;
        }
        
        .stat-item {
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
            padding: 24px;
            border-radius: 16px;
            text-align: center;
            border: 1px solid #E2E8F0;
        }
        
        .stat-number {
            font-size: 28px;
            font-weight: 800;
            color: #4F46E5;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 12px;
            font-weight: 700;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .footer {
            text-align: center;
            padding: 40px;
            background: #0F172A;
            color: #94A3B8;
            font-size: 14px;
        }
        
        .brand {
            color: white;
            font-weight: 800;
            font-size: 20px;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
        }
        
        .brand span {
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .timestamp {
            background: rgba(255, 255, 255, 0.1);
            padding: 16px 24px;
            border-radius: 12px;
            display: inline-block;
            margin-top: 16px;
            font-weight: 600;
            color: #000000ff;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5798f4ff;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background: #4F46E5;
            color: white;
            transform: translateY(-2px);
        }
        
        @media (max-width: 600px) {
            .header {
                padding: 40px 24px;
            }
            
            .content {
                padding: 40px 24px;
            }
            
            .info-card {
                padding: 24px;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .stats-section {
                grid-template-columns: 1fr;
            }
            
            .info-item {
                padding: 16px;
            }
            
            .priority-section {
                padding: 32px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <div class="logo">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h1>New Course Inquiry 🚀</h1>
                <p class="subtitle">Potential student interested in RASS Academy</p>
            </div>
        </div>
        
        <div class="content">
            
            <!-- Student Information -->
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
            
            <!-- Priority Action Section -->
            <div class="priority-section">
                <div class="priority-content">
                    <div class="priority-badge">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        HIGH PRIORITY
                    </div>
                    <h2 class="priority-title">Ready to Connect! 🎯</h2>
                    <p class="priority-subtitle">This student is actively interested and waiting for your response</p>
                    
                    <div class="action-buttons">
                        <a href="tel:${mobileNumber}" class="action-btn call-btn">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            Call Student
                        </a>
                        <a href="mailto:${email}" class="action-btn email-btn">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Send Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="brand"><span>RASS</span> Academy</div>
            <p>🎓 Transforming careers through quality education</p>
            <div class="timestamp">
                📅 Received: ${new Date().toLocaleString('en-IN', { 
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});