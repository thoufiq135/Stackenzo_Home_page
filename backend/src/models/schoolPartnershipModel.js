const mongoose = require('mongoose');

const schoolPartnershipSchema = new mongoose.Schema({
  school_name: { type: String, required: true, maxlength: 255 },
  school_address: { type: String, required: true },
  contact_person: { type: String, required: true, maxlength: 255 },
  designation: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 100 },
  pincode: { type: String, required: true, maxlength: 10 },
  student_count: { type: Number, required: true, min: 1 },
  preferred_start_date: { type: Date, required: true },
  message: { type: String },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'contacted', 'meeting_scheduled', 'negotiation', 'partnered', 'rejected'],
    maxlength: 20 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'school_partnerships'
});

// Add index for faster queries on status and email
schoolPartnershipSchema.index({ status: 1 });
schoolPartnershipSchema.index({ email: 1 });
schoolPartnershipSchema.index({ created_at: -1 });

const SchoolPartnershipModel = mongoose.model('SchoolPartnership', schoolPartnershipSchema);

const SchoolPartnership = {
  // Create new school partnership request
  create: async (partnershipData) => {
    const {
      schoolName, schoolAddress, contactPerson, designation, email, phone,
      city, state, pincode, studentCount, preferredStartDate, message
    } = partnershipData;

    const partnership = new SchoolPartnershipModel({
      school_name: schoolName,
      school_address: schoolAddress,
      contact_person: contactPerson,
      designation: designation,
      email: email,
      phone: phone,
      city: city,
      state: state,
      pincode: pincode,
      student_count: studentCount,
      preferred_start_date: preferredStartDate,
      message: message
    });

    const saved = await partnership.save();
    return saved._id;
  },

  // Get all school partnership requests with optional filters
  getAll: async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.city) {
      query.city = filters.city;
    }
    
    if (filters.state) {
      query.state = filters.state;
    }
    
    if (filters.email) {
      query.email = filters.email;
    }
    
    let dbQuery = SchoolPartnershipModel.find(query).sort({ created_at: -1 });
    
    if (filters.limit) {
      dbQuery = dbQuery.limit(parseInt(filters.limit));
    }
    
    return dbQuery;
  },

  // Get partnership by ID
  getById: async (id) => {
    return SchoolPartnershipModel.findById(id);
  },

  // Update partnership status
  updateStatus: async (id, status) => {
    const result = await SchoolPartnershipModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    return result !== null;
  },

  // Delete partnership request
  delete: async (id) => {
    const result = await SchoolPartnershipModel.findByIdAndDelete(id);
    return result !== null;
  },

  // Get partnerships by status
  getByStatus: async (status) => {
    return SchoolPartnershipModel.find({ status })
      .sort({ created_at: -1 });
  },

  // Get partnerships by city/state
  getByLocation: async (city, state) => {
    const query = {};
    if (city) query.city = city;
    if (state) query.state = state;
    
    return SchoolPartnershipModel.find(query)
      .sort({ created_at: -1 });
  },

  // Get partnership statistics
  getStats: async () => {
    const total = await SchoolPartnershipModel.countDocuments();
    
    const byStatus = await SchoolPartnershipModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const byState = await SchoolPartnershipModel.aggregate([
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          state: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const totalStudents = await SchoolPartnershipModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$student_count' }
        }
      }
    ]);
    
    return {
      total,
      byStatus,
      byState,
      totalStudents: totalStudents[0]?.total || 0
    };
  },

  // Update partnership with notes/comments
  addNotes: async (id, notes) => {
    const result = await SchoolPartnershipModel.findByIdAndUpdate(
      id,
      { 
        $push: { 
          notes: {
            text: notes,
            created_at: new Date()
          }
        }
      },
      { new: true }
    );
    return result;
  },

  // Get partnerships by date range
  getByDateRange: async (startDate, endDate) => {
    return SchoolPartnershipModel.find({
      created_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ created_at: -1 });
  },

  // Update entire partnership
  update: async (id, updateData) => {
    const allowedUpdates = [
      'school_name', 'school_address', 'contact_person', 'designation', 
      'email', 'phone', 'city', 'state', 'pincode', 'student_count', 
      'preferred_start_date', 'message'
    ];
    
    const updateFields = {};
    for (const field of allowedUpdates) {
      if (updateData[field] !== undefined) {
        // Convert camelCase to snake_case for database fields
        const dbField = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        updateFields[dbField] = updateData[field];
      }
    }
    
    const result = await SchoolPartnershipModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    return result;
  }
};

module.exports = SchoolPartnership;