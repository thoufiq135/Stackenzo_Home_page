# Stackenzo Programs System

## Overview
Complete backend and frontend system for managing programs (workshops, hackathons, challenges, school programs, expos) with database integration.

## Database Structure

### Programs Table
- **id**: Primary key
- **title**: Program name
- **type**: ENUM('workshop', 'hackathon', 'challenge', 'school-program', 'expo')
- **date**: Program date
- **location**: Venue/location
- **description**: Detailed description
- **duration**: Program duration
- **status**: ENUM('upcoming', 'ongoing', 'registration-open', 'completed', 'cancelled')
- **registration_link**: Registration URL
- **tags**: JSON array of tags
- **created_at/updated_at**: Timestamps

### Program Registrations Table
- **id**: Primary key
- **program_id**: Foreign key to programs
- **name**: Registrant name
- **email**: Registrant email
- **phone**: Contact number
- **message**: Optional message
- **status**: ENUM('pending', 'confirmed', 'attended', 'cancelled')
- **created_at/updated_at**: Timestamps

## Quick Setup

### 1. Initialize Database
```bash
cd backend
node src/config/initDatabase.js
```

### 2. Insert Sample Data
```bash
node insertProgramData.js
```

### 3. Start Backend
```bash
npm start
```

### 4. Start Frontend
```bash
cd ../
npm run dev
```

## API Endpoints

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs?type=hackathon` - Filter by type
- `GET /api/programs?status=upcoming` - Filter by status
- `GET /api/programs/:id` - Get single program
- `POST /api/programs` - Create program (admin)
- `PUT /api/programs/:id` - Update program (admin)
- `DELETE /api/programs/:id` - Delete program (admin)

### Registrations
- `POST /api/programs/register` - Register for program
- `GET /api/programs/:id/registrations` - Get program registrations (admin)
- `PUT /api/programs/registrations/:id` - Update registration status (admin)

## Adding New Programs

### Method 1: Direct Database Insert
```sql
INSERT INTO programs (title, type, date, location, description, duration, status, registration_link, tags)
VALUES (
  'Your Program Title',
  'hackathon',
  '2024-03-15',
  'Your Location',
  'Program description...',
  '48 hours',
  'registration-open',
  'https://your-registration-link.com',
  '["tag1", "tag2", "tag3"]'
);
```

### Method 2: Using API
```javascript
const programData = {
  title: "New Hackathon 2024",
  type: "hackathon",
  date: "2024-03-15",
  location: "Nellore, AP",
  description: "Amazing hackathon event...",
  duration: "48 hours",
  status: "registration-open",
  registration_link: "https://register.com",
  tags: ["AI", "Web Dev", "Mobile"]
};

fetch('http://localhost:3000/api/programs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(programData)
});
```

### Method 3: Using Node.js Script
Create a new file `addProgram.js`:
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const addProgram = async (programData) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'stackenzo_db'
  });

  await connection.query(`
    INSERT INTO programs (title, type, date, location, description, duration, status, registration_link, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    programData.title,
    programData.type,
    programData.date,
    programData.location,
    programData.description,
    programData.duration,
    programData.status,
    programData.registration_link,
    JSON.stringify(programData.tags)
  ]);

  await connection.end();
};

// Usage
addProgram({
  title: "Your Hackathon",
  type: "hackathon",
  date: "2024-03-15",
  location: "Your Location",
  description: "Description...",
  duration: "48 hours",
  status: "registration-open",
  registration_link: "https://register.com",
  tags: ["AI", "Web", "Mobile"]
});
```

## Program Types Available
- **workshop**: Technical workshops (2-4 days)
- **hackathon**: Coding competitions (24-48 hours)
- **challenge**: Problem-solving challenges (1 week)
- **school-program**: Programs for school students (ongoing)
- **expo**: Technology exhibitions (1-2 days)

## Status Options
- **upcoming**: Future events
- **ongoing**: Currently running
- **registration-open**: Accepting registrations
- **completed**: Finished events
- **cancelled**: Cancelled events

## Features
✅ **Complete CRUD operations**
✅ **Email notifications for registrations**
✅ **Filtering by type and status**
✅ **Responsive UI with animations**
✅ **Registration management**
✅ **Database relationships with foreign keys**
✅ **Input validation and error handling**
✅ **Timeline and grid view modes**

## Frontend Features
- Dynamic program loading from database
- Filter by type (workshop, hackathon, etc.)
- Filter by status (upcoming, ongoing, etc.)
- Grid and timeline view modes
- Program registration with email confirmation
- Responsive design with animations
- Search and sorting capabilities

## Email Configuration
Set up email service in `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Usage Example
1. Run `node insertProgramData.js` to add sample programs
2. Visit `http://localhost:3000/Programs` to see the programs
3. Click "Learn More" to view program details
4. Register for programs and receive email confirmations

The system is now ready to use with a complete backend, database structure, and frontend integration!