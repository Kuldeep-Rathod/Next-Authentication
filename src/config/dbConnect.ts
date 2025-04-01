import { error } from 'console';
import mongoose from 'mongoose';

export const dbConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI as string);
        const conn = mongoose.connection;

        conn.on('connected', () => {
            console.log('DB connected successfully');
        });

        conn.on('error', () => {
            console.log('DB connection error', error);
            process.exit();
        });
    } catch (error) {
        console.log('DB connection error', error);
    }
};
