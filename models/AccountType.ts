import { connectDatabase } from "../db/database";
import mongoose, { Schema } from "mongoose";
import { AccountType } from "../types/account-type";

const accountTypeSchema = new Schema<AccountType>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

async function startServer() {
    await connectDatabase();
}

startServer();

export const AccountTypeModel = mongoose.model<AccountType>('AccountType', accountTypeSchema);