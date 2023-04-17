import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
});

usersSchema.index({ email: 1 }, { unique: true });

const usersModel = mongoose.model('users', usersSchema);

export { usersModel };