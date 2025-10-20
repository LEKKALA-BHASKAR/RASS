import mongoose from 'mongoose';

const CompanyPartnershipFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('CompanyPartnershipForm', CompanyPartnershipFormSchema);
