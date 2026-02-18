import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Client from '../models/Client.js';
import TeamMember from '../models/TeamMember.js';
import Tool from '../models/Tool.js';
import Charge from '../models/Charge.js';
import Expense from '../models/Expense.js';
import Project from '../models/Project.js';
import MarketingProject from '../models/MarketingProject.js';
import FinancialMetrics from '../models/FinancialMetrics.js';
import Notification from '../models/Notification.js';

dotenv.config();

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const pastDate = (daysBack) => {
    const d = new Date();
    d.setDate(d.getDate() - rand(0, daysBack));
    return d;
};
const futureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + rand(1, daysAhead));
    return d;
};

// ═══════════════════════════════════════════════════════
// DATA POOLS
// ═══════════════════════════════════════════════════════
const firstNames = ['Ahmed', 'Mohamed', 'Ali', 'Youssef', 'Omar', 'Karim', 'Hamza', 'Sami', 'Rami', 'Nabil',
    'Sarah', 'Leila', 'Amira', 'Nour', 'Yasmine', 'Salma', 'Marwa', 'Hana', 'Dalia', 'Maya',
    'Fares', 'Amine', 'Bilel', 'Zied', 'Mehdi', 'Anis', 'Sofiane', 'Wael', 'Chaker', 'Slim'];

const lastNames = ['Ben Ali', 'Trabelsi', 'Bouazizi', 'Nasri', 'Mahmoud', 'Khalil', 'Mansour', 'Hamdi', 'Sassi', 'Jebali',
    'Maalej', 'Cherif', 'Hamrouni', 'Karoui', 'Mejri', 'Dridi', 'Lahmar', 'Oueslati', 'Tlili', 'Zaidi'];

const businessAdj = ['Elite', 'Premium', 'Modern', 'Classic', 'Urban', 'Royal', 'Golden', 'Digital', 'Creative', 'Innovative',
    'Smart', 'Bright', 'Fresh', 'Bold', 'Prime', 'Swift', 'Apex', 'Nova', 'Neo', 'Zen'];

const businessTypes = ['Restaurant', 'Café', 'Boutique', 'Pharmacy', 'Gym', 'Salon', 'Clinic', 'Store', 'Agency', 'Studio',
    'Market', 'Shop', 'Center', 'Gallery', 'Office', 'Lab', 'Workshop', 'Hub', 'Space', 'Place'];

const cities = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Monastir', 'La Marsa', 'Hammamet',
    'Nabeul', 'Ben Arous', 'Kasserine', 'Gafsa', 'Mahdia', 'Béja', 'Jendouba', 'Tozeur', 'Medenine', 'Sidi Bouzid'];

const streets = ['Avenue Habib Bourguiba', 'Rue de la République', 'Avenue de la Liberté', 'Rue du Lac', 'Avenue Mohamed V',
    'Rue de Marseille', 'Avenue de Carthage', 'Rue Ibn Khaldoun', 'Avenue Farhat Hached', 'Rue de Palestine'];

const projectNames = [
    'Social Media Campaign', 'Brand Awareness Push', 'Digital Marketing Strategy', 'Content Creation Sprint',
    'Instagram Growth Campaign', 'TikTok Launch', 'Facebook Ads Optimization', 'LinkedIn B2B Campaign',
    'SEO Overhaul', 'Website Redesign', 'E-Commerce Platform', 'Mobile App Development',
    'Corporate Video Production', 'Product Photography', 'Brand Identity Design', 'UI/UX Redesign',
    'Email Marketing Automation', 'Influencer Partnership', 'Event Coverage', 'Annual Report Design',
    'Landing Page Development', 'CRM Integration', 'Analytics Dashboard', 'Portfolio Website',
    'Blog Content Strategy', 'Podcast Production', 'YouTube Channel Launch', 'PPC Campaign Management'
];

