#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedUsers } from './users.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms_copilot';

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected:', mongoose.connection.host);
    
    console.log('\nRunning seed...\n');
    await seedUsers();
    
    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
