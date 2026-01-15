import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    images: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);
