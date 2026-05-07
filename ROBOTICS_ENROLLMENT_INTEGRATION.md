# Robotics Page Enrollment Integration

## Changes Made

### 1. Updated EnrollmentModal Component
**File:** `src/EnrollmentModal.jsx`

- Added API integration to store enrollments in the database
- Implemented async form submission with proper error handling
- Added loading state during submission
- Sends POST request to `/api/enrollments` endpoint
- Includes `type` parameter to identify enrollment source

### 2. Updated Robotics Page
**File:** `src/robotics.jsx`

- Changed enrollment type from `"enrollment"` to `"robotics"` for better tracking
- This allows filtering robotics-specific enrollments in the database

## How It Works

1. **User fills the enrollment form** on the robotics page
2. **Form data is submitted** to `https://stackenzo-backend.onrender.com/api/enrollments`
3. **Backend stores the data** in the database with type="robotics"
4. **Confirmation emails** are sent to both user and admin
5. **Success/error feedback** is shown to the user

## Database Storage

All robotics enrollments are now stored in the `enrollments` table with:
- `name`: Student's full name
- `email`: Student's email address
- `phone`: Student's phone number
- `course`: Selected robotics course/program
- `education`: Educational background
- `message`: Additional information
- `type`: "robotics" (identifies source page)
- `status`: "pending" (default)
- `created_at`: Timestamp

## Testing

### Test the enrollment form:
```bash
# Start the backend server
cd backend
npm start

# Start the frontend
cd ..
npm run dev
```

### Manual API test:
```bash
curl -X POST https://stackenzo-backend.onrender.com/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "phone": "9876543210",
    "course": "Robotics Education Program",
    "education": "undergraduate",
    "message": "Interested in robotics",
    "type": "robotics"
  }'
```

## Admin Access

View all robotics enrollments:
```bash
# Get all robotics enrollments
curl "https://stackenzo-backend.onrender.com/api/enrollments?type=robotics"

# Get enrollment statistics
curl https://stackenzo-backend.onrender.com/api/enrollments/stats
```

## Features

✅ Form validation (required fields)
✅ Database storage
✅ Email notifications (user + admin)
✅ Loading states
✅ Error handling
✅ Success feedback
✅ Type-based filtering
✅ Status tracking

## Notes

- Make sure the backend server is running on port 3000
- Email notifications require proper SMTP configuration in `.env`
- Admin endpoints should be protected with authentication in production
