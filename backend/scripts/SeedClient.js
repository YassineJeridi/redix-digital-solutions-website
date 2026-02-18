import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../models/Client.js';

dotenv.config();

const firstNames = [
    'Ahmed', 'Mohamed', 'Ali', 'Youssef', 'Omar', 'Karim', 'Hamza', 'Sami', 'Rami', 'Nabil',
    'Sarah', 'Leila', 'Amira', 'Nour', 'Yasmine', 'Salma', 'Marwa', 'Hana', 'Dalia', 'Maya'
];

const lastNames = [
    'Ben Ali', 'Trabelsi', 'Bouazizi', 'Nasri', 'Mahmoud', 'Khalil', 'Mansour', 'Hamdi', 'Sassi', 'Jebali',
    'Maalej', 'Cherif', 'Hamrouni', 'Karoui', 'Mejri', 'Dridi', 'Lahmar', 'Oueslati', 'Tlili', 'Zaidi'
];

const businessTypes = [
    'Restaurant', 'Café', 'Boutique', 'Pharmacy', 'Gym', 'Salon', 'Clinic', 'Store', 'Agency', 'Studio',
    'Market', 'Shop', 'Center', 'Gallery', 'Office', 'Lab', 'Workshop', 'Hub', 'Space', 'Place'
];

const businessNames = [
    'Elite', 'Premium', 'Modern', 'Classic', 'Urban', 'Royal', 'Golden', 'Silver', 'Diamond', 'Pearl',
    'Star', 'Moon', 'Sun', 'Blue', 'Green', 'Red', 'White', 'Black', 'Pink', 'Orange'
];

const tunisianCities = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Monastir', 'La Marsa', 'Hammamet',
    'Nabeul', 'Ben Arous', 'Kasserine', 'Gafsa', 'Mahdia', 'Béja', 'Jendouba', 'Siliana', 'Tozeur', 'Medenine'
];

const streets = [
    'Avenue Habib Bourguiba', 'Rue de la République', 'Avenue de la Liberté', 'Rue du Lac', 'Avenue Mohamed V',
    'Rue de Marseille', 'Avenue de Carthage', 'Rue Ibn Khaldoun', 'Avenue Farhat Hached', 'Rue de Palestine'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber() {
    const prefixes = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
    const prefix = getRandomElement(prefixes);
    const number = Math.floor(Math.random() * 900000) + 100000;
    return `+216 ${prefix} ${number}`;
}

function generateEmail(name, business) {
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const cleanBusiness = business.toLowerCase().replace(/\s+/g, '');
    return `${cleanName}@${cleanBusiness}.${getRandomElement(domains)}`;
}

function generateNotes() {
    const notes = [
        'Excellent client, always pays on time',
        'Prefers communication via WhatsApp',
        'Interested in long-term collaboration',
        'VIP client - priority service',
        'Recurring monthly campaigns',
        'Requires invoices with detailed breakdown',
        'Referral from previous client',
        'Tech-savvy, loves innovative solutions',
        'Budget-conscious but quality-focused',
        'Fast decision maker',
        'Needs approval from management team',
        'Seasonal campaigns only',
        'Looking for package deals',
        'Very responsive to emails',
        '',
        '',
        ''
    ];
    return getRandomElement(notes);
}

const seedClients = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding clients...');

        // Clear existing clients
        await Client.deleteMany({});
        console.log('🗑️  Cleared existing clients');

        const clients = [];

        for (let i = 0; i < 50; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const businessType = getRandomElement(businessTypes);
            const businessName = `${getRandomElement(businessNames)} ${businessType}`;
            const ownerName = `${firstName} ${lastName}`;

            const client = {
                businessName: businessName,
                ownerName: ownerName,
                email: generateEmail(ownerName, businessName),
                phone: generatePhoneNumber(),
                address: `${Math.floor(Math.random() * 200) + 1} ${getRandomElement(streets)}, ${getRandomElement(tunisianCities)}, Tunisia`,
                profileImage: '',
                notes: generateNotes()
            };

            clients.push(client);
        }

        await Client.insertMany(clients);
        console.log('✅ Successfully seeded 50 clients');

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding clients:', error);
        process.exit(1);
    }
};

seedClients();
