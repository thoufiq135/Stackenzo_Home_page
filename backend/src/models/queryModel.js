const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, maxlength: 20 },
  subject: { type: String, required: true, maxlength: 500 },
  message: { type: String, required: true },
  status: { 
    type: String, 
    default: 'new',
    enum: ['new', 'in_progress', 'resolved'],
    maxlength: 20 
  }
}, {
  timestamps: true,
  collection: 'queries'
});

const Query = mongoose.models.Query || mongoose.model('Query', querySchema);

class QueryModel {
  static async create(queryData) {
    const query = new Query(queryData);
    const saved = await query.save();
    return saved._id;
  }

  static async getAll(filters = {}) {
    const query = {};
    if (filters.status) {
      query.status = filters.status;
    }
    return Query.find(query).sort({ createdAt: -1 });
  }

  static async getById(id) {
    return Query.findById(id);
  }

  static async updateStatus(id, status) {
    const result = await Query.findByIdAndUpdate(id, { status }, { new: true });
    return !!result;
  }

  static async delete(id) {
    const result = await Query.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = QueryModel;
