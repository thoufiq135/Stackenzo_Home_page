// backend/src/models/resumeModel.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  position: { type: String, required: true, maxlength: 255 },
  experience: { type: String, required: true },
  resume_filename: { type: String, required: true },
  resume_data: { type: Buffer, required: true },
  resume_mimetype: { type: String, required: true, maxlength: 100 },
  message: { type: String },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    maxlength: 20 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'resume_submissions'
});

resumeSchema.virtual('resume_url').get(function() {
  return `http://localhost:3000/api/resumes/${this._id}/view`;
});

resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

const resumeModel = {
  // Create a new resume submission
  createResume: async (resumeData) => {
    try {
      const resume = new ResumeModel({
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        position: resumeData.position,
        experience: resumeData.experience,
        resume_filename: resumeData.resume_filename,
        resume_data: resumeData.resume_data,
        resume_mimetype: resumeData.resume_mimetype,
        message: resumeData.message || ""
      });
      
      const saved = await resume.save();
      return saved._id;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  },

  // Get all resumes with optional filters
  getAllResumes: async (filters = {}) => {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.position) query.position = { $regex: filters.position, $options: 'i' };
      if (filters.email) query.email = filters.email;
      
      const resumes = await ResumeModel.find(query)
        .select('-resume_data') // Exclude binary data
        .sort({ created_at: -1 })
        .lean();
      
      return resumes;
    } catch (error) {
      console.error('Error getting resumes:', error);
      throw error;
    }
  },

  // Get resume by ID
  getResumeById: async (id) => {
    try {
      const resume = await ResumeModel.findById(id).lean();
      return resume;
    } catch (error) {
      console.error('Error getting resume by id:', error);
      throw error;
    }
  },

  // Update resume status
  updateResumeStatus: async (id, status) => {
    try {
      const result = await ResumeModel.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error updating resume status:', error);
      throw error;
    }
  },

  // Delete resume
  deleteResume: async (id) => {
    try {
      const result = await ResumeModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  // Get resumes by email
  getResumesByEmail: async (email) => {
    try {
      const resumes = await ResumeModel.find({ email })
        .select('-resume_data')
        .sort({ created_at: -1 })
        .lean();
      return resumes;
    } catch (error) {
      console.error('Error getting resumes by email:', error);
      throw error;
    }
  },

  // Get resume statistics
  getResumeStats: async () => {
    try {
      const stats = await ResumeModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } }
      ]);
      return stats;
    } catch (error) {
      console.error('Error getting resume stats:', error);
      throw error;
    }
  }
};

module.exports = resumeModel;