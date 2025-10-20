import mongoose from 'mongoose';

const StudentAmbassadorForm = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    university: {
        type: String,
        required: [true, 'University is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    graduationYear: {
        type: String,
        required: [true, 'Graduation Year is required']
    },
    currentYear: {
        type: String,
        required: [true, 'Current Year is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    competencies: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('StudentAmbassadorForm', StudentAmbassadorForm);