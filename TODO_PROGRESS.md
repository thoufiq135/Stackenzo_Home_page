# MongoDB Migration - Progress Tracking

## Plan Steps:

### 1. Update Config Files ✅ [COMPLETE]
- [x] Update `backend/src/config/database.js` (mongoose connect)
- [x] Update `backend/src/config/initDatabase.js` (remove PG init)

### 2. Convert 12 Models to Mongoose
- [x] contactModel.js → contact_submissions
- [x] enrollmentModel.js → enrollment_submissions
- [x] jobModel.js → job_postings (+ job_applications?)
- [x] newsletterModel.js → newsletter_subscribers
- [x] programModel.js → programs (+ program_registrations?)
- [ ] queryModel.js → queries
- [ ] quoteModel.js → quote_requests
- [ ] resumeModel.js → resume_submissions
- [ ] rndApplicationModel.js → rnd_applications
- [ ] roboticsEnrollmentModel.js → robotics_enrollments
- [ ] schoolPartnershipModel.js → school_partnerships
- [ ] workshopRegistrationModel.js → workshop_registrations

### 3. Update server.js
- [x] Replace PG init with mongoose connect

### 4. Post-Update
- [ ] Run `npm install`
- [ ] Test server startup and endpoints

## Notes:
- Follow exact method signatures from existing models
- Use collection names matching PG tables from initDatabase.js
- Ensure timestamps: true in schemas
