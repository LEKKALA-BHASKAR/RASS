import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

/* --------------------------- Middleware --------------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------- Nodemailer Transporter --------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD,
  },

});


/* ---------------------------- Routes ------------------------------- */
app.post("/send-mail", async (req, res) => {
  console.log("📨 Received email send request:", req.body);
  try {
    const { name, email, mobileNumber } = req.body;

    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const htmlContent = generateEmailTemplate(name, email, mobileNumber);

    // ✅ Send via Nodemailer
    await transporter.sendMail({
      from: `"RASS Academy" <${process.env.NODEMAILER_USER_EMAIL}>`,
      to: [
        process.env.NODEMAILER_USER_EMAIL,
      ],
      subject: `🚀 New Course Inquiry - ${name}`,
      html: htmlContent,
    });

    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

/* ---------------------- Enhanced Email HTML Template for RASS Academy ------------------------ */
function generateEmailTemplate(name, email, mobileNumber, course = "Not specified", message = "") {
  const timestamp = new Date().toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Course Inquiry - RASS Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        color: #334155;
        line-height: 1.6;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      
      .email-wrapper {
        width: 100%;
        max-width: 800px;
        background: #fff;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
      }
      
      .header {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        color: white;
        padding: 50px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: "";
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        transform: rotate(45deg);
      }
      
      .header-content {
        position: relative;
        z-index: 1;
      }
      
      .header h1 {
        font-size: 36px;
        margin-bottom: 15px;
        font-weight: 700;
      }
      
      .header p {
        font-size: 18px;
        opacity: 0.9;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .logo {
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
        color: #4F46E5;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
      
      .content {
        padding: 50px 40px;
        display: flex;
        flex-direction: column;
        gap: 30px;
      }
      
      .section-title {
        font-size: 22px;
        font-weight: 600;
        color: #4F46E5;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .section-title i {
        font-size: 20px;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .info-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 25px;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .info-box:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      }
      
      .info-box-label {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #4F46E5;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .info-box-content {
        font-size: 18px;
        font-weight: 500;
        color: #334155;
      }
      
      .message-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 25px;
        margin-top: 10px;
      }
      
      .message-content {
        font-size: 16px;
        line-height: 1.7;
        color: #475569;
        white-space: pre-wrap;
      }
      
      .action-section {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        color: white;
        margin-top: 20px;
      }
      
      .action-section h2 {
        font-size: 28px;
        margin-bottom: 15px;
      }
      
      .action-section p {
        font-size: 18px;
        margin-bottom: 30px;
        opacity: 0.9;
      }
      
      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }
      
      .action-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: white;
        color: #4F46E5;
        text-decoration: none;
        font-weight: 600;
        padding: 15px 30px;
        border-radius: 50px;
        transition: all 0.3s ease;
        font-size: 16px;
      }
      
      .action-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
      
      .footer {
        background: #0F172A;
        color: #94A3B8;
        padding: 40px 30px;
        text-align: center;
      }
      
      .footer-brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin-bottom: 15px;
      }
      
      .footer-brand i {
        color: #7C3AED;
      }
      
      .footer-text {
        font-size: 16px;
        margin-bottom: 20px;
      }
      
      .footer-links {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 25px;
      }
      
      .footer-link {
        color: #94A3B8;
        text-decoration: none;
        transition: color 0.3s ease;
      }
      
      .footer-link:hover {
        color: #7C3AED;
      }
      
      .timestamp {
        background: rgba(255,255,255,0.1);
        padding: 12px 20px;
        border-radius: 50px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
      }
      
      .stats-section {
        display: flex;
        justify-content: space-around;
        background: #f8fafc;
        border-radius: 16px;
        padding: 30px;
        margin-top: 20px;
      }
      
      .stat-item {
        text-align: center;
      }
      
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #4F46E5;
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .course-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(79, 70, 229, 0.1);
        color: #4F46E5;
        padding: 8px 16px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        margin-top: 10px;
      }
      
      @media (max-width: 768px) {
        .header h1 {
          font-size: 28px;
        }
        
        .content {
          padding: 30px 20px;
        }
        
        .action-buttons {
          flex-direction: column;
          align-items: center;
        }
        
        .action-button {
          width: 100%;
          max-width: 300px;
        }
        
        .stats-section {
          flex-direction: column;
          gap: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <div class="header-content">
          <div class="logo">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h1>New Course Inquiry 🚀</h1>
          <p>A potential student is interested in joining RASS Academy</p>
        </div>
      </div>

      <div class="content">
        <div>
          <div class="section-title">
            <i class="fas fa-user-circle"></i>
            Student Information
          </div>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-box-label">
                <i class="fas fa-user"></i>
                Full Name
              </div>
              <div class="info-box-content">${name}</div>
            </div>
            <div class="info-box">
              <div class="info-box-label">
                <i class="fas fa-envelope"></i>
                Email Address
              </div>
              <div class="info-box-content">${email}</div>
            </div>
            <div class="info-box">
              <div class="info-box-label">
                <i class="fas fa-phone"></i>
                Mobile Number
              </div>
              <div class="info-box-content">${mobileNumber}</div>
            </div>
            <div class="info-box">
              <div class="info-box-label">
                <i class="fas fa-book"></i>
                Course Interest
              </div>
            </div>
          </div>
        </div>
        
        ${message ? `
        <div>
          <div class="section-title">
            <i class="fas fa-comment-dots"></i>
            Message from Student
          </div>
          <div class="message-box">
            <div class="message-content">${message}</div>
          </div>
        </div>
        ` : ''}
        


        <div class="action-section">
          <h2>Ready to Connect! 🎯</h2>
          <p>This student is actively waiting for your response. Take action now!</p>
          <div class="action-buttons">
            <a href="tel:${mobileNumber}" class="action-button">
              <i class="fas fa-phone"></i>
              Call Now
            </a>
            <a href="mailto:${email}" class="action-button">
              <i class="fas fa-envelope"></i>
              Send Email
            </a>
            <a href="#" class="action-button">
              <i class="fas fa-calendar-plus"></i>
              Schedule Meeting
            </a>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-brand">
          <i class="fas fa-graduation-cap"></i>
          RASS Academy
        </div>
        <p class="footer-text">Transforming careers through quality education 🎓</p>
        <div class="timestamp">
          <i class="fas fa-clock"></i>
          Received: ${timestamp}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

/* --------------------------- Start Server -------------------------- */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
