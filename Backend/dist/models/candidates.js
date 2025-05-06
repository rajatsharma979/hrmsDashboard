import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    }
});
export default mongoose.model('Candidate', candidateSchema);
