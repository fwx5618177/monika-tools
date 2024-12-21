import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
    amount: { type: Number, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'completed', 'failed'] },
    createdAt: { type: Date, default: Date.now }
});

export default model('Payment', paymentSchema);
