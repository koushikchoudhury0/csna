import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: { type: String, required: true }
}, { timestamps: true });

const postsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comments: [commentSchema]
}, { timestamps: true });

postsSchema.index({ user: 1 });

const postsModel = mongoose.model('posts', postsSchema);

export { postsModel };