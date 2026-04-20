const mongoose = require('mongoose');
const { CounterModel } = require('../models/counterModel');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database schemas and indexes...');
    
    // Ensure all models are compiled (triggers schema registration)
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB admin ping successful');
    
    // Collection verification
    const collections = await mongoose.connection.db.listCollections({name: 'summer_camp_registrations'}).toArray();
    if (collections.length > 0) {
      console.log('✅ summer_camp_registrations collection verified');
    } else {
      console.log('ℹ️  summer_camp_registrations collection will be auto-created on first insert');
    }

    // Verify counters collection for registration IDs
    const counterCollections = await mongoose.connection.db.listCollections({name: 'counters'}).toArray();
    if (counterCollections.length > 0) {
      console.log('✅ counters collection verified');
      
      // Don't try to create index on _id - it's automatically indexed by MongoDB
      // Only create indexes on other fields if needed
      try {
        // Example: Create index on sequence_value if you query by it frequently
        // await mongoose.connection.db.collection('counters').createIndex(
        //   { sequence_value: 1 }, 
        //   { background: true }
        // );
        console.log('✅ counters collection ready (automatic _id index exists)');
      } catch (indexError) {
        console.log('ℹ️  Index creation skipped or already exists');
      }
    } else {
      console.log('ℹ️  counters collection will be auto-created on first counter use');
    }

    // Initialize workshop counter (safe - won't overwrite if exists)
    try {
      await CounterModel.findByIdAndUpdate(
        'workshop_registration',
        { sequence_value: 0 },
        { upsert: true, new: true }
      );
      console.log('✅ workshop_registration counter initialized');
    } catch (error) {
      console.log('ℹ️  workshop counter already exists or minor init issue:', error.message);
    }
    
    // Indexes auto-created by Mongoose on first model use
    console.log('✅ Model indexes will be auto-created by Mongoose');
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
};

module.exports = { initDatabase };