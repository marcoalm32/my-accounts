import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.DB_MONGO_PORT;
const HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME

const mongouri = `mongodb://${HOST}:${PORT}/${DB_NAME}`;

export const connectDatabase = () => {
    console.log('Connecting to database...');
    mongoose.connect(mongouri)
    .then(() => {
        console.log(`${DB_NAME} database connected successfully`);
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });
}
