import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FinancialMetrics from '../models/FinancialMetrics.js';

dotenv.config();

const seedFinancialMetrics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding financial metrics...');

        // Clear existing metrics
        await FinancialMetrics.deleteMany({});
        console.log('🗑️  Cleared existing financial metrics');

        // Create initial financial metrics
        const metrics = new FinancialMetrics({
            totalRevenue: 15000,
            totalExpenses: 5000,
            netProfit: 10000,
            toolsReserve: 5000,
            teamShare: 3000,
            redixCaisse: 2000,
            investmentReserve: 0
        });

        await metrics.save();
        console.log('✅ Successfully created initial financial metrics');

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding financial metrics:', error);
        process.exit(1);
    }
};

seedFinancialMetrics();
