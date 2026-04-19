const EnrollmentModel = require('../models/enrollmentModel');
const WorkshopRegistrationModel = require('../models/workshopRegistrationModel');
const { sendEmail } = require('../utils/emailService');
const SummerCampRegistration = require('../models/summerCampRegistrationModel');

class EnrollmentController {
  // Submit enrollment
  static async submitEnrollment(req, res, next) {
    try {
      const { name, email, phone, course, department, education, message, type } = req.body;

      const enrollmentId = await EnrollmentModel.create({
        name,
        email,
        phone,
        course,
        department,
        education,
        message,
        type
      });

      // Send confirmation email
      await sendEmail({
        to: email,
        subject: `Enrollment Confirmation - ${course}`,
        html: `
          <h2>Hello ${name},</h2>
          <p>Thank you for your interest in <strong>${course}</strong>!</p>
          <p>We have received your enrollment request and our team will contact you within 24 hours.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li>Course: ${course}</li>
            <li>Education: ${education}</li>
            <li>Phone: ${phone}</li>
          </ul>
          <br>
          <p>Best regards,<br>Stackenzo Team</p>
        `
      });

      // Notify admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@stackenzo.com',
        subject: `New Enrollment - ${course}`,
        html: `
          <h2>New Enrollment Submission</h2>
          <p><strong>Type:</strong> ${type || 'enrollment'}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Education:</strong> ${education}</p>
          <p><strong>Message:</strong> ${message || 'None'}</p>
        `
      });

