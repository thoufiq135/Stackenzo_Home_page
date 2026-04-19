const mongoose = require('mongoose');
const { generateRegistrationId } = require('../utils/generateRegistrationId');
const Counter = require('./counterModel');

const workshopRegistrationSchema = new mongoose.Schema({
  reg_id: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  college: { type: String, required: true, maxlength: 255 }, // Made required
  stream: { type: String, maxlength: 255 },
  year: { type: String, maxlength: 50 },
  batch: { type: String, maxlength: 50 },
  experience: { type: String },
  whatsapp_optin: { type: Boolean, default: false },
  message: { type: String },
  workshop_id: { type: String, default: 'summer_camp', maxlength: 100 }, // Changed default
  source: { type: String, default: 'website', maxlength: 50 },
  status: { 
    type: String, 
    default: 'confirmed',
    enum: ['confirmed', 'cancelled', 'attended', 'no_show', 'pending'],
    maxlength: 20 
  },
  // Additional fields for summer camp
  parent_name: { type: String, maxlength: 255 },
  student_number: { type: String, maxlength: 20 },
  location: { type: String, maxlength: 255 },
  class: { type: String, maxlength: 50 } // For storing class like "UG", "10th", etc.
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'workshop_registrations'
});

// Add indexes for better query performance
workshopRegistrationSchema.index({ reg_id: 1 }, { unique: true, sparse: true });
workshopRegistrationSchema.index({ email: 1 });
workshopRegistrationSchema.index({ phone: 1 });
workshopRegistrationSchema.index({ workshop_id: 1 });
workshopRegistrationSchema.index({ status: 1 });
workshopRegistrationSchema.index({ created_at: -1 });
workshopRegistrationSchema.index({ class: 1 });
workshopRegistrationSchema.index({ location: 1 });

workshopRegistrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.reg_id) {
    try {
      const sequence = await Counter.getNextSequence('workshop_registration');
      this.reg_id = generateRegistrationId(sequence);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const WorkshopRegistrationModel = mongoose.models.WorkshopRegistration || 
  mongoose.model('WorkshopRegistration', workshopRegistrationSchema);

const WorkshopRegistration = {
  /**
   * Create a new workshop registration.
   * Supports both summer camp and general workshop formats
   */
  create: async (data) => {
    try {
      // Map incoming data to schema fields
      const registrationData = {
        // Core fields
        name: data.name || data.StudentName || data.studentName,
        email: data.email,
        phone: data.phone || data.ParentNumber || data.parentNumber,
        college: data.college || data.CollegeName || data.collegeName,
        
        // Optional fields
        stream: data.stream || null,
        year: data.year || null,
        batch: data.batch || null,
        experience: data.experience || null,
        whatsapp_optin: data.whatsappOptin || data.whatsapp_optin || false,
        message: data.message || null,
        workshop_id: data.workshopId || data.workshop_id || 'summer_camp',
        source: data.source || 'website',
        
        // Summer camp specific fields
        parent_name: data.parentName || data.ParentName || null,
        student_number: data.studentNumber || data.StudentNumber || null,
        location: data.location || data.Location || null,
        class: data.class || data.Class || null
      };

      // Validate required fields
      if (!registrationData.name || !registrationData.email || !registrationData.phone || !registrationData.college) {
        throw new Error('Missing required fields: name, email, phone, and college are required');
      }

      const registration = new WorkshopRegistrationModel(registrationData);
      const saved = await registration.save();
      
      return { 
        id: saved._id, 
        regId: saved.reg_id 
      };
    } catch (error) {
      console.error('Error creating workshop registration:', error);
      throw error;
    }
  },

  /**
   * Check for duplicate registration by email OR phone.
   */
  findDuplicate: async (email, phone) => {
    try {
      const result = await WorkshopRegistrationModel.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      })
      .select('_id reg_id name email phone batch class created_at')
      .sort({ created_at: 1 })
      .lean();
      
      return result || null;
    } catch (error) {
      console.error('Error checking duplicate workshop registration:', error);
      throw error;
    }
  },

  /**
   * Get registration count stats for a workshop.
   */
  getStats: async (workshopId) => {
    try {
      const query = { status: { $ne: 'cancelled' } };
      if (workshopId) {
        query.workshop_id = workshopId;
      }

      const count = await WorkshopRegistrationModel.countDocuments(query);
      const total = await WorkshopRegistrationModel.countDocuments(workshopId ? { workshop_id: workshopId } : {});
      
      // Get today's registrations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await WorkshopRegistrationModel.countDocuments({
        ...query,
        created_at: { $gte: today }
      });
      
      return { 
        count,
        total,
        today: todayCount
      };
    } catch (error) {
      console.error('Error getting workshop stats:', error);
      throw error;
    }
  },

  /**
   * Get all registrations (admin).
   */
  getAll: async (workshopId, filters = {}) => {
    try {
      const query = {};
      if (workshopId) {
        query.workshop_id = workshopId;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.class) {
        query.class = filters.class;
      }
      if (filters.location) {
        query.location = filters.location;
      }
      
      let dbQuery = WorkshopRegistrationModel.find(query)
        .sort({ created_at: -1 });
      
      if (filters.limit) {
        dbQuery = dbQuery.limit(parseInt(filters.limit));
      }
      
      const results = await dbQuery.lean();
      return results;
    } catch (error) {
      console.error('Error getting all workshop registrations:', error);
      throw error;
    }
  },

  /**
   * Get a registration by reg_id.
   */
  getByRegId: async (regId) => {
    try {
      const result = await WorkshopRegistrationModel.findOne({ reg_id: regId }).lean();
      return result || null;
    } catch (error) {
      console.error('Error getting workshop registration by reg_id:', error);
      throw error;
    }
  },

  /**
   * Get a registration by MongoDB _id.
   */
  getById: async (id) => {
    try {
      const result = await WorkshopRegistrationModel.findById(id).lean();
      return result || null;
    } catch (error) {
      console.error('Error getting workshop registration by id:', error);
      throw error;
    }
  },

  /**
   * Update registration status.
   */
  updateStatus: async (id, status) => {
    try {
      const result = await WorkshopRegistrationModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error updating workshop registration status:', error);
      throw error;
    }
  },

  /**
   * Delete registration (admin).
   */
  delete: async (id) => {
    try {
      const result = await WorkshopRegistrationModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting workshop registration:', error);
      throw error;
    }
  },

  /**
   * Get registrations by batch/class.
   */
  getByBatch: async (batch, workshopId) => {
    try {
      const query = { $or: [{ batch: batch }, { class: batch }] };
      if (workshopId) {
        query.workshop_id = workshopId;
      }
      
      const results = await WorkshopRegistrationModel.find(query)
        .sort({ created_at: -1 })
        .lean();
      
      return results;
    } catch (error) {
      console.error('Error getting registrations by batch:', error);
      throw error;
    }
  },

  /**
   * Get registrations by date range.
   */
  getByDateRange: async (startDate, endDate, workshopId) => {
    try {
      const query = {
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      
      if (workshopId) {
        query.workshop_id = workshopId;
      }
      
      const results = await WorkshopRegistrationModel.find(query)
        .sort({ created_at: -1 })
        .lean();
      
      return results;
    } catch (error) {
      console.error('Error getting registrations by date range:', error);
      throw error;
    }
  },

  /**
   * Get detailed statistics.
   */
  getDetailedStats: async (workshopId) => {
    try {
      const query = {};
      if (workshopId) {
        query.workshop_id = workshopId;
      }

      const [
        total,
        byStatus,
        byClass,
        byLocation,
        whatsappOptinCount,
        bySource,
        todayCount,
        weeklyCount
      ] = await Promise.all([
        WorkshopRegistrationModel.countDocuments(query),
        WorkshopRegistrationModel.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $project: { status: '$_id', count: 1, _id: 0 } }
        ]),
        WorkshopRegistrationModel.aggregate([
          { $match: query },
          { $group: { _id: '$class', count: { $sum: 1 } } },
          { $project: { class: '$_id', count: 1, _id: 0 } },
          { $sort: { class: 1 } }
        ]),
        WorkshopRegistrationModel.aggregate([
          { $match: query },
          { $group: { _id: '$location', count: { $sum: 1 } } },
          { $project: { location: '$_id', count: 1, _id: 0 } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        WorkshopRegistrationModel.countDocuments({ ...query, whatsapp_optin: true }),
        WorkshopRegistrationModel.aggregate([
          { $match: query },
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $project: { source: '$_id', count: 1, _id: 0 } }
        ]),
        // Today's registrations
        WorkshopRegistrationModel.countDocuments({
          ...query,
          created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }),
        // This week's registrations
        WorkshopRegistrationModel.countDocuments({
          ...query,
          created_at: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        })
      ]);

      return {
        total,
        today: todayCount,
        thisWeek: weeklyCount,
        byStatus,
        byClass,
        byLocation,
        whatsappOptinCount,
        bySource
      };
    } catch (error) {
      console.error('Error getting detailed workshop stats:', error);
      throw error;
    }
  },

  /**
   * Get registration counts for analytics (used by frontend)
   */
  getRegistrationCounts: async () => {
    try {
      const total = await WorkshopRegistrationModel.countDocuments();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await WorkshopRegistrationModel.countDocuments({
        created_at: { $gte: today }
      });
      
      return {
        success: true,
        total: total,
        today: todayCount
      };
    } catch (error) {
      console.error('Error getting registration counts:', error);
      throw error;
    }
  },

  /**
   * Get analytics data for frontend dashboard
   */
  getAnalytics: async () => {
    try {
      const total = await WorkshopRegistrationModel.countDocuments();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await WorkshopRegistrationModel.countDocuments({
        created_at: { $gte: today }
      });
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const weekCount = await WorkshopRegistrationModel.countDocuments({
        created_at: { $gte: thisWeek }
      });
      
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() - 1);
      const monthCount = await WorkshopRegistrationModel.countDocuments({
        created_at: { $gte: thisMonth }
      });
      
      // Get class distribution
      const byClass = await WorkshopRegistrationModel.aggregate([
        { $match: { class: { $ne: null, $ne: '' } } },
        { $group: { _id: '$class', count: { $sum: 1 } } },
        { $project: { class: '$_id', count: 1, _id: 0 } },
        { $sort: { class: 1 } }
      ]);
      
      // Get location distribution
      const byLocation = await WorkshopRegistrationModel.aggregate([
        { $match: { location: { $ne: null, $ne: '' } } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $project: { location: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Get recent registrations
      const recentRegistrations = await WorkshopRegistrationModel.find()
        .select('name class location created_at')
        .sort({ created_at: -1 })
        .limit(10)
        .lean();
      
      // Format class distribution for frontend
      const classDistribution = {};
      byClass.forEach(item => {
        classDistribution[item.class] = item.count;
      });
      
      // Format location distribution for frontend
      const locationDistribution = {};
      byLocation.forEach(item => {
        locationDistribution[item.location] = item.count;
      });
      
      return {
        success: true,
        data: {
          total,
          today: todayCount,
          thisWeek: weekCount,
          thisMonth: monthCount,
          byClass: classDistribution,
          byLocation: locationDistribution,
          recentRegistrations: recentRegistrations.map(reg => ({
            name: reg.name,
            class: reg.class,
            location: reg.location,
            date: reg.created_at.toISOString().split('T')[0]
          }))
        }
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};

module.exports = WorkshopRegistration;