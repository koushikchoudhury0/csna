import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    complete: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

todoSchema.index({ user: 1, title: 1 }, { unique: true });

const todoModel = mongoose.model('todo', todoSchema);

export { todoModel }