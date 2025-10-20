import mongoose, { Schema } from 'mongoose';
import { connectDatabase } from '../db/database';
import { User } from '../types/user';

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const UserModel = mongoose.model<User>('User', UserSchema);