      res.status(201).json({
        success: true,
        message: 'Enrollment submitted successfully',
        data: { id: enrollmentId }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all enrollments (admin)
  static async getAllEnrollments(req, res, next) {
    try {
      const { type, status, limit } = req.query;
      const enrollments = await EnrollmentModel.getAll({ type, status, limit });

      res.json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  // Get enrollment by ID (admin)
  static async getEnrollmentById(req, res, next) {
    try {
      const { id } = req.params;
      const enrollment = await EnrollmentModel.getById(id);

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.json({
        success: true,
        data: enrollment
      });
    } catch (error) {
      next(error);
    }
  }

  // Update enrollment status (admin)
  static async updateEnrollmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await EnrollmentModel.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.json({
        success: true,
        message: 'Enrollment status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get enrollment statistics (admin)
  static async getStats(req, res, next) {
    try {
      const stats = await EnrollmentModel.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Workshop Registration ──────────────────────────────────────────────────

  static async workshopRegister(req, res, next) {
    try {
      console.log('📋 Workshop registration attempt:', { 
        name: req.body.name, 
        email: req.body.email, 
        phone: req.body.phone,
        college: req.body.college 
      });

      // Convert experience to 'yes'/'no' if needed
      const normalizedExperience = experience === true || experience === 'yes' ? 'yes' : 'no';

      // Duplicate check (by email OR phone)
      const existing = await WorkshopRegistrationModel.findDuplicate(email, phone);
      if (existing) {
        return res.status(409).json({
          success: false,
          duplicate: true,
          regId: existing.reg_id,
          name: existing.name,
          message: 'You are already registered for this workshop.'
        });
      }

      // Create registration
      const { regId } = await WorkshopRegistrationModel.create({
        name, email, phone, college, stream, year,
        batch, normalizedExperience, whatsappOptin,
        message, workshopId, source
      });

      // Confirmation email to registrant (non-blocking)
      sendEmail({
        to: email,
        subject: `✅ Workshop Registration Confirmed – ${regId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,#F04A06,#C5531A);padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">🎉 You're Registered!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Stackenzo Robotics Workshop</p>
            </div>
            <div style="background:#f9f9f9;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
              <p style="font-size:16px;color:#444;">Hello <strong>${name}</strong>,</p>
              <p style="color:#666;">Your spot is confirmed for the <strong>Robotics Workshop</strong>!</p>
              <div style="background:#FFF4ED;border:1px solid rgba(212,175,55,0.4);border-radius:10px;padding:20px;margin:20px 0;text-align:center;">
                <p style="font-size:12px;color:#888;margin:0 0 6px;letter-spacing:0.1em;text-transform:uppercase;">Your Registration ID</p>
                <p style="font-size:26px;font-weight:900;color:#F04A06;margin:0;letter-spacing:0.05em;">${regId}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#555;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">Batch</td><td style="padding:8px;border-bottom:1px solid #eee;">${batch}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">College</td><td style="padding:8px;border-bottom:1px solid #eee;">${college || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:600;color:#333;">Department</td><td style="padding:8px;">${stream || 'N/A'}</td></tr>
              </table>
              <p style="color:#666;margin-top:20px;">Please keep your Registration ID safe. Bring it to the workshop for check-in.</p>
              <p style="color:#999;font-size:13px;margin-top:24px;text-align:center;">© ${new Date().getFullYear()} Stackenzo. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error('Workshop confirmation email error:', err));

      // Admin notification (non-blocking)
      sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@stackenzo.com',
        subject: `📋 New Workshop Registration – ${name} (${regId})`,
        html: `
          <h2 style="color:#F04A06;">New Workshop Registration</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Reg ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${regId}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${name}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Email</td><td style="padding:8px 12px;border:1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Phone</td><td style="padding:8px 12px;border:1px solid #ddd;">${phone}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">College</td><td style="padding:8px 12px;border:1px solid #ddd;">${college || 'N/A'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Stream</td><td style="padding:8px 12px;border:1px solid #ddd;">${stream || 'N/A'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Year</td><td style="padding:8px 12px;border:1px solid #ddd;">${year || 'N/A'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Batch</td><td style="padding:8px 12px;border:1px solid #ddd;">${batch}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Experience</td><td style="padding:8px 12px;border:1px solid #ddd;">${normalizedExperience}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">WhatsApp Opt-in</td><td style="padding:8px 12px;border:1px solid #ddd;">${whatsappOptin ? 'Yes' : 'No'}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Source</td><td style="padding:8px 12px;border:1px solid #ddd;">${source || 'website'}</td></tr>
          </table>
        `
      }).catch(err => console.error('Workshop admin email error:', err));

      res.status(201).json({
        success: true,
        message: 'Registered successfully!',
        regId
      });
    } catch (error) {
      console.error('💥 Workshop registration ERROR:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
        user: req.body.email || 'unknown'
      });
      next(error);
    }
  }

  // ── Workshop Stats ────────────────────────────────────────────────────────

  static async getWorkshopStats(req, res, next) {
    try {
      const { workshopId } = req.query;
      const stats = await WorkshopRegistrationModel.getStats(workshopId);
      const total = 100;
      res.json({
        success: true,
        data: {
          registered: stats.count,
          total,
          remaining: Math.max(0, total - stats.count)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Summer Camp Registration ──────────────────────────────────────────────

  static async summerCampRegister(req, res, next) {
    try {
      const {
        StudentName, email, CollegeName, Class, ParentName,
        ParentNumber, StudentNumber, Location, WhatsappNumber, source
      } = req.body;

      // Duplicate check (by email OR ParentNumber OR WhatsappNumber)
      const existing = await SummerCampRegistration.findDuplicate(email, ParentNumber, WhatsappNumber);
      if (existing) {
        return res.status(409).json({
          success: false,
          duplicate: true,
          regId: existing.reg_id,
          StudentName: existing.StudentName,
          message: 'Already registered for Summer Camp.'
        });
      }

      // Create registration
      const { regId } = await SummerCampRegistration.create({
        StudentName, email, CollegeName, Class, ParentName,
        ParentNumber, StudentNumber: StudentNumber || null, Location, WhatsappNumber,
        source: source || 'website'
      });

      // Confirmation email to parent/student
      sendEmail({
        to: email,
        subject: `✅ Summer Camp Registration Confirmed – ${regId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,#F04A06,#C5531A);padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">🎉 Summer Camp Registration Confirmed!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Stackenzo Robotics Summer Camp</p>
            </div>
            <div style="background:#f9f9f9;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
              <p style="font-size:16px;color:#444;">Hello <strong>${ParentName}</strong>,</p>
              <p style="color:#666;">Your child <strong>${StudentName}</strong> is registered for Stackenzo Summer Camp!</p>
              <div style="background:#FFF4ED;border:1px solid rgba(212,175,55,0.4);border-radius:10px;padding:20px;margin:20px 0;text-align:center;">
                <p style="font-size:12px;color:#888;margin:0 0 6px;letter-spacing:0.1em;text-transform:uppercase;">Registration ID</p>
                <p style="font-size:26px;font-weight:900;color:#F04A06;margin:0;letter-spacing:0.05em;">${regId}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#555;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">Student</td><td style="padding:8px;border-bottom:1px solid #eee;">${StudentName}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">Class</td><td style="padding:8px;border-bottom:1px solid #eee;">${Class}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">College</td><td style="padding:8px;border-bottom:1px solid #eee;">${CollegeName}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#333;">Location</td><td style="padding:8px;border-bottom:1px solid #eee;">${Location}</td></tr>
                <tr><td style="padding:8px;font-weight:600;color:#333;">Parent</td><td style="padding:8px;">${ParentName}</td></tr>
                <tr><td style="padding:8px;font-weight:600;color:#333;">Phone</td><td style="padding:8px;">${ParentNumber}</td></tr>
              </table>
              <p style="color:#666;margin-top:20px;">Please save your Registration ID. Bring it on the camp day!</p>
              <p style="color:#999;font-size:13px;margin-top:24px;text-align:center;">© ${new Date().getFullYear()} Stackenzo. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error('Summer camp confirmation email error:', err));

      // Admin notification
      sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@stackenzo.com',
        subject: `📋 New Summer Camp Registration – ${StudentName} (${regId})`,
        html: `
          <h2 style="color:#F04A06;">New Summer Camp Registration</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Reg ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${regId}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Student</td><td style="padding:8px 12px;border:1px solid #ddd;">${StudentName}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Class</td><td style="padding:8px 12px;border:1px solid #ddd;">${Class}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">College</td><td style="padding:8px 12px;border:1px solid #ddd;">${CollegeName}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Parent</td><td style="padding:8px 12px;border:1px solid #ddd;">${ParentName}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Parent Phone</td><td style="padding:8px 12px;border:1px solid #ddd;">${ParentNumber}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">WhatsApp</td><td style="padding:8px 12px;border:1px solid #ddd;">${WhatsappNumber}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Location</td><td style="padding:8px 12px;border:1px solid #ddd;">${Location}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Email</td><td style="padding:8px 12px;border:1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">Source</td><td style="padding:8px 12px;border:1px solid #ddd;">${source || 'website'}</td></tr>
          </table>
        `
      }).catch(err => console.error('Summer camp admin email error:', err));

      res.status(201).json({
        success: true,
        message: 'Summer Camp registration successful!',
        regId
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EnrollmentController;
