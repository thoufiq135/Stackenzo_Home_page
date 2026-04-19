const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  company: { type: String, maxlength: 255 },
  service: { type: String, required: true, maxlength: 500 },
  message: { type: String, required: true },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'reviewed', 'contacted', 'completed', 'rejected'],
    maxlength: 20 
  }
}, {
  timestamps: true,
  collection: 'quote_requests'
});

const QuoteModel = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);

class Quote {
  // Create new quote request
  static async create(quoteData) {
    const quote = new QuoteModel(quoteData);
    const saved = await quote.save();
    return saved._id;
  }

  // Get all quote requests with optional status filter
  static async getAll(filters = {}) {
    const query = {};
    if (filters.status) {
      query.status = filters.status;
    }
    
    let dbQuery = QuoteModel.find(query).sort({ createdAt: -1 });
    
    if (filters.limit) {
      dbQuery = dbQuery.limit(parseInt(filters.limit));
    }
    
    return dbQuery;
  }

  // Get by ID
  static async getById(id) {
    return QuoteModel.findById(id);
  }

  // Update status
  static async updateStatus(id, status) {
    const result = await QuoteModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    return !!result;
  }

  // Delete quote request
  static async delete(id) {
    const result = await QuoteModel.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = Quote;