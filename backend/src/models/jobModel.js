const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 255 },
  department: { type: String, required: true, maxlength: 255 },
  location: { type: String, required: true, maxlength: 255 },
  type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  experience: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'closed', 'draft']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'job_postings'
});

const JobModel = mongoose.models.Job || mongoose.model('Job', jobSchema);

class Job {
  // Get all active job postings
  static async getAllPostings() {
    try {
      const jobs = await JobModel.find({ status: 'active' })
        .sort({ created_at: -1 })
        .lean();
      return jobs;
    } catch (error) {
      console.error('Error getting all job postings:', error);
      throw error;
    }
  }

  // Get job by ID
  static async getById(id) {
    try {
      const job = await JobModel.findById(id).lean();
      return job;
    } catch (error) {
      console.error('Error getting job by id:', error);
      throw error;
    }
  }

  // Create new job posting
  static async create(jobData) {
    try {
      const job = new JobModel(jobData);
      const saved = await job.save();
      return saved._id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Update job
  static async update(id, updateData) {
    try {
      const result = await JobModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete job
  static async delete(id) {
    try {
      const result = await JobModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Update job status
  static async updateStatus(id, status) {
    try {
      const result = await JobModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }
}

module.exports = Job;