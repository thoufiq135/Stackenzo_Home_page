# Programs Backend Setup Guide

## Overview
Complete backend implementation for the Programs page with database storage, API endpoints, and live updates.

## Database Tables

### 1. programs
Stores all program/event information:
- `id` - Primary key
- `title` - Program title
- `type` - workshop, hackathon, challenge, school-program, expo
- `date` - Program date
- `location` - Venue/location
- `description` - Full description
- `duration` - Duration (e.g., "3 days")
- `status` - upcoming, ongoing, registration-open, completed, cancelled
- `registration_link` - Link to registration
- `tags` - JSON array of tags
- `created_at`, `updated_at` - Timestamps

### 2. program_registrations
Stores user registrations:
- `id` - Primary key
- `program_id` - Foreign key to programs table
- `name` - User's full name
- `email` - User's email
- `phone` - User's phone number
- `message` - Optional message
- `status` - pending, confirmed, attended, cancelled
- `created_at`, `updated_at` - Timestamps

## API Endpoints

### Public Endpoints

#### GET /api/programs
Get all programs with optional filters
- Query params: `type`, `status`
- Response: `{ success: true, count: number, programs: [] }`

#### GET /api/programs/:id
Get single program by ID
- Response: `{ success: true, program: {} }`

#### POST /api/programs/register
Register for a program
- Body: `{ programId, name, email, phone, message }`
- Sends confirmation email
- Response: `{ success: true, message: string, registrationId: number }`

### Admin Endpoints

#### POST /api/programs
Create new program
- Body: `{ title, type, date, location, description, duration, status, registrationLink, tags }`

#### PUT /api/programs/:id
Update existing program
- Body: Same as create

#### DELETE /api/programs/:id
Delete a program

#### GET /api/programs/:id/registrations
Get all registrations for a program

#### PATCH /api/programs/registrations/:id/status
Update registration status
- Body: `{ status: "confirmed" | "attended" | "cancelled" }`

## Setup Instructions

### 1. Initialize Database
```bash
cd backend
node src/config/initDatabase.js
```

### 2. Seed Initial Data
```bash
node src/utils/seedPrograms.js
```

### 3. Start Backend Server
```bash
npm run dev
```

### 4. Environment Variables
Ensure `.env` file has:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stackenzo_db
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

## Frontend Integration

### Fetching Programs
```javascript
const response = await fetch('http://localhost:3000/api/programs');
const data = await response.json();
setPrograms(data.programs);
```

### Filtering Programs
```javascript
const response = await fetch('http://localhost:3000/api/programs?type=workshop&status=upcoming');
```

### Registering for Program
```javascript
const response = await fetch('http://localhost:3000/api/programs/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    programId: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    message: 'Looking forward to it!'
  })
});
```

## Features

### ✅ Implemented
- Complete CRUD operations for programs
- User registration system
- Email notifications on registration
- Filter by type and status
- Database storage with MySQL
- Input validation
- Error handling
- Live data updates

### 🔄 Real-time Updates
The frontend automatically fetches fresh data from the database:
- On component mount
- When filters change
- After successful registration

### 📧 Email Notifications
Automatic emails sent on:
- Program registration confirmation
- Includes program details (date, location, duration)

## Testing

### Test Program Creation
```bash
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Workshop",
    "type": "workshop",
    "date": "2024-03-01",
    "location": "Online",
    "description": "Test description",
    "duration": "2 hours",
    "status": "upcoming",
    "registrationLink": "/contact",
    "tags": ["test", "workshop"]
  }'
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/programs/register \
  -H "Content-Type: application/json" \
  -d '{
    "programId": 1,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "message": "Test registration"
  }'
```

## File Structure
```
backend/src/
├── models/
│   └── programModel.js          # Database operations
├── controllers/
│   └── programController.js     # Request handlers
├── routes/
│   └── programRoutes.js         # API routes
├── middleware/
│   └── validation.js            # Input validation
├── utils/
│   └── seedPrograms.js          # Data seeding script
└── config/
    └── initDatabase.js          # Database initialization

frontend/src/
├── Programs.jsx                 # Main programs page
├── ProgramRegistrationModal.jsx # Registration modal
└── data/
    └── programsData.json        # Initial seed data
```

## Notes
- All dates stored in MySQL DATE format (YYYY-MM-DD)
- Tags stored as JSON array in database
- Foreign key constraint ensures data integrity
- Cascade delete removes registrations when program is deleted
- Email service requires SMTP configuration in emailService.js
