import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Charge from '../models/Charge.js';

dotenv.config();

// EXACT categories from your Charge model
const categories = [
    'Internet',
    'Transport',
    'Utilities',
    'Rent',
    'Supplies',
    'Equipment',
    'Marketing',
    'Other'
];

const chargeNames = {
    'Internet': ['Fiber Internet', 'Mobile Data Plan', 'Wi-Fi Subscription', 'Topnet Monthly Fee', '4G Package'],
    'Transport': ['Fuel Expenses', 'Taxi Fare', 'Louage', 'Parking Fee', 'Vehicle Maintenance'],
    'Utilities': ['Electricity Bill', 'Water Bill', 'Gas Bill', 'STEG Payment', 'SONEDE Payment'],
    'Rent': ['Office Rent', 'Studio Rent', 'Co-working Space', 'Storage Space', 'Equipment Rental'],
    'Supplies': ['Office Supplies', 'Printer Paper', 'Pens and Notebooks', 'Coffee Supplies', 'Cleaning Materials'],
    'Equipment': ['Camera Equipment', 'Lens Purchase', 'Tripod', 'Lighting Equipment', 'Microphone'],
    'Marketing': ['Google Ads', 'Facebook Ads', 'Instagram Promotion', 'Flyer Printing', 'TikTok Ads'],
    'Other': ['Team Lunch', 'Client Gift', 'Office Decoration', 'Emergency Expense', 'Business License']
};

const descriptions = {
    'Internet': 'Internet and connectivity services',
    'Transport': 'Transportation and travel expenses',
    'Utilities': 'Utility services payment',
    'Rent': 'Rental payment',
    'Supplies': 'Office supplies and materials',
    'Equipment': 'Equipment purchase or maintenance',
    'Marketing': 'Marketing and advertising expense',
    'Other': 'Miscellaneous business expense'
};

const frequencies = ['one-time', 'monthly', 'yearly'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(category) {
    const ranges = {
        'Internet': [30, 100],
        'Transport': [20, 200],
        'Utilities': [50, 250],
        'Rent': [800, 2000],
        'Supplies': [10, 150],
        'Equipment': [200, 3000],
        'Marketing': [100, 1000],
        'Other': [10, 300]
    };

    const [min, max] = ranges[category];
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomDate() {
    const daysAgo = Math.floor(Math.random() * 365);
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

function getRandomStatus() {
    const statuses = ['pending', 'paid', 'paid', 'paid', 'paid', 'cancelled'];
    return getRandomElement(statuses);
}

const seedCharges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding charges...');

        await Charge.deleteMany({});
        console.log('🗑️  Cleared existing charges');

        const charges = [];

        for (let i = 0; i < 50; i++) {
            const category = getRandomElement(categories);
            const name = getRandomElement(chargeNames[category]);
            const amount = getRandomAmount(category);
            const frequency = getRandomElement(frequencies);
            const dueDate = getRandomDate();

            const charge = {
                name: name,
                description: descriptions[category],
                amount: amount,
                category: category,
                frequency: frequency,
                dueDate: dueDate,
                status: getRandomStatus()
            };

            charges.push(charge);
        }

        await Charge.insertMany(charges);
        console.log('✅ Successfully seeded 50 charges');

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding charges:', error);
        process.exit(1);
    }
};

seedCharges();
