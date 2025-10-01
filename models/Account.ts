import mongoose, { Schema} from "mongoose";
import { AccountModel } from '../types/account.model';
import { connectDatabase } from "../db/database";

const accountSchema: Schema = new Schema<AccountModel>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    installment: { type: Number, required: true },
    totalInstallments: { type: Number, required: true },
    paid: { type: Boolean, default: false },
}, {timestamps: true});

async function startServer() {
    await connectDatabase();
}

startServer();

export const Account = mongoose.model<AccountModel>('Account', accountSchema);