import mongoose, { Schema} from "mongoose";
import { AccountModel } from '../types/account.model';
import { connectDatabase } from "../db/database";

const accountSchema: Schema = new Schema<AccountModel>({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date, required: true },
    reference: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountType: { type: Schema.Types.ObjectId, ref: 'AccountType', required: true },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const Account = mongoose.model<AccountModel>('Account', accountSchema);