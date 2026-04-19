const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    maxlength: 255 
  },
  is_active: { type: Boolean, default: true },
  subscribed_at: { type: Date, default: Date.now },
  unsubscribed_at: Date
}, {
  timestamps: true,
  collection: 'newsletter_subscribers'
});

const NewsletterModel = mongoose.model('Newsletter', newsletterSchema);

class Newsletter {
  // Create new subscriber (unique email)
  static async create(subscriberData) {
    try {
      const subscriber = new NewsletterModel(subscriberData);
      const saved = await subscriber.save();
      return saved._id;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already subscribed');
      }
      throw error;
    }
  }

  // Get all subscribers
  static async getAll(filters = {}) {
    const query = NewsletterModel.find();
    if (filters.active !== undefined) {
      query.where('is_active', filters.active);
    }
    return query.sort({ createdAt: -1 });
  }

  // Get by ID
  static async getById(id) {
    return NewsletterModel.findById(id);
  }

  // Update status (unsubscribe)
  static async updateStatus(id, is_active, unsubscribed_at) {
    const updateData = { is_active };
    if (unsubscribed_at) updateData.unsubscribed_at = unsubscribed_at;
    const result = await NewsletterModel.findByIdAndUpdate(id, updateData, { new: true });
    return !!result;
  }

  // Delete
  static async delete(id) {
    const result = await NewsletterModel.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = Newsletter;
