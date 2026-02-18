import mongoose from 'mongoose';

const subToolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'retired'],
        default: 'active'
    }
});

const toolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    revenueCounter: { type: Number, default: 0 },
    category: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'retired'],
        default: 'active'
    },
    payoffPercentage: { type: Number, default: 0, min: 0, max: 100 },
    usageCount: { type: Number, default: 0 },
    lastUsed: { type: Date },
    subTools: [subToolSchema]
}, { timestamps: true });

toolSchema.methods.calculatePayoff = function () {
    if (this.purchasePrice === 0) {
        this.payoffPercentage = 100;
    } else {
        this.payoffPercentage = Math.min((this.revenueCounter / this.purchasePrice) * 100, 100);
    }
    return this.payoffPercentage;
};

export default mongoose.model('Tool', toolSchema);
