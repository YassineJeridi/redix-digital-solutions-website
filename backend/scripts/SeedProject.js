import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import TeamMember from '../models/TeamMember.js';
import Tool from '../models/Tool.js';
import dotenv from 'dotenv';

dotenv.config();

const seedProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('✅ MongoDB connected');

        // Clear existing projects
        await Project.deleteMany({});
        console.log('🗑️  Cleared existing projects');

        // Fetch clients, team members, and tools
        const clients = await Client.find().limit(5);
        const teamMembers = await TeamMember.find().limit(5);
        const tools = await Tool.find({ status: 'active' }).limit(5);

        if (clients.length === 0 || teamMembers.length === 0) {
            console.log('⚠️  Please seed clients and team members first');
            process.exit(1);
        }

        const projects = [
            // Marketing Projects
            {
                projectName: 'Social Media Campaign - Spring 2026',
                client: clients[0]._id,
                startDate: new Date('2026-02-01'),
                endDate: new Date('2026-04-30'),
                paymentStatus: 'Done',
                projectStatus: 'In Progress',
                totalPrice: 15000,
                serviceProvided: 'Marketing',
                revenueDistribution: {
                    toolsAndCharges: 30,
                    teamShare: 50,
                    redixCaisse: 20
                },
                marketing: {
                    videosCount: 12,
                    postsCount: 45,
                    shootingSessionsCount: 6
                },
                toolsUsage: tools.length >= 3 ? [
                    { tool: tools[0]._id, percentage: 40 },
                    { tool: tools[1]._id, percentage: 35 },
                    { tool: tools[2]._id, percentage: 25 }
                ] : [],
                teamMembers: [teamMembers[0]._id, teamMembers[1]._id],
                plannedBudget: 15000,
                actualSpend: 8500,
                notes: [
                    {
                        content: 'Client wants more focus on Instagram reels',
                        author: teamMembers[0]._id,
                        createdAt: new Date('2026-02-05')
                    }
                ],
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            },
            {
                projectName: 'Brand Awareness Campaign Q1',
                client: clients[1]._id,
                startDate: new Date('2026-01-15'),
                endDate: new Date('2026-03-15'),
                paymentStatus: 'Pending',
                projectStatus: 'In Progress',
                totalPrice: 22000,
                serviceProvided: 'Marketing',
                revenueDistribution: {
                    toolsAndCharges: 25,
                    teamShare: 55,
                    redixCaisse: 20
                },
                marketing: {
                    videosCount: 20,
                    postsCount: 60,
                    shootingSessionsCount: 10
                },
                toolsUsage: tools.length >= 2 ? [
                    { tool: tools[0]._id, percentage: 60 },
                    { tool: tools[1]._id, percentage: 40 }
                ] : [],
                teamMembers: [teamMembers[1]._id, teamMembers[2]._id],
                plannedBudget: 22000,
                actualSpend: 12000,
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            },

            // Production Projects
            {
                projectName: 'Corporate Video Production',
                client: clients[2]._id,
                startDate: new Date('2026-02-10'),
                endDate: new Date('2026-03-20'),
                paymentStatus: 'Done',
                projectStatus: 'Completed',
                totalPrice: 18500,
                serviceProvided: 'Production',
                revenueDistribution: {
                    toolsAndCharges: 35,
                    teamShare: 45,
                    redixCaisse: 20
                },
                production: {
                    videosCount: 5,
                    picturesCount: 150,
                    shootingSessionsCount: 3
                },
                toolsUsage: tools.length >= 3 ? [
                    { tool: tools[0]._id, percentage: 50 },
                    { tool: tools[1]._id, percentage: 30 },
                    { tool: tools[2]._id, percentage: 20 }
                ] : [],
                teamMembers: [teamMembers[2]._id, teamMembers[3]._id],
                plannedBudget: 18500,
                actualSpend: 17800,
                notes: [
                    {
                        content: 'Delivered ahead of schedule. Client very satisfied.',
                        author: teamMembers[2]._id,
                        createdAt: new Date('2026-03-18')
                    }
                ],
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            },
            {
                projectName: 'Product Photography Session',
                client: clients[3]._id,
                startDate: new Date('2026-03-01'),
                endDate: new Date('2026-03-10'),
                paymentStatus: 'Pending',
                projectStatus: 'Not Started',
                totalPrice: 8000,
                serviceProvided: 'Production',
                revenueDistribution: {
                    toolsAndCharges: 40,
                    teamShare: 40,
                    redixCaisse: 20
                },
                production: {
                    videosCount: 0,
                    picturesCount: 200,
                    shootingSessionsCount: 2
                },
                toolsUsage: tools.length >= 2 ? [
                    { tool: tools[1]._id, percentage: 70 },
                    { tool: tools[2]._id, percentage: 30 }
                ] : [],
                teamMembers: [teamMembers[3]._id],
                plannedBudget: 8000,
                actualSpend: 0,
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            },

            // Development Projects
            {
                projectName: 'E-Commerce Platform Development',
                client: clients[0]._id,
                startDate: new Date('2026-01-20'),
                endDate: new Date('2026-05-30'),
                paymentStatus: 'Done',
                projectStatus: 'In Progress',
                totalPrice: 45000,
                serviceProvided: 'Development',
                revenueDistribution: {
                    toolsAndCharges: 15,
                    teamShare: 65,
                    redixCaisse: 20
                },
                development: {
                    description: 'Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
                    platform: 'Web',
                    typeComplexity: 'Advanced'
                },
                teamMembers: [teamMembers[0]._id, teamMembers[1]._id, teamMembers[4]._id],
                plannedBudget: 45000,
                actualSpend: 28000,
                notes: [
                    {
                        content: 'Payment gateway integration completed. Moving to frontend design.',
                        author: teamMembers[0]._id,
                        createdAt: new Date('2026-02-14')
                    }
                ],
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[1]._id
            },
            {
                projectName: 'Mobile App for Restaurant',
                client: clients[4]._id,
                startDate: new Date('2026-02-25'),
                endDate: new Date('2026-04-25'),
                paymentStatus: 'Pending',
                projectStatus: 'Not Started',
                totalPrice: 32000,
                serviceProvided: 'Development',
                revenueDistribution: {
                    toolsAndCharges: 20,
                    teamShare: 60,
                    redixCaisse: 20
                },
                development: {
                    description: 'Mobile app for food ordering with real-time tracking and payment processing.',
                    platform: 'Mobile',
                    typeComplexity: 'Advanced'
                },
                teamMembers: [teamMembers[1]._id, teamMembers[4]._id],
                plannedBudget: 32000,
                actualSpend: 0,
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            },
            {
                projectName: 'Portfolio Website',
                client: clients[2]._id,
                startDate: new Date('2026-02-05'),
                endDate: new Date('2026-02-20'),
                paymentStatus: 'Done',
                projectStatus: 'Completed',
                totalPrice: 5500,
                serviceProvided: 'Development',
                revenueDistribution: {
                    toolsAndCharges: 10,
                    teamShare: 70,
                    redixCaisse: 20
                },
                development: {
                    description: 'Clean and modern portfolio website with contact form and gallery.',
                    platform: 'Web',
                    typeComplexity: 'Vitrine'
                },
                teamMembers: [teamMembers[4]._id],
                plannedBudget: 5500,
                actualSpend: 4800,
                notes: [
                    {
                        content: 'Quick turnaround project. Client loved the design.',
                        author: teamMembers[4]._id,
                        createdAt: new Date('2026-02-21')
                    }
                ],
                createdBy: teamMembers[0]._id,
                lastModifiedBy: teamMembers[0]._id
            }
        ];

        await Project.insertMany(projects);
        console.log(`✅ Seeded ${projects.length} projects`);

        mongoose.connection.close();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding projects:', error);
        process.exit(1);
    }
};

seedProjects();
