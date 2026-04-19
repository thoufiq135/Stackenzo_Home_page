const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
}, {
  collection: 'counters'
});

// Ensure unique index on _id
counterSchema.index({ _id: 1 }, { unique: true });

const CounterModel = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const Counter = {
  /**
   * Get next sequence value for a given counter name
   * @param {string} name - Counter name (e.g. 'workshop_registration')
   * @returns {Promise<number>} Next sequence value
   */
  getNextSequence: async (name) => {
    try {
      const counter = await CounterModel.findByIdAndUpdate(
        name,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      return counter.sequence_value;
    } catch (error) {
      console.error(`Error getting next sequence for ${name}:`, error);
      throw error;
    }
  },

  /**
   * Reset counter to specific value (admin only)
   */
  reset: async (name, value = 0) => {
    try {
      await CounterModel.findByIdAndUpdate(
        name,
        { sequence_value: value },
        { upsert: true }
      );
      return true;
    } catch (error) {
      console.error(`Error resetting counter ${name}:`, error);
      throw error;
    }
  },

  /**
   * Get current counter value
   */
  getCurrent: async (name) => {
    try {
      const counter = await CounterModel.findById(name);
      return counter ? counter.sequence_value : 0;
    } catch (error) {
      console.error(`Error getting current counter ${name}:`, error);
      throw error;
    }
  }
};

module.exports = Counter;
module.exports.CounterModel = CounterModel;
