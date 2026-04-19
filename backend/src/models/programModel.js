const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 255 },
  type: { 
    type: String, 
    required: true,
    enum: ['workshop', 'seminar', 'conference', 'training', 'webinar', 'course'],
    maxlength: 50 
  },
  date: { type: Date, required: true },
  location: { type: String, maxlength: 255 },
  description: { type: String, required: true },
  duration: { type: String, maxlength: 100 },
  status: { 
    type: String, 
    default: 'upcoming',
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    maxlength: 20 
  },
  registration_link: String,
  tags: { type: [String], default: [] }
}, {
  timestamps: true,
  collection: 'programs'
});

const Program = mongoose.model('Program', programSchema);

class ProgramModelClass {
  // Create new program
  static async create(programData) {
    const program = new Program(programData);
    const saved = await program.save();
    return saved._id;
  }

  // Get all programs
  static async getAll(filters = {}) {
    const query = Program.find();
    if (filters.status) {
      query.where('status', filters.status);
    }
    if (filters.type) {
      query.where('type', filters.type);
    }
    return query.sort({ date: 1 });
  }

  // Get by ID
  static async getById(id) {
    return Program.findById(id);
  }

  // Update program
  static async update(id, updateData) {
    const result = await Program.findByIdAndUpdate(id, updateData, { new: true });
    return result;
  }

  // Delete
  static async delete(id) {
    const result = await Program.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = ProgramModelClass;
