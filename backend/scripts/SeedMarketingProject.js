import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MarketingProject from '../models/MarketingProject.js';
import Client from '../models/Client.js';
import Tool from '../models/Tool.js';
import TeamMember from '../models/TeamMember.js';

dotenv.config();

const campaignNames = [
    'Summer Sale Campaign',
    'Product Launch 2024',
    'Brand Awareness Drive',
    'Holiday Special Promo',
    'Social Media Boost',
    'Grand Opening Event',
    'Seasonal Collection',
    'Customer Loyalty Program',
    'New Year Campaign',
    'Spring Festival Promo',
    'Back to School Drive',
    'Black Friday Special',
    'Anniversary Celebration',
    'Flash Sale Campaign',
    'Influencer Collaboration',
    'Video Marketing Push',
    'Email Campaign Series',
    'Rebranding Initiative',
    'Product Demo Series',
    'Community Engagement'
];

const services = [
    { name: 'Shooting Session', minAmount: 200, maxAmount: 500 },
    { name: 'Video Editing', minAmount: 150, maxAmount: 400 },
    { name: 'Ads Management', minAmount: 300, maxAmount: 800 },
    { name: 'Copywriting', minAmount: 100, maxAmount: 300 },
    { name: 'Social Media Management', minAmount: 250, maxAmount: 600 },
    { name: 'Graphic Design', minAmount: 100, maxAmount: 400 },
    { name: 'Photography', minAmount: 150, maxAmount: 500 },
    { name: 'Motion Graphics', minAmount: 200, maxAmount: 600 }
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomDate() {
    const daysAgo = Math.floor(Math.random() * 365);
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

function getRandomStatus() {
    const statuses = ['pending', 'active', 'active', 'completed', 'completed', 'completed'];
    return getRandomElement(statuses);
}

function generateServices() {
    const serviceCount = Math.floor(Math.random() * 3) + 2; // 2-4 services
    const selectedServices = getRandomElements(services, serviceCount);

    return selectedServices.map(service => {
        const amount = parseFloat((Math.random() * (service.maxAmount - service.minAmount) + service.minAmount).toFixed(2));
        const quantity = Math.floor(Math.random() * 3) + 1;

        return {
            name: service.name,
            amount: amount,
            quantity: quantity,
            total: parseFloat((amount * quantity).toFixed(2))
        };
    });
}

function generateToolsUsage(tools) {
    const toolCount = Math.min(Math.floor(Math.random() * 3) + 2, tools.length); // 2-4 tools
    const selectedTools = getRandomElements(tools, toolCount);

    let remainingPercentage = 100;
    const toolsUsage = selectedTools.map((tool, index) => {
        let percentage;
        if (index === selectedTools.length - 1) {
            percentage = remainingPercentage;
        } else {
            percentage = Math.floor(Math.random() * (remainingPercentage - (selectedTools.length - index - 1) * 10)) + 10;
            remainingPercentage -= percentage;
        }

        return {
            tool: tool._id,
            usagePercentage: percentage,
            allocatedRevenue: 0
        };
    });

    return toolsUsage;
}

function generateTeamAssignment(members) {
    const memberCount = Math.min(Math.floor(Math.random() * 3) + 2, members.length); // 2-4 members
    const selectedMembers = getRandomElements(members, memberCount);

    let remainingPercentage = 100;
    const teamAssignment = selectedMembers.map((member, index) => {
        let percentage;
        if (index === selectedMembers.length - 1) {
            percentage = remainingPercentage;
        } else {
            percentage = Math.floor(Math.random() * (remainingPercentage - (selectedMembers.length - index - 1) * 10)) + 10;
            remainingPercentage -= percentage;
        }

        return {
            member: member._id,
            contributionPercentage: percentage,
            allocatedRevenue: 0
        };
    });

    return teamAssignment;
}

const seedMarketingProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding marketing projects...');

        // Get all clients, tools, and team members
        const clients = await Client.find();
        const tools = await Tool.find();
        const members = await TeamMember.find();

        if (clients.length === 0 || tools.length === 0 || members.length === 0) {
            console.error('❌ Please seed Clients, Tools, and Team Members first!');
            process.exit(1);
        }

        // Clear existing projects
        await MarketingProject.deleteMany({});
        console.log('🗑️  Cleared existing marketing projects');

        const projects = [];

        for (let i = 0; i < 50; i++) {
            const projectServices = generateServices();
            const totalBudget = projectServices.reduce((sum, service) => sum + service.total, 0);

            const project = {
                campaignName: `${getRandomElement(campaignNames)} #${i + 1}`,
                client: getRandomElement(clients)._id,
                projectDate: getRandomDate(),
                services: projectServices,
                totalBudget: parseFloat(totalBudget.toFixed(2)),
                toolsUsage: generateToolsUsage(tools),
                teamAssignment: generateTeamAssignment(members),
                revenueDistribution: {
                    toolsShare: 50,
                    teamShare: 30,
                    caisseShare: 20,
                    toolsAmount: 0,
                    teamAmount: 0,
                    caisseAmount: 0
                },
                status: getRandomStatus(),
                revenueDistributed: false
            };

            projects.push(project);
        }

        await MarketingProject.insertMany(projects);
        console.log('✅ Successfully seeded 50 marketing projects');

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding marketing projects:', error);
        process.exit(1);
    }
};

seedMarketingProjects();
