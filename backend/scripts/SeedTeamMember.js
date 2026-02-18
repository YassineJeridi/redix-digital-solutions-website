import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TeamMember from '../models/TeamMember.js';

dotenv.config();

const firstNames = [
    'Ahmed', 'Mohamed', 'Ali', 'Youssef', 'Omar', 'Karim', 'Hamza', 'Sami', 'Rami', 'Nabil',
    'Sarah', 'Leila', 'Amira', 'Nour', 'Yasmine', 'Salma', 'Marwa', 'Hana', 'Dalia', 'Maya',
    'Mehdi', 'Fares', 'Zied', 'Seif', 'Ayoub', 'Ines', 'Rahma', 'Meriem', 'Olfa', 'Sonia'
];

const lastNames = [
    'Ben Ali', 'Trabelsi', 'Bouazizi', 'Nasri', 'Mahmoud', 'Khalil', 'Mansour', 'Hamdi', 'Sassi', 'Jebali',
    'Maalej', 'Cherif', 'Hamrouni', 'Karoui', 'Mejri', 'Dridi', 'Lahmar', 'Oueslati', 'Tlili', 'Zaidi'
];

const roles = [
    'Video Editor',
    'Graphic Designer',
    'Social Media Manager',
    'Content Creator',
    'Copywriter',
    'Photographer',
    'Motion Designer',
    'UI/UX Designer',
    'Web Developer',
    'Marketing Specialist',
    '3D Artist',
    'Illustrator',
    'Animation Specialist',
    'SEO Specialist',
    'Community Manager'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateEmail(name) {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com'];
    return `${cleanName}@${getRandomElement(domains)}`;
}

function getRandomStatus() {
    const statuses = ['active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'suspended'];
    return getRandomElement(statuses);
}

function generateTransactions() {
    const transactionCount = Math.floor(Math.random() * 10);
    const transactions = [];

    for (let i = 0; i < transactionCount; i++) {
        const type = getRandomElement(['earning', 'payment', 'advance', 'deduction']);
        const amount = (Math.random() * 500 + 50).toFixed(2);
        const daysAgo = Math.floor(Math.random() * 180);

        transactions.push({
            type,
            amount: parseFloat(amount),
            description: type === 'earning' ? 'Project earning' :
                type === 'payment' ? 'Payment received' :
                    type === 'advance' ? 'Advance payment' : 'Deduction',
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
    }

    return transactions;
}

const seedTeamMembers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding team members...');

        // Clear existing team members
        await TeamMember.deleteMany({});
        console.log('🗑️  Cleared existing team members');

        const members = [];

        for (let i = 0; i < 50; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const name = `${firstName} ${lastName}`;
            const totalEarned = parseFloat((Math.random() * 5000 + 500).toFixed(2));
            const totalReceived = parseFloat((Math.random() * totalEarned).toFixed(2));

            const member = {
                name: name,
                role: getRandomElement(roles),
                email: generateEmail(name),
                profileImage: '',
                totalEarned: totalEarned,
                totalReceived: totalReceived,
                balance: parseFloat((totalEarned - totalReceived).toFixed(2)),
                transactions: generateTransactions(),
                sharePercentage: 100,
                status: getRandomStatus()
            };

            members.push(member);
        }

        await TeamMember.insertMany(members);
        console.log('✅ Successfully seeded 50 team members');

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding team members:', error);
        process.exit(1);
    }
};

seedTeamMembers();
