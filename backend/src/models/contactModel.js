const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
  collection: 'contact_submissions'
});

const ContactModel = mongoose.model('Contact', contactSchema);

class Contact {
  // Create new contact submission
  static async create(contactData) {
    const contact = new ContactModel(contactData);
    const saved = await contact.save();
    return saved._id;
  }

  // Get all contact submissions
  static async getAll(filters = {}) {
    return ContactModel.find().sort({ createdAt: -1 });
  }

  // Get by ID
  static async getById(id) {
    return ContactModel.findById(id);
  }

  // Update status
  static async updateStatus(id, status) {
    const result = await ContactModel.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    );
    return !!result;
  }

  // Delete
  static async delete(id) {
    const result = await ContactModel.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = Contact;
