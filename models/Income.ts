import mongoose, { Schema} from "mongoose";
import { IncomeModel } from "../types/income.model";
import { connectDatabase } from '../db/database';

const incomeSchema = new Schema<IncomeModel>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    receivedDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const Income = mongoose.model<IncomeModel>('Income', incomeSchema); 