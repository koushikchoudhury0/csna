import mongoose from "mongoose";

interface LoginData {
    accessToken: string,
    refreshToken: string,
    id: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string
}

export { LoginData }