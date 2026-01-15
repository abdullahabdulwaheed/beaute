import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Category', categorySchema);
