import mongoose, { Schema} from "mongoose";
import { Income } from "../types/income";
import { connectDatabase } from '../db/database';

const incomeSchema = new Schema<Income>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    receivedDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const IncomeModel = mongoose.model<Income>('Income', incomeSchema); 