const toolNames = [
    { name: 'Canon EOS R5', cat: 'Camera', price: 12000, subs: [{ name: 'RF 24-70mm f/2.8L', cat: 'Lens', price: 7000 }, { name: 'RF 50mm f/1.2L', cat: 'Lens', price: 6500 }] },
    { name: 'Sony A7 IV', cat: 'Camera', price: 8500, subs: [{ name: 'FE 85mm f/1.4 GM', cat: 'Lens', price: 5500 }] },
    { name: 'DJI Ronin RS3 Pro', cat: 'Stabilizer', price: 2500, subs: [] },
    { name: 'MacBook Pro M3 Max', cat: 'Computer', price: 11000, subs: [] },
    { name: 'iMac 27" Studio', cat: 'Computer', price: 9500, subs: [] },
    { name: 'Adobe Creative Cloud', cat: 'Software', price: 2000, subs: [{ name: 'Premiere Pro', cat: 'Software', price: 0 }, { name: 'After Effects', cat: 'Software', price: 0 }, { name: 'Photoshop', cat: 'Software', price: 0 }] },
    { name: 'Figma Enterprise', cat: 'Software', price: 500, subs: [] },
    { name: 'DJI Mavic 3 Pro', cat: 'Drone', price: 6800, subs: [{ name: 'Extra Batteries Kit', cat: 'Accessory', price: 800 }] },
    { name: 'Godox AD600 Pro', cat: 'Lighting', price: 3200, subs: [{ name: 'Softbox 120cm', cat: 'Accessory', price: 400 }, { name: 'Beauty Dish', cat: 'Accessory', price: 350 }] },
    { name: 'Rode Wireless GO II', cat: 'Audio', price: 1000, subs: [] },
    { name: 'Aputure 600d Pro', cat: 'Lighting', price: 5500, subs: [] },
    { name: 'Samsung T7 Shield 4TB', cat: 'Storage', price: 800, subs: [] },
    { name: 'Meta Ads Manager Pro', cat: 'Software', price: 0, subs: [] },
    { name: 'Google Workspace Business', cat: 'Software', price: 400, subs: [] },
    { name: 'Canva Pro Team', cat: 'Software', price: 350, subs: [] }
];

const teamRoles = ['Videographer', 'Photographer', 'Graphic Designer', 'Social Media Manager', 'Web Developer',
    'Project Manager', 'Content Creator', 'Motion Designer', 'Copywriter', 'Marketing Strategist'];

const chargeCategories = ['Internet', 'Transport', 'Utilities', 'Rent', 'Supplies', 'Equipment', 'Marketing', 'Other'];

const expenseCategories = ['Tools', 'Salaries', 'Office', 'Marketing', 'Utilities', 'Other'];

const chargeNames = {
    'Internet': ['Fiber Internet - Office', 'Mobile Data Plan', '4G Business Plan', 'Backup Internet Line'],
    'Transport': ['Uber for Shooting', 'Gas for Equipment Transport', 'Taxi for Meeting', 'Delivery Service', 'Vehicle Rental'],
    'Utilities': ['Electricity Bill', 'Water Bill', 'Office Cleaning', 'AC Maintenance'],
    'Rent': ['Office Rent', 'Studio Rent', 'Co-working Space', 'Storage Unit'],
    'Supplies': ['Printing Paper', 'Ink Cartridges', 'SD Cards', 'USB Drives', 'Cable Set'],
    'Equipment': ['Tripod Replacement', 'Camera Bag', 'Memory Cards', 'Microphone Stand', 'Light Stand'],
    'Marketing': ['Google Ads Credit', 'Facebook Ads Budget', 'Business Cards', 'Flyers Printing'],
    'Other': ['Client Lunch', 'Team Dinner', 'Coffee Supplies', 'Snacks for Office', 'Software License']
};

const expenseDescriptions = {
    'Tools': ['Camera Lens Repair', 'Drone Calibration', 'Software License Renewal', 'External SSD Purchase', 'Tripod Upgrade'],
    'Salaries': ['Monthly Salary - Videographer', 'Freelancer Payment', 'Bonus - Project Completion', 'Overtime Payment'],
    'Office': ['Office Supplies', 'Furniture Purchase', 'Desk Lamp', 'Whiteboard Markers', 'Wall Calendar'],
    'Marketing': ['Online Ads Budget', 'Promotional Materials', 'Event Sponsorship', 'Social Media Ads'],
    'Utilities': ['Internet Bill', 'Phone Bill', 'Electricity', 'Water Service'],
    'Other': ['Team Building Event', 'Client Gift', 'Conference Registration', 'Training Course']
};

// ═══════════════════════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════════════════════

async function seedUsers() {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);

    const users = [
        { name: 'Admin User', email: 'admin@redix.agency', password: await bcrypt.hash('admin123', salt), role: 'admin' },
        { name: 'Manager User', email: 'manager@redix.agency', password: await bcrypt.hash('manager123', salt), role: 'manager' },
        { name: 'Team Member', email: 'member@redix.agency', password: await bcrypt.hash('member123', salt), role: 'member' },
    ];

    const created = await User.insertMany(users);
    console.log(`   ✅ Seeded ${created.length} users`);
    return created;
}

