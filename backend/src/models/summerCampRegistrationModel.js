const mongoose = require('mongoose');
const { generateRegistrationId } = require('../utils/generateRegistrationId');

const summerCampRegistrationSchema = new mongoose.Schema({
  reg_id: { type: String, unique: true, sparse: true },
  StudentName: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  CollegeName: { type: String, required: true, maxlength: 255 },
  Class: { type: String, required: true, maxlength: 100 },
  ParentName: { type: String, required: true, maxlength: 255 },
  ParentNumber: { type: String, required: true, maxlength: 20 },
  StudentNumber: { type: String, maxlength: 20 },
  Location: { type: String, required: true, maxlength: 255 },
  WhatsappNumber: { type: String, required: true, maxlength: 20 },
  status: { 
    type: String, 
    default: 'confirmed',
    enum: ['confirmed', 'cancelled', 'attended', 'no_show'],
    maxlength: 20 
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'summer_camp_registrations'
});

// Add indexes
summerCampRegistrationSchema.index({ reg_id: 1 }, { unique: true, sparse: true });
summerCampRegistrationSchema.index({ email: 1 });
summerCampRegistrationSchema.index({ ParentNumber: 1 });
summerCampRegistrationSchema.index({ WhatsappNumber: 1 });
summerCampRegistrationSchema.index({ status: 1 });
summerCampRegistrationSchema.index({ created_at: -1 });

const SummerCampRegistrationModel = mongoose.model('SummerCampRegistration', summerCampRegistrationSchema);

const SummerCampRegistration = {
  create: async (data) => {
    const {
      StudentName, email, CollegeName, Class, ParentName,
      ParentNumber, StudentNumber, Location, WhatsappNumber
    } = data;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const registration = new SummerCampRegistrationModel({
        StudentName,
        email,
        CollegeName,
        Class,
        ParentName,
        ParentNumber,
        StudentNumber: StudentNumber || null,
        Location,
        WhatsappNumber
      });

      const saved = await registration.save({ session });
      const dbId = saved._id;

      const idNumber = parseInt(dbId.toString().slice(-8), 16);
      const regId = generateRegistrationId(idNumber);
      
      const updated = await SummerCampRegistrationModel.findByIdAndUpdate(
        dbId,
        { reg_id: regId },
        { session, new: true }
      );

      await session.commitTransaction();
      return { id: dbId, regId };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating summer camp registration:', error);
      throw error;
    } finally {
      session.endSession();
    }
  },

  findDuplicate: async (email, ParentNumber, WhatsappNumber) => {
    try {
      const result = await SummerCampRegistrationModel.findOne({
        $or: [
          { email },
          { ParentNumber },
          { WhatsappNumber }
        ]
      })
      .select('reg_id StudentName email ParentNumber WhatsappNumber created_at')
      .sort({ created_at: 1 })
      .lean();
      
      return result || null;
    } catch (error) {
      console.error('Error checking duplicate summer camp registration:', error);
      throw error;
    }
  }
};

module.exports = SummerCampRegistration;
