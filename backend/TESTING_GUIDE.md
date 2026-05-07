# 🧪 API Testing Guide - Stackenzo Frontend to Backend Mapping

## 📋 Quick Test Commands

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Server should start at: `http://localhost:3000`

### 2. Test Health Check
```bash
curl https://stackenzo-backend.onrender.com/health
```
Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🗺️ API to Frontend Page Mapping

### 1. Contact Form API
**Endpoint:** `POST /api/contact`

**Used In Pages:**
- ✅ **Contact.jsx** (Main contact page - `/Contact`)
- ✅ **Home.jsx** (Footer contact form - `/`)

**Test Command:**
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+91 9876543210\",\"subject\":\"Test Inquiry\",\"message\":\"Testing contact form\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": { "id": 1 }
}
```

**How to Test in UI:**
1. Go to `http://localhost:5173/Contact`
2. Fill the contact form
3. Click "Send Message"
4. Check browser console for response
5. Check backend terminal for logs

---

### 2. Enrollment/Workshop API
**Endpoint:** `POST /api/enrollments`

**Used In Pages:**
- ✅ **Robotics.jsx** (Enroll Now button - `/Robotics`)
- ✅ **Workshops.jsx** (Register Now button - `/WorkShops`)
- ✅ **EnrollmentModal.jsx** (Modal component used across pages)

**Test Command:**
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/enrollments \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Smith\",\"email\":\"jane@example.com\",\"phone\":\"9876543210\",\"course\":\"Robotics Education\",\"education\":\"undergraduate\",\"message\":\"Interested in robotics\",\"type\":\"enrollment\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Enrollment submitted successfully",
  "data": { "id": 1 }
}
```

**How to Test in UI:**
1. Go to `http://localhost:5173/Robotics`
2. Click "Enroll Now" button
3. Fill the enrollment modal form
4. Click "Submit"
5. Should see success alert

---

### 3. Job Postings API
**Endpoint:** `GET /api/jobs/postings`

**Used In Pages:**
- ✅ **Career.jsx** (Job listings - `/Career`)

**Test Command:**
```bash
curl https://stackenzo-backend.onrender.com/api/jobs/postings
```

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**Note:** Initially empty. Add jobs via admin endpoint first.

**How to Test in UI:**
1. Go to `http://localhost:5173/Career`
2. Job listings should load (currently shows "No openings")
3. Check browser console for API call

---

### 4. Job Application API
**Endpoint:** `POST /api/jobs/applications`

**Used In Pages:**
- ✅ **Career.jsx** (Apply Now button - `/Career`)

**Test Command:**
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/jobs/applications \
  -H "Content-Type: application/json" \
  -d "{\"job_id\":1,\"name\":\"Alex Johnson\",\"email\":\"alex@example.com\",\"phone\":\"9876543210\",\"resume_url\":\"https://example.com/resume.pdf\",\"cover_letter\":\"I am interested in this position\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": { "id": 1 }
}
```

**How to Test in UI:**
1. First, create a job posting (see admin section)
2. Go to `http://localhost:5173/Career`
3. Click "Apply Now" on a job
4. Fill application form
5. Submit

---

### 5. Newsletter Subscription API
**Endpoint:** `POST /api/newsletter/subscribe`

**Used In Pages:**
- ✅ **Footer.jsx** (Newsletter form - All pages)
- ✅ **Home.jsx** (Newsletter section - `/`)

**Test Command:**
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"subscriber@example.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**How to Test in UI:**
1. Go to any page (footer is on all pages)
2. Find newsletter subscription input
3. Enter email and click "Subscribe"
4. Should see success message

---

## 🔧 Testing Workflow

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

### Step 2: Start Frontend
```bash
cd ..
npm run dev
```

### Step 3: Test Each API

#### Test 1: Contact Form
```bash
# Terminal test
curl -X POST https://stackenzo-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Testing"}'

# UI test
# Go to: http://localhost:5173/Contact
# Fill form and submit
```

#### Test 2: Enrollment
```bash
# Terminal test
curl -X POST https://stackenzo-backend.onrender.com/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9876543210","course":"Robotics","education":"undergraduate","type":"enrollment"}'

# UI test
# Go to: http://localhost:5173/Robotics
# Click "Enroll Now" and submit form
```

#### Test 3: Newsletter
```bash
# Terminal test
curl -X POST https://stackenzo-backend.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# UI test
# Go to any page footer
# Enter email and click Subscribe
```

---

## 🎯 Frontend Integration Status

### ✅ Already Integrated (Working)
These pages already have API calls:
- **Contact.jsx** - Contact form submission
- **EnrollmentModal.jsx** - Enrollment submissions

### ⚠️ Need Integration (Static Data)
These pages need to be connected to backend:

#### 1. Career.jsx
**Current:** Uses hardcoded job data
**Needs:** 
```javascript
// Add this to Career.jsx
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await fetch('https://stackenzo-backend.onrender.com/api/jobs/postings');
      const data = await response.json();
      if (data.success) {
        setJobOpenings(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  fetchJobs();
}, []);
```

