const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const { validateEnrollment, validateWorkshopRegistration } = require('../middleware/validation');

// ── Workshop routes (must be before /:id to avoid conflicts) ──────────────
router.post('/workshop/register', validateWorkshopRegistration, EnrollmentController.workshopRegister);
router.get('/workshop/stats', EnrollmentController.getWorkshopStats);

// ── Summer Camp routes ────────────────────────────────────────────────────
router.post('/summer-camp/add_data', require('../middleware/validation').validateSummerCampRegistration, EnrollmentController.summerCampRegister);

// Public routes
router.post('/', validateEnrollment, EnrollmentController.submitEnrollment);

// Admin routes (add auth middleware in production)
router.get('/', EnrollmentController.getAllEnrollments);
router.get('/stats', EnrollmentController.getStats);
router.get('/:id', EnrollmentController.getEnrollmentById);
router.patch('/:id/status', EnrollmentController.updateEnrollmentStatus);

module.exports = router;
