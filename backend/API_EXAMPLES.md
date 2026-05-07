# API Testing Examples

## Using cURL

### 1. Contact Form Submission
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "subject": "Inquiry about Web Development Course",
    "message": "I would like to know more about your full stack web development program."
  }'
```

### 2. Workshop Enrollment
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "course": "Embedded Systems & IoT",
    "education": "undergraduate",
    "message": "Interested in ECE workshop",
    "type": "workshop"
  }'
```

### 3. Internship Application
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "9876543210",
    "course": "Software Development Internship",
    "education": "graduate",
    "message": "Looking for 6-month internship",
    "type": "internship"
  }'
```

### 4. Get All Job Postings
```bash
curl https://stackenzo-backend.onrender.com/api/jobs/postings
```

### 5. Get Jobs by Department
```bash
curl "https://stackenzo-backend.onrender.com/api/jobs/postings?department=Engineering"
```

### 6. Submit Job Application
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/jobs/applications \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "name": "Sarah Williams",
    "email": "sarah@example.com",
    "phone": "9876543210",
    "resume_url": "https://example.com/resume.pdf",
    "cover_letter": "I am excited to apply for this position..."
  }'
```

### 7. Newsletter Subscription
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

### 8. Newsletter Unsubscribe
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

---

## Using JavaScript (Fetch API)

### Contact Form
```javascript
const submitContact = async () => {
  const response = await fetch('https://stackenzo-backend.onrender.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      subject: 'Course Inquiry',
      message: 'I want to learn more about your programs'
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Enrollment
```javascript
const submitEnrollment = async () => {
  const response = await fetch('https://stackenzo-backend.onrender.com/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      course: 'Full Stack Web Development',
      education: 'undergraduate',
      message: 'Excited to join',
      type: 'workshop'
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Get Jobs
```javascript
const getJobs = async () => {
  const response = await fetch('https://stackenzo-backend.onrender.com/api/jobs/postings');
  const data = await response.json();
  console.log(data);
};
```

### Newsletter Subscribe
```javascript
const subscribe = async (email) => {
  const response = await fetch('https://stackenzo-backend.onrender.com/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 1
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Job Listings Response
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Full Stack Developer",
      "department": "Engineering",
      "location": "Bangalore, India",
      "type": "Full-time",
      "experience": "2-4 years",
      "salary": "₹8-15 LPA",
      "description": "Build scalable web applications...",
      "requirements": ["React/Angular", "Node.js", "MongoDB"],
      "responsibilities": ["Develop features", "Code reviews"],
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## Admin Endpoints (Require Authentication)

### Get All Contacts
```bash
curl https://stackenzo-backend.onrender.com/api/contact
```

### Get All Enrollments
```bash
curl "https://stackenzo-backend.onrender.com/api/enrollments?type=workshop&status=pending"
```

### Get Enrollment Statistics
```bash
curl https://stackenzo-backend.onrender.com/api/enrollments/stats
```

### Update Contact Status
```bash
curl -X PATCH https://stackenzo-backend.onrender.com/api/contact/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

### Get All Job Applications
```bash
curl https://stackenzo-backend.onrender.com/api/jobs/applications
```

### Get Newsletter Subscribers
```bash
curl https://stackenzo-backend.onrender.com/api/newsletter/subscribers
```

---

## Testing Tips

1. **Use Postman** for easier testing with collections
2. **Check server logs** for detailed error messages
3. **Verify email** configuration if notifications fail
4. **Test validation** by sending invalid data
5. **Monitor database** to see data being stored

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Stackenzo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Contact",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@test.com\",\n  \"subject\": \"Test\",\n  \"message\": \"Testing API\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "https://stackenzo-backend.onrender.com/api/contact",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "contact"]
        }
      }
    }
  ]
}
```
