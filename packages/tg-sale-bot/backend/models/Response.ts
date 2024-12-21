import { Schema, model } from 'mongoose';

const responseSchema = new Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model('Response', responseSchema);
