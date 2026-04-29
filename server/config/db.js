import mongoose from 'mongoose';
import {seedUsers} from "../seed/users.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected:', conn.connection.host);
     // await seedUsers();

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // process.exit(1);
  }
};