async function seedClients() {
    await Client.deleteMany({});
    const clients = [];

    for (let i = 0; i < 40; i++) {
        const fn = pick(firstNames);
        const ln = pick(lastNames);
        const bt = pick(businessTypes);
        const bn = `${pick(businessAdj)} ${bt}`;
        const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
        const prefixes = ['20','21','22','23','24','25','26','27','50','51','52','53','54','55','58','59'];

        clients.push({
            businessName: bn,
            ownerName: `${fn} ${ln}`,
            email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/\s/g, '')}@${pick(domains)}`,
            phone: `+216 ${pick(prefixes)} ${rand(100000, 999999)}`,
            address: `${rand(1, 200)} ${pick(streets)}, ${pick(cities)}, Tunisia`,
            notes: pick([
                'Excellent client, always pays on time',
                'Prefers WhatsApp communication',
                'VIP client - priority service',
                'Interested in long-term partnership',
                'Recurring monthly campaigns',
                'Budget-conscious but quality-focused',
                'Tech-savvy, loves innovative solutions',
                'Quick decision maker',
                'Referred by previous client',
                ''
            ])
        });
    }

    const created = await Client.insertMany(clients);
    console.log(`   ✅ Seeded ${created.length} clients`);
    return created;
}

async function seedTeamMembers() {
    await TeamMember.deleteMany({});
    const members = [];

    const memberData = [
        { name: 'Amine Ben Salah', role: 'Videographer', email: 'amine@redix.agency', share: 100 },
        { name: 'Leila Trabelsi', role: 'Photographer', email: 'leila@redix.agency', share: 100 },
        { name: 'Karim Nasri', role: 'Graphic Designer', email: 'karim@redix.agency', share: 100 },
        { name: 'Nour Hamdi', role: 'Social Media Manager', email: 'nour@redix.agency', share: 100 },
        { name: 'Youssef Khalil', role: 'Web Developer', email: 'youssef@redix.agency', share: 100 },
        { name: 'Sarah Mansour', role: 'Project Manager', email: 'sarah@redix.agency', share: 100 },
        { name: 'Omar Bouazizi', role: 'Content Creator', email: 'omar@redix.agency', share: 100 },
        { name: 'Maya Jebali', role: 'Motion Designer', email: 'maya@redix.agency', share: 100 },
        { name: 'Fares Mejri', role: 'Copywriter', email: 'fares@redix.agency', share: 80 },
        { name: 'Dalia Cherif', role: 'Marketing Strategist', email: 'dalia@redix.agency', share: 90 },
    ];

    for (const m of memberData) {
        const earned = rand(5000, 50000);
        const received = rand(2000, earned);
        members.push({
            name: m.name,
            role: m.role,
            email: m.email,
            sharePercentage: m.share,
            status: 'active',
            totalEarned: earned,
            totalReceived: received,
            balance: earned - received,
            transactions: [
                { type: 'earning', amount: earned * 0.4, description: 'Q4 2025 Projects', date: pastDate(120) },
                { type: 'earning', amount: earned * 0.6, description: 'Q1 2026 Projects', date: pastDate(30) },
                { type: 'payment', amount: received * 0.5, description: 'Monthly salary payment', date: pastDate(60) },
                { type: 'payment', amount: received * 0.5, description: 'Monthly salary payment', date: pastDate(15) },
            ]
        });
    }

    const created = await TeamMember.insertMany(members);
    console.log(`   ✅ Seeded ${created.length} team members`);
    return created;
}

async function seedTools() {
    await Tool.deleteMany({});
    const tools = [];

    for (const t of toolNames) {
        const revenue = rand(0, t.price * 2);
        tools.push({
            name: t.name,
            purchasePrice: t.price,
            revenueCounter: revenue,
            category: t.cat,
            status: pick(['active', 'active', 'active', 'maintenance']),
            payoffPercentage: t.price > 0 ? Math.min((revenue / t.price) * 100, 100) : 100,
            usageCount: rand(2, 80),
            lastUsed: pastDate(30),
            subTools: t.subs.map(s => ({
                name: s.name,
                category: s.cat,
                purchasePrice: s.price,
                status: 'active'
            }))
        });
    }

    const created = await Tool.insertMany(tools);
    console.log(`   ✅ Seeded ${created.length} tools`);
    return created;
}

async function seedCharges() {
    await Charge.deleteMany({});
    const charges = [];

    for (let i = 0; i < 60; i++) {
        const cat = pick(chargeCategories);
        const name = pick(chargeNames[cat]);
        charges.push({
            name,
            amount: cat === 'Rent' ? rand(1500, 5000) : rand(20, 800),
            category: cat,
            description: `${name} - ${pick(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])} charge`,
            frequency: pick(['one-time', 'monthly', 'monthly', 'weekly', 'yearly']),
            date: pastDate(180),
            status: pick(['paid', 'paid', 'paid', 'pending'])
        });
    }

    const created = await Charge.insertMany(charges);
    console.log(`   ✅ Seeded ${created.length} charges`);
    return created;
}

async function seedExpenses(teamMembers) {
    await Expense.deleteMany({});
    const expenses = [];

    for (let i = 0; i < 50; i++) {
        const cat = pick(expenseCategories);
        expenses.push({
            description: pick(expenseDescriptions[cat]),
            amount: cat === 'Salaries' ? rand(2000, 8000) : rand(50, 2000),
            category: cat,
            date: pastDate(180),
            createdBy: pick(teamMembers)._id
        });
    }

    const created = await Expense.insertMany(expenses);
    console.log(`   ✅ Seeded ${created.length} expenses`);
    return created;
}

async function seedProjects(clients, teamMembers, tools) {
    await Project.deleteMany({});
    const projects = [];
    const services = ['Marketing', 'Production', 'Development'];
    const activeTools = tools.filter(t => t.status === 'active');

    for (let i = 0; i < 25; i++) {
        const service = pick(services);
        const price = rand(3000, 50000);
        const start = pastDate(180);
        const end = new Date(start);
        end.setDate(end.getDate() + rand(14, 120));

        // Revenue distribution must total 100
        const toolsAndCharges = rand(10, 40);
        const teamShare = rand(30, 70 - toolsAndCharges);
        const redixCaisse = 100 - toolsAndCharges - teamShare;

        // Pick 1-3 tools for usage
        const numTools = Math.min(rand(1, 3), activeTools.length);
        const shuffledTools = [...activeTools].sort(() => Math.random() - 0.5).slice(0, numTools);
        const toolsUsage = [];
        let remaining = 100;
        shuffledTools.forEach((t, idx) => {
            const pct = idx === shuffledTools.length - 1 ? remaining : rand(20, remaining - (shuffledTools.length - idx - 1) * 10);
            toolsUsage.push({ tool: t._id, percentage: pct });
            remaining -= pct;
        });

        // Pick 1-3 team members
        const numMembers = Math.min(rand(1, 3), teamMembers.length);
        const shuffledMembers = [...teamMembers].sort(() => Math.random() - 0.5).slice(0, numMembers);

        const project = {
            projectName: `${pick(projectNames)} - ${pick(['Q1', 'Q2', 'Q3', 'Q4'])} 2026`,
            client: pick(clients)._id,
            startDate: start,
            endDate: end,
            paymentStatus: pick(['Pending', 'Done', 'Done']),
            projectStatus: pick(['Not Started', 'In Progress', 'In Progress', 'Completed']),
            totalPrice: price,
            serviceProvided: service,
            revenueDistribution: { toolsAndCharges, teamShare, redixCaisse },
            toolsUsage,
            teamMembers: shuffledMembers.map(m => m._id),
            createdBy: teamMembers[0]._id,
            lastModifiedBy: pick(teamMembers)._id
        };

        // Service-specific fields
        if (service === 'Marketing') {
            project.marketing = { videosCount: rand(2, 30), postsCount: rand(10, 80), shootingSessionsCount: rand(1, 12) };
        } else if (service === 'Production') {
            project.production = { videosCount: rand(1, 15), picturesCount: rand(20, 500), shootingSessionsCount: rand(1, 8) };
        } else {
            project.development = {
                description: pick([
                    'Full-stack web application with modern UI/UX',
                    'E-commerce platform with payment integration',
                    'Mobile-first responsive landing page',
                    'CRM dashboard with analytics',
                    'Portfolio website with CMS',
                    'Restaurant ordering system',
                    'Booking and reservation platform',
                    'Real estate listing website'
                ]),
                platform: pick(['Web', 'Mobile']),
                typeComplexity: pick(['Vitrine', 'Advanced'])
            };
        }

        projects.push(project);
    }

    const created = await Project.insertMany(projects);
    console.log(`   ✅ Seeded ${created.length} projects`);
    return created;
}

async function seedMarketingProjects(clients, teamMembers, tools) {
    await MarketingProject.deleteMany({});
    const mProjects = [];
    const activeTools = tools.filter(t => t.status === 'active');

    const campaignNames = [
        'Summer Vibes Campaign', 'Ramadan Special', 'Back to School Push', 'Holiday Season Blast',
        'New Year Launch', 'Valentine\'s Day Special', 'Spring Collection', 'Black Friday Campaign',
        'Product Launch Week', 'Brand Refresh Campaign', 'Customer Appreciation Month', 'Anniversary Sale',
        'Flash Sale Weekend', 'Influencer Collab Series', 'Community Engagement Drive'
    ];

    const serviceNames = ['Video Production', 'Photography', 'Social Media Posts', 'Story Design', 'Reel Creation',
        'Ad Design', 'Content Writing', 'Hashtag Strategy', 'Community Management', 'Analytics Report'];

    for (let i = 0; i < 15; i++) {
        const budget = rand(3000, 25000);
        const numServices = rand(2, 5);
        const servicesArr = [];
        for (let s = 0; s < numServices; s++) {
            const qty = rand(1, 20);
            const amt = rand(100, 2000);
            servicesArr.push({
                name: pick(serviceNames),
                amount: amt,
                quantity: qty,
                total: amt * qty
            });
        }

        // Tools usage
        const numTools = Math.min(rand(1, 3), activeTools.length);
        const shuffledTools = [...activeTools].sort(() => Math.random() - 0.5).slice(0, numTools);
        const toolsUsage = [];
        let tRemain = 100;
        shuffledTools.forEach((t, idx) => {
            const pct = idx === shuffledTools.length - 1 ? tRemain : rand(20, tRemain - (shuffledTools.length - idx - 1) * 10);
            toolsUsage.push({ tool: t._id, usagePercentage: pct, allocatedRevenue: 0 });
            tRemain -= pct;
        });

        // Team assignment
        const numMems = Math.min(rand(1, 4), teamMembers.length);
        const shuffledMems = [...teamMembers].sort(() => Math.random() - 0.5).slice(0, numMems);
        const teamAssignment = [];
        let mRemain = 100;
        shuffledMems.forEach((m, idx) => {
            const pct = idx === shuffledMems.length - 1 ? mRemain : rand(15, mRemain - (shuffledMems.length - idx - 1) * 10);
            teamAssignment.push({ member: m._id, contributionPercentage: pct, allocatedRevenue: 0 });
            mRemain -= pct;
        });

        const toolsShare = rand(30, 50);
        const teamSharePct = rand(20, 50);
        const caisseShare = 100 - toolsShare - teamSharePct;

        mProjects.push({
            campaignName: campaignNames[i] || `Campaign ${i + 1}`,
            client: pick(clients)._id,
            projectDate: pastDate(120),
            services: servicesArr,
            totalBudget: budget,
            toolsUsage,
            teamAssignment,
            revenueDistribution: {
                toolsShare,
                teamShare: teamSharePct,
                caisseShare,
                toolsAmount: (budget * toolsShare) / 100,
                teamAmount: (budget * teamSharePct) / 100,
                caisseAmount: (budget * caisseShare) / 100
            },
            status: pick(['pending', 'active', 'active', 'completed', 'completed']),
            revenueDistributed: pick([true, false])
        });
    }

    const created = await MarketingProject.insertMany(mProjects);
    console.log(`   ✅ Seeded ${created.length} marketing projects`);
    return created;
}

async function seedFinancialMetrics() {
    await FinancialMetrics.deleteMany({});
    const metrics = await FinancialMetrics.create({
        toolsReserve: rand(10000, 30000),
        teamShare: rand(20000, 60000),
        investmentReserve: rand(5000, 25000),
        redixCaisse: rand(15000, 50000),
        totalRevenue: rand(100000, 300000),
        totalExpenses: rand(40000, 120000),
        netProfit: rand(30000, 180000),
        lastUpdated: new Date()
    });
    console.log(`   ✅ Seeded financial metrics`);
    return metrics;
}

async function seedNotifications(teamMembers, projects) {
    await Notification.deleteMany({});
    const notifications = [];
    const types = ['payment_status_change', 'project_status_change', 'team_assignment', 'deadline_reminder', 'project_overdue'];

    const titles = {
        'payment_status_change': ['Payment Received', 'Payment Pending', 'Invoice Overdue'],
        'project_status_change': ['Project Started', 'Project Completed', 'Project On Hold'],
        'team_assignment': ['New Project Assignment', 'Role Updated', 'Team Change'],
        'deadline_reminder': ['Deadline Approaching', 'Due Tomorrow', 'Overdue Reminder'],
        'project_overdue': ['Project Overdue', 'Missed Deadline', 'Urgent: Overdue']
    };

    const messages = {
        'payment_status_change': ['Payment for project has been marked as completed.', 'Pending payment reminder sent to client.', 'Invoice is now overdue - follow up required.'],
        'project_status_change': ['The project has been moved to In Progress.', 'Project has been completed successfully!', 'Project has been temporarily put on hold.'],
        'team_assignment': ['You have been assigned to a new project.', 'Your role in the project has been updated.', 'Team structure has been modified.'],
        'deadline_reminder': ['Project deadline is in 3 days.', 'Project is due tomorrow - ensure completion.', 'Friendly reminder: deadline approaching.'],
        'project_overdue': ['Project has passed its deadline.', 'The project deadline was missed.', 'Urgent: Project is significantly overdue.']
    };

    for (let i = 0; i < 30; i++) {
        const type = pick(types);
        notifications.push({
            type,
            title: pick(titles[type]),
            message: pick(messages[type]),
            recipient: pick(teamMembers)._id,
            project: projects.length > 0 ? pick(projects)._id : undefined,
            isRead: pick([true, true, false, false, false]),
            priority: pick(['low', 'medium', 'medium', 'high']),
        });
    }

    const created = await Notification.insertMany(notifications);
    console.log(`   ✅ Seeded ${created.length} notifications`);
    return created;
}

// ═══════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════
const seedAll = async () => {
    try {
        console.log('\n🌱 ═══════════════════════════════════════════════');
        console.log('   COMPREHENSIVE DATABASE SEEDER');
        console.log('   ═══════════════════════════════════════════════\n');

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected\n');

        console.log('🔄 Seeding data...\n');

        // 1. Users (for auth)
        console.log('👤 Users:');
        const users = await seedUsers();

        // 2. Clients
        console.log('🏢 Clients:');
        const clients = await seedClients();

        // 3. Team Members
        console.log('👥 Team Members:');
        const teamMembers = await seedTeamMembers();

        // 4. Tools
        console.log('🔧 Tools:');
        const tools = await seedTools();

        // 5. Charges
        console.log('💳 Charges:');
        const charges = await seedCharges();

        // 6. Expenses
        console.log('💰 Expenses:');
        const expenses = await seedExpenses(teamMembers);

        // 7. Projects
        console.log('📁 Projects:');
        const projects = await seedProjects(clients, teamMembers, tools);

        // 8. Marketing Projects
        console.log('📣 Marketing Projects:');
        const mProjects = await seedMarketingProjects(clients, teamMembers, tools);

        // 9. Financial Metrics
        console.log('📊 Financial Metrics:');
        const metrics = await seedFinancialMetrics();

        // 10. Notifications
        console.log('🔔 Notifications:');
        await seedNotifications(teamMembers, projects);

        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════');
        console.log('\n📋 Summary:');
        console.log(`   • ${users.length} Users (login accounts)`);
        console.log(`   • ${clients.length} Clients`);
        console.log(`   • ${teamMembers.length} Team Members`);
        console.log(`   • ${tools.length} Tools`);
        console.log(`   • ${charges.length} Charges`);
        console.log(`   • ${expenses.length} Expenses`);
        console.log(`   • ${projects.length} Projects`);
        console.log(`   • ${mProjects.length} Marketing Projects`);
        console.log(`   • 1 Financial Metrics record`);
        console.log(`   • 30 Notifications`);
        console.log('\n🔐 Login Credentials:');
        console.log('   Admin:   admin@redix.agency   / admin123');
        console.log('   Manager: manager@redix.agency / manager123');
        console.log('   Member:  member@redix.agency  / member123\n');

        await mongoose.connection.close();
        console.log('🔌 Database connection closed\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAll();
