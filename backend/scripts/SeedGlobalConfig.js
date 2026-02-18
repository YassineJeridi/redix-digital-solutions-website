// Seed script — creates or resets the GlobalConfig singleton
// with the default master key: RedixMasterKey2026
//
// Usage:  node scripts/SeedGlobalConfig.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import GlobalConfig from '../models/GlobalConfig.js';

dotenv.config();

const DEFAULT_KEY = 'RedixMasterKey2026';

const seedGlobalConfig = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/redix-agency'
        );
        console.log('✅ MongoDB connected');

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(DEFAULT_KEY, salt);

        // Upsert — create if missing, update if exists
        await GlobalConfig.findOneAndUpdate(
            {},
            {
                masterKeyHash: hash,
                lastKeyUpdate: new Date(),
                updatedBy: 'system-seed',
            },
            { upsert: true, new: true }
        );

        console.log('✅ GlobalConfig seeded successfully');
        console.log(`   Default master key: ${DEFAULT_KEY}`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedGlobalConfig();
