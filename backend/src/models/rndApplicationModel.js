const mongoose = require('mongoose');

const rndApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  project_id: { type: String, required: true, maxlength: 255 },
  project_title: { type: String, required: true, maxlength: 500 },
  qualification: { type: String, required: true, maxlength: 255 },
  institution: { type: String, required: true, maxlength: 255 },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  experience: { type: String },
  research_interests: { type: String, required: true },
  why_join: { type: String, required: true },
  resume_url: { type: String, required: true },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'],
    maxlength: 20 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'rnd_applications'
});

const RNDApplicationModel = mongoose.model('RNDApplication', rndApplicationSchema);

const rndApplicationModel = {
  create: async (applicationData) => {
    const application = new RNDApplicationModel({
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      project_id: applicationData.projectId,
      project_title: applicationData.projectTitle,
      qualification: applicationData.qualification,
      institution: applicationData.institution,
      cgpa: applicationData.cgpa,
      experience: applicationData.experience,
      research_interests: applicationData.researchInterests,
      why_join: applicationData.whyJoin,
      resume_url: applicationData.resumeUrl
    });
    
    const saved = await application.save();
    return saved._id;
  },

  getAll: async (filters = {}) => {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.project_id) query.project_id = filters.project_id;
    
    return RNDApplicationModel.find(query).sort({ created_at: -1 });
  },

  getById: async (id) => {
    return RNDApplicationModel.findById(id);
  },

  updateStatus: async (id, status) => {
    const result = await RNDApplicationModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    return result !== null;
  },

  delete: async (id) => {
    const result = await RNDApplicationModel.findByIdAndDelete(id);
    return result !== null;
  }
};

module.exports = rndApplicationModel;