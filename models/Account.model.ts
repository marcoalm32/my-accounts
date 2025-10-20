import mongoose, { Schema} from "mongoose";
import { Account } from '../types/account';
import { connectDatabase } from "../db/database";

const accountSchema: Schema = new Schema<Account>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    reference: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountType: { type: Schema.Types.ObjectId, ref: 'AccountType', required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const AccountModel = mongoose.model<Account>('Account', accountSchema);