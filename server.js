const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: './backend/.env' });

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
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
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Import routes
const contactRoutes = require('./backend/src/routes/contactRoutes');
const enrollmentRoutes = require('./backend/src/routes/enrollmentRoutes');
const jobRoutes = require('./backend/src/routes/jobRoutes');
const newsletterRoutes = require('./backend/src/routes/newsletterRoutes');
const resumeRoutes = require('./backend/src/routes/resumeRoutes');
const quoteRoutes = require('./backend/src/routes/quoteRoutes');
const rndApplicationRoutes = require('./backend/src/routes/rndApplicationRoutes');
const programRoutes = require('./backend/src/routes/programRoutes');
const roboticsEnrollmentRoutes = require('./backend/src/routes/roboticsEnrollmentRoutes');
const schoolPartnershipRoutes = require('./backend/src/routes/schoolPartnershipRoutes');
const marketingAuditRoutes = require('./backend/src/routes/marketingAudit');
const queryRoutes = require('./backend/src/routes/queryRoutes');
// const workshopRegistrationRoutes = require('./backend/src/routes/workshopRegistrationRoutes'); // Add this if needed

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
// app.use('/api/workshop-registrations', workshopRegistrationRoutes); // Add this if needed

// Serve frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// Error handling middleware
const { errorHandler, notFound } = require('./backend/src/middleware/errorHandler');
const mongoose = require('mongoose');
const { initDatabase } = require('./backend/src/config/initDatabase');

// MongoDB connection function
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove deprecated options
      // useCreateIndex: true, // No longer needed in Mongoose 7+
      // useFindAndModify: false // No longer needed in Mongoose 7+
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectMongoDB();
    console.log('✅ Database connected');
    
    // Test connection
    const dbStatus = mongoose.connection.readyState;
    if (dbStatus !== 1) {
      throw new Error('Database connection failed');
    }
    
    console.log('📊 Database state:', dbStatus === 1 ? 'Connected' : 'Disconnected');
    
    // Initialize database schemas and indexes
    console.log('🔄 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialization complete');
    
    // Apply middleware after database connection
    app.use(notFound);
    app.use(errorHandler);
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing purposes
module.exports = { app, startServer };