import mongoose, { Schema } from 'mongoose';
import { connectDatabase } from '../db/database';
import { UserModel } from '../types/user.model';

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const User = mongoose.model<UserModel>('User', UserSchema);