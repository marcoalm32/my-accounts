import { connectDatabase } from "../db/database";
import mongoose, { Schema } from "mongoose";
import { AccountTypeModel } from "../types/account-type.model";

const accountTypeSchema = new Schema<AccountTypeModel>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

async function startServer() {
    await connectDatabase();
}

startServer();

export const AccountType = mongoose.model('AccountType', accountTypeSchema);