import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    profileImage: {
        type: String,
        default: ''
    },
    notes: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
