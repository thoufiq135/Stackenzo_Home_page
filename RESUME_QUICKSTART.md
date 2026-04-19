# Resume Submission - Quick Start Guide

## ✅ Implementation Complete!

The resume submission feature is fully implemented and ready to use.

## 🚀 Quick Start

### 1. Backend is Already Running
Your backend server is already running on port 3000 with the resume API endpoints active.

### 2. Test the Feature

#### Option A: Using the UI (Recommended)
1. Open your browser and go to: `http://localhost:5173/Career`
2. Click the **"Send Your Resume"** button
3. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: 9876543210
   - Position: Full Stack Developer (optional)
   - Experience: Select from dropdown (optional)
   - Message: Your message (optional)
4. Click **"Click to upload resume"** and select a PDF file (max 5MB)
5. Click **"Submit Resume"**
6. You should see a success message!

#### Option B: View Admin Dashboard
1. Go to: `http://localhost:5173/admin/resumes`
2. You'll see all submitted resumes in a table
3. You can:
   - Filter by status
   - Download resumes
   - Update application status

#### Option C: Test with cURL
```bash
# Create a test PDF first or use an existing one
curl -X POST http://localhost:3000/api/resumes/submit \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "phone=9876543210" \
  -F "position=Full Stack Developer" \
  -F "experience=3-5 years" \
  -F "message=Test submission" \
  -F "resume=@C:/path/to/your/resume.pdf"
```

## 📋 What Was Built

### Backend (4 new files)
1. **Model** - `backend/src/models/resumeModel.js`
   - Database operations for resume submissions
   
2. **Controller** - `backend/src/controllers/resumeController.js`
   - Business logic for handling resumes
   - Email notifications
   
3. **Routes** - `backend/src/routes/resumeRoutes.js`
   - API endpoints with file upload
   
4. **Database** - New table `resume_submissions`
   - Stores PDFs as BLOB in MySQL

### Frontend (2 new files)
1. **ResumeModal** - `src/ResumeModal.jsx`
   - Beautiful modal for resume submission
   - File upload with validation
   
2. **ResumeAdmin** - `src/ResumeAdmin.jsx`
   - Admin dashboard to manage submissions

### Modified Files
- `backend/src/app.js` - Added resume routes
- `backend/src/server.js` - Added endpoint logging
- `backend/src/config/initDatabase.js` - Added resume table
- `src/Career.jsx` - Integrated ResumeModal
- `src/App.jsx` - Added admin route

## 🎯 Key Features

### User Side
✅ Upload PDF resume (max 5MB)
✅ Provide personal details
✅ Specify position and experience
✅ Add optional message
✅ Receive confirmation email
✅ Real-time validation
✅ Beautiful UI with animations

### Admin Side
✅ View all submissions
✅ Filter by status
✅ Download resumes
✅ Update application status
✅ Track submission dates

## 📊 API Endpoints

```
POST   /api/resumes/submit          - Submit resume (Public)
GET    /api/resumes                 - Get all resumes (Admin)
GET    /api/resumes/:id/download    - Download resume (Admin)
PATCH  /api/resumes/:id/status      - Update status (Admin)
```

## 🔍 Verify Database

```sql
-- Check if table exists
SHOW TABLES LIKE 'resume_submissions';

-- View all submissions
SELECT id, name, email, phone, position, experience, 
       resume_filename, LENGTH(resume_data) as file_size_bytes,
       status, created_at 
FROM resume_submissions;

-- Count submissions
SELECT COUNT(*) as total_submissions FROM resume_submissions;

-- Count by status
SELECT status, COUNT(*) as count 
FROM resume_submissions 
GROUP BY status;
```

## 📧 Email Notification

When a user submits their resume, they automatically receive a confirmation email with:
- Thank you message
- Application details
- Position applied for
- Resume filename
- Next steps

## 🎨 UI Features

- Responsive design (works on mobile)
- Drag-and-drop file upload
- File preview before submission
- Real-time validation
- Success/error notifications
- Smooth animations
- Auto-close on success

## 🔒 Security

✅ PDF files only
✅ 5MB file size limit
✅ Email validation
✅ SQL injection prevention
✅ Input sanitization
✅ Mimetype verification

## 📱 Pages

1. **Career Page** - `http://localhost:5173/Career`
   - "Send Your Resume" button opens modal
   
2. **Admin Dashboard** - `http://localhost:5173/admin/resumes`
   - View and manage all submissions

## 🧪 Test Checklist

- [ ] Open Career page
- [ ] Click "Send Your Resume" button
- [ ] Modal opens successfully
- [ ] Fill in all required fields
- [ ] Upload a PDF file
- [ ] Submit the form
- [ ] See success message
- [ ] Modal closes automatically
- [ ] Check admin dashboard
- [ ] See the submission in table
- [ ] Download the resume
- [ ] Update the status
- [ ] Verify database entry

## 💡 Tips

1. **Create a test PDF**: Use any PDF file under 5MB
2. **Check email**: Make sure email service is configured in `.env`
3. **Admin access**: No authentication required for testing
4. **Database**: All resumes stored in MySQL as BLOB

## 🎉 You're All Set!

The resume submission feature is fully functional. Users can now submit their resumes from the Career page, and you can manage them from the admin dashboard.

## 📚 Documentation

For detailed documentation, see:
- `backend/RESUME_FEATURE.md` - Complete feature documentation
- `RESUME_IMPLEMENTATION.md` - Implementation summary