#### 2. Footer.jsx (Newsletter)
**Current:** Console log only
**Needs:**
```javascript
// Add this to Footer.jsx newsletter handler
const handleSubscribe = async (email) => {
  try {
    const response = await fetch('https://stackenzo-backend.onrender.com/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      alert('Subscribed successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📊 Database Verification

### Check if data is being saved:

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE stackenzo_db;

# Check contact submissions
SELECT * FROM contact_submissions;

# Check enrollments
SELECT * FROM enrollment_submissions;

# Check newsletter subscribers
SELECT * FROM newsletter_subscribers;

# Check job applications
SELECT * FROM job_applications;
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error
**Error:** "Access to fetch blocked by CORS policy"
**Fix:** Backend is running and CORS is enabled for `http://localhost:5173`

### Issue 2: Connection Refused
**Error:** "Failed to fetch" or "Connection refused"
**Fix:** 
```bash
# Check if backend is running
curl https://stackenzo-backend.onrender.com/health

# If not, start it
cd backend
npm run dev
```

### Issue 3: Database Error
**Error:** "Database connection failed"
**Fix:**
```bash
# Check MySQL is running
# Windows:
net start MySQL80

# Initialize database
cd backend
npm run init-db
```

### Issue 4: Email Not Sending
**Error:** Email notifications not received
**Fix:** 
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Use Gmail App Password (not regular password)
- Emails are sent async, API will still succeed

---

## 📝 Testing Checklist

### Backend Tests
- [ ] Health check returns 200
- [ ] Contact API accepts POST
- [ ] Enrollment API accepts POST
- [ ] Newsletter API accepts POST
- [ ] Job postings API returns data
- [ ] Database saves submissions

### Frontend Tests
- [ ] Contact form submits successfully
- [ ] Enrollment modal opens and submits
- [ ] Newsletter subscription works
- [ ] Job listings display (when available)
- [ ] Success/error messages show
- [ ] Browser console shows no errors

### Integration Tests
- [ ] Frontend can reach backend
- [ ] Data saves to database
- [ ] Email notifications sent
- [ ] Error handling works
- [ ] Validation messages display

---

## 🎨 Browser Console Testing

Open browser console (F12) and run:

```javascript
// Test Contact API
fetch('https://stackenzo-backend.onrender.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    subject: 'Test',
    message: 'Testing from console'
  })
})
.then(r => r.json())
.then(d => console.log('Contact API:', d));

// Test Enrollment API
fetch('https://stackenzo-backend.onrender.com/api/enrollments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    phone: '9876543210',
    course: 'Robotics',
    education: 'undergraduate',
    type: 'enrollment'
  })
})
.then(r => r.json())
.then(d => console.log('Enrollment API:', d));

// Test Newsletter API
fetch('https://stackenzo-backend.onrender.com/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com' })
})
.then(r => r.json())
.then(d => console.log('Newsletter API:', d));

// Test Jobs API
fetch('https://stackenzo-backend.onrender.com/api/jobs/postings')
.then(r => r.json())
.then(d => console.log('Jobs API:', d));
```

---

## 📱 Page-by-Page Testing Guide

### Page 1: Home (/)
**APIs Used:**
- Contact form (footer)
- Newsletter subscription (footer)

**Test:**
1. Scroll to footer
2. Fill contact form → Submit
3. Enter email in newsletter → Subscribe

---

### Page 2: Contact (/Contact)
**APIs Used:**
- Contact form submission

**Test:**
1. Fill all fields
2. Click "Send Message"
3. Check for success message

---

### Page 3: Robotics (/Robotics)
**APIs Used:**
- Enrollment modal

**Test:**
1. Click "Enroll Now"
2. Fill modal form
3. Submit
4. Check for success alert

---

### Page 4: Workshops (/WorkShops)
**APIs Used:**
- Enrollment modal (workshop type)

**Test:**
1. Click "Register Now"
2. Fill form
3. Submit

---

### Page 5: Career (/Career)
**APIs Used:**
- Job listings (GET)
- Job applications (POST)

**Test:**
1. View job listings
2. Click "Apply Now"
3. Fill application
4. Submit

---

## 🎯 Success Indicators

### Backend Working:
✅ Server starts without errors
✅ Health check returns 200
✅ Database connection successful
✅ API endpoints respond

### Frontend Working:
✅ Forms submit without errors
✅ Success messages display
✅ No console errors
✅ Data appears in database

### Integration Working:
✅ Frontend reaches backend
✅ Data saves correctly
✅ Emails sent (check spam)
✅ Validation works

---

## 📞 Quick Reference

| API Endpoint | Method | Page Used | Test URL |
|-------------|--------|-----------|----------|
| `/api/contact` | POST | Contact, Home | `https://stackenzo-backend.onrender.com/api/contact` |
| `/api/enrollments` | POST | Robotics, Workshops | `https://stackenzo-backend.onrender.com/api/enrollments` |
| `/api/jobs/postings` | GET | Career | `https://stackenzo-backend.onrender.com/api/jobs/postings` |
| `/api/jobs/applications` | POST | Career | `https://stackenzo-backend.onrender.com/api/jobs/applications` |
| `/api/newsletter/subscribe` | POST | All pages (footer) | `https://stackenzo-backend.onrender.com/api/newsletter/subscribe` |

---

**Need Help?** Check backend logs in terminal for detailed error messages!
