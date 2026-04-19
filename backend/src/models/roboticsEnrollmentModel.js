const mongoose = require('mongoose');

const roboticsEnrollmentSchema = new mongoose.Schema({
  student_name: { type: String, required: true, maxlength: 255 },
  parent_name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  student_phone: { type: String, maxlength: 20 },
  whatsapp_number: { type: String, maxlength: 20 },
  location: { type: String, maxlength: 255 },
  student_class: { type: String, required: true, maxlength: 50 },
  school: { type: String, required: true, maxlength: 255 },
  age: { type: Number, required: true, min: 4, max: 18 },
  previous_experience: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'waitlisted', 'cancelled', 'completed'],
    maxlength: 20 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'robotics_enrollments'
});

const RoboticsEnrollmentModel = mongoose.model('RoboticsEnrollment', roboticsEnrollmentSchema);

const RoboticsEnrollment = {
  // Create new enrollment
  create: async (enrollmentData) => {
    const { 
      studentName, parentName, email, phone, studentClass, 
      school, age, previousExperience, message 
    } = enrollmentData;
    
    const enrollment = new RoboticsEnrollmentModel({
      student_name: studentName,
      parent_name: parentName,
      email: email,
      phone: phone,
      student_class: studentClass,
      school: school,
      age: age,
      previous_experience: previousExperience,
      message: message
    });
    
    const saved = await enrollment.save();
    return saved._id;
  },

  // Get all enrollments with optional filters
  getAll: async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.student_class) {
      query.student_class = filters.student_class;
    }
    
    if (filters.email) {
      query.email = filters.email;
    }
    
    let dbQuery = RoboticsEnrollmentModel.find(query).sort({ created_at: -1 });
    
    if (filters.limit) {
      dbQuery = dbQuery.limit(parseInt(filters.limit));
    }
    
    return dbQuery;
  },

  // Get enrollment by ID
  getById: async (id) => {
    return RoboticsEnrollmentModel.findById(id);
  },

  // Update enrollment status
  updateStatus: async (id, status) => {
    const result = await RoboticsEnrollmentModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    return result !== null;
  },

  // Delete enrollment
  delete: async (id) => {
    const result = await RoboticsEnrollmentModel.findByIdAndDelete(id);
    return result !== null;
  },

  // Get enrollments by email
  getByEmail: async (email) => {
    return RoboticsEnrollmentModel.find({ email })
      .sort({ created_at: -1 });
  },

  // Get enrollments by class
  getByClass: async (studentClass) => {
    return RoboticsEnrollmentModel.find({ student_class: studentClass })
      .sort({ created_at: -1 });
  },

  // Get enrollment statistics
  getStats: async () => {
    const total = await RoboticsEnrollmentModel.countDocuments();
    
    const byStatus = await RoboticsEnrollmentModel.aggregate([
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
    
    const byClass = await RoboticsEnrollmentModel.aggregate([
      {
        $group: {
          _id: '$student_class',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          class: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { class: 1 }
      }
    ]);
    
    const byAge = await RoboticsEnrollmentModel.aggregate([
      {
        $group: {
          _id: '$age',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          age: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { age: 1 }
      }
    ]);
    
    return {
      total,
      byStatus,
      byClass,
      byAge
    };
  },

  // Update entire enrollment
  update: async (id, updateData) => {
    const allowedUpdates = [
      'student_name', 'parent_name', 'email', 'phone', 
      'student_class', 'school', 'age', 'previous_experience', 'message'
    ];
    
    const updateFields = {};
    for (const field of allowedUpdates) {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    }
    
    const result = await RoboticsEnrollmentModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    return result;
  },

  // Get enrollments by date range
  getByDateRange: async (startDate, endDate) => {
    return RoboticsEnrollmentModel.find({
      created_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ created_at: -1 });
  },

  // Count enrollments by status
  countByStatus: async (status) => {
    return RoboticsEnrollmentModel.countDocuments({ status });
  }
};

module.exports = RoboticsEnrollment;