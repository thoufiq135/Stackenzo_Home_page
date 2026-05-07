# Resume Submission Feature - Testing Guide

## Overview
The resume submission system allows users to upload their resume (PDF only) along with personal details. Resumes are stored as BLOB data in the MySQL database.

## Database Table: `resume_submissions`

### Schema
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 255, NOT NULL)
- email (VARCHAR 255, NOT NULL)
- phone (VARCHAR 20, NOT NULL)
- position (VARCHAR 255) - Position interested in
- experience (VARCHAR 100) - Total experience
- resume_filename (VARCHAR 255, NOT NULL)
- resume_data (LONGBLOB, NOT NULL) - PDF file stored as binary
- resume_mimetype (VARCHAR 100, NOT NULL)
- message (TEXT) - Additional message
- status (ENUM: 'pending', 'reviewed', 'shortlisted', 'rejected')
- created_at (TIMESTAMP)
```

## API Endpoints

### 1. Submit Resume (Public)
**POST** `/api/resumes/submit`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `name` (required) - Full name
- `email` (required) - Email address
- `phone` (required) - Phone number
- `position` (optional) - Position interested in
- `experience` (optional) - Total experience
- `message` (optional) - Additional message
- `resume` (required) - PDF file (max 5MB)

**Example using cURL:**
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/resumes/submit \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=9876543210" \
  -F "position=Full Stack Developer" \
  -F "experience=3-5 years" \
  -F "message=I am excited to join your team" \
  -F "resume=@/path/to/resume.pdf"
```

**Success Response:**
```json
{
  "success": true,
  "message": "Resume submitted successfully",
  "data": {
    "id": 1
  }
}
```

### 2. Get All Resumes (Admin)
**GET** `/api/resumes?status=pending`

**Query Parameters:**
- `status` (optional) - Filter by status

**Example:**
```bash
curl https://stackenzo-backend.onrender.com/api/resumes
curl https://stackenzo-backend.onrender.com/api/resumes?status=pending
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "position": "Full Stack Developer",
      "experience": "3-5 years",
      "resume_filename": "john_resume.pdf",
      "resume_mimetype": "application/pdf",
      "message": "Excited to join",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Download Resume (Admin)
**GET** `/api/resumes/:id/download`

**Example:**
```bash
curl https://stackenzo-backend.onrender.com/api/resumes/1/download -o resume.pdf
```

This will download the PDF file.

### 4. Update Resume Status (Admin)
**PATCH** `/api/resumes/:id/status`

**Body:**
```json
{
  "status": "reviewed"
}
```

**Example:**
```bash
curl -X PATCH https://stackenzo-backend.onrender.com/api/resumes/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```

## Frontend Integration

### Career Page
The "Send Your Resume" button on the Career page opens the ResumeModal component.

**Location:** `src/Career.jsx`

### Resume Modal Component
**Location:** `src/ResumeModal.jsx`

**Features:**
- Form validation
- PDF file upload (max 5MB)
- File type validation (PDF only)
- Success/error notifications
- Responsive design

**Usage:**
```jsx
import ResumeModal from "./ResumeModal";

const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

<button onClick={() => setIsResumeModalOpen(true)}>
  Send Your Resume
</button>

<ResumeModal 
  isOpen={isResumeModalOpen} 
  onClose={() => setIsResumeModalOpen(false)} 
/>
```

## Testing Steps

### 1. Frontend Testing
1. Navigate to Career page: `http://localhost:5173/Career`
2. Click "Send Your Resume" button
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Position: Full Stack Developer
   - Experience: 3-5 years
   - Message: Test submission
4. Upload a PDF resume (max 5MB)
5. Click "Submit Resume"
6. Verify success message appears
7. Modal should close automatically after 2 seconds

### 2. Backend Testing
```bash
# Check if resume was stored
curl https://stackenzo-backend.onrender.com/api/resumes

# Download the resume
curl https://stackenzo-backend.onrender.com/api/resumes/1/download -o test_resume.pdf

# Update status
curl -X PATCH https://stackenzo-backend.onrender.com/api/resumes/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```

### 3. Database Verification
```sql
-- View all resume submissions
SELECT id, name, email, phone, position, experience, 
       resume_filename, LENGTH(resume_data) as file_size_bytes,
       status, created_at 
FROM resume_submissions;

-- Check specific resume
SELECT * FROM resume_submissions WHERE id = 1;

-- Count by status
SELECT status, COUNT(*) as count 
FROM resume_submissions 
GROUP BY status;
```

## File Upload Specifications

- **Allowed Format:** PDF only
- **Max File Size:** 5MB
- **Storage:** LONGBLOB in MySQL (stores up to 4GB)
- **Validation:** Server-side and client-side
- **Security:** File type verification using mimetype

## Email Notifications

When a resume is submitted, the user receives a confirmation email with:
- Thank you message
- Application details
- Position applied for
- Resume filename

## Error Handling

### Common Errors:
1. **File too large:** "File size must be less than 5MB"
2. **Wrong file type:** "Only PDF files are allowed"
3. **Missing resume:** "Resume file is required"
4. **Validation errors:** Field-specific error messages

## Admin Features (Future Enhancement)

Potential admin panel features:
- View all resume submissions
- Filter by status, date, position
- Download resumes
- Update application status
- Send email responses
- Search by name/email
- Export to CSV

## Security Considerations

1. File type validation (PDF only)
2. File size limit (5MB)
3. Email validation
4. SQL injection prevention (parameterized queries)
5. CORS configuration
6. Input sanitization

## Performance Notes

- LONGBLOB can store files up to 4GB
- Consider moving to cloud storage (S3) for production
- Index on email and status for faster queries
- Pagination recommended for admin view

## Troubleshooting

### Issue: "Only PDF files are allowed"
**Solution:** Ensure the file has .pdf extension and correct mimetype

### Issue: "File size must be less than 5MB"
**Solution:** Compress the PDF or reduce file size

### Issue: "Failed to submit resume"
**Solution:** 
- Check backend server is running
- Verify database connection
- Check browser console for errors
- Verify API endpoint URL

### Issue: Resume not downloading
**Solution:**
- Verify resume ID exists
- Check database for resume_data
- Ensure proper Content-Type headers

## Next Steps

1. Test the feature thoroughly
2. Create admin panel for viewing submissions
3. Add email templates
4. Implement status tracking
5. Add analytics dashboard
