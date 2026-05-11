const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const rndApplicationRoutes = require('./routes/rndApplicationRoutes');
const programRoutes = require('./routes/programRoutes');
const roboticsEnrollmentRoutes = require('./routes/roboticsEnrollmentRoutes');
const schoolPartnershipRoutes = require('./routes/schoolPartnershipRoutes');
const marketingAuditRoutes = require('./routes/marketingAudit');
const queryRoutes = require('./routes/queryRoutes');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://stackenzo-home-page-bcor.vercel.app',
  'https://www.stackenzo.com',
  'https://stackenzo.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL 
//     ? process.env.FRONTEND_URL.split(',')
//     : ['http://localhost:5173', 'https://stackenzo-home-page-bcor.vercel.app','https://www.stackenzo.com', 'https://stackenzo.com'],
//   credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/rnd-applications', rndApplicationRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/robotics-enrollments', roboticsEnrollmentRoutes);
app.use('/api/school-partnerships', schoolPartnershipRoutes);
app.use('/api/marketing-audit', marketingAuditRoutes);
app.use('/api/queries', queryRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
