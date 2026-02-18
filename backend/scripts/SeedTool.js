import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from '../models/Tool.js';

dotenv.config();

const tools = [
    // Software & Subscriptions
    { name: 'Adobe Creative Cloud', category: 'Software', description: 'Complete suite for design and video editing', purchasePrice: 0, monthlyFee: 54.99 },
    { name: 'Final Cut Pro', category: 'Software', description: 'Professional video editing software', purchasePrice: 299.99, monthlyFee: 0 },
    { name: 'DaVinci Resolve Studio', category: 'Software', description: 'Advanced color grading and editing', purchasePrice: 295.00, monthlyFee: 0 },
    { name: 'Canva Pro', category: 'Software', description: 'Graphic design platform', purchasePrice: 0, monthlyFee: 12.99 },
    { name: 'Figma Professional', category: 'Software', description: 'UI/UX design tool', purchasePrice: 0, monthlyFee: 15.00 },
    { name: 'Adobe Stock', category: 'Software', description: 'Stock photos and videos', purchasePrice: 0, monthlyFee: 29.99 },
    { name: 'Envato Elements', category: 'Software', description: 'Unlimited creative assets', purchasePrice: 0, monthlyFee: 16.50 },
    { name: 'Frame.io', category: 'Software', description: 'Video collaboration platform', purchasePrice: 0, monthlyFee: 19.00 },
    { name: 'Notion Team', category: 'Software', description: 'Project management tool', purchasePrice: 0, monthlyFee: 10.00 },
    { name: 'Trello Business', category: 'Software', description: 'Task management', purchasePrice: 0, monthlyFee: 12.50 },

    // Camera Equipment
    { name: 'Sony A7 III', category: 'Camera', description: 'Full-frame mirrorless camera', purchasePrice: 1998.00, monthlyFee: 0 },
    { name: 'Canon EOS R6', category: 'Camera', description: 'Professional mirrorless camera', purchasePrice: 2499.00, monthlyFee: 0 },
    { name: 'GoPro Hero 11', category: 'Camera', description: 'Action camera for dynamic shots', purchasePrice: 499.99, monthlyFee: 0 },
    { name: 'DJI Ronin-S', category: 'Camera', description: 'Gimbal stabilizer', purchasePrice: 699.00, monthlyFee: 0 },
    { name: 'Sony 24-70mm f/2.8 GM', category: 'Lens', description: 'Professional zoom lens', purchasePrice: 2198.00, monthlyFee: 0 },
    { name: 'Canon RF 50mm f/1.2', category: 'Lens', description: 'Portrait lens', purchasePrice: 2299.00, monthlyFee: 0 },
    { name: 'Sigma 14-24mm f/2.8', category: 'Lens', description: 'Wide-angle lens', purchasePrice: 1299.00, monthlyFee: 0 },

    // Lighting
    { name: 'Aputure 300d II', category: 'Lighting', description: 'LED light for video production', purchasePrice: 1099.00, monthlyFee: 0 },
    { name: 'Godox SL-60W', category: 'Lighting', description: 'LED video light', purchasePrice: 119.00, monthlyFee: 0 },
    { name: 'Neewer Ring Light', category: 'Lighting', description: 'Ring light for content creation', purchasePrice: 69.99, monthlyFee: 0 },
    { name: 'Softbox Kit', category: 'Lighting', description: 'Professional softbox lighting', purchasePrice: 199.99, monthlyFee: 0 },

    // Audio Equipment
    { name: 'Rode NTG4+', category: 'Audio', description: 'Shotgun microphone', purchasePrice: 599.00, monthlyFee: 0 },
    { name: 'Shure SM7B', category: 'Audio', description: 'Professional microphone', purchasePrice: 399.00, monthlyFee: 0 },
    { name: 'Zoom H6', category: 'Audio', description: 'Portable audio recorder', purchasePrice: 399.99, monthlyFee: 0 },
    { name: 'Audio-Technica AT2020', category: 'Audio', description: 'Studio microphone', purchasePrice: 99.00, monthlyFee: 0 },

    // Cloud & Hosting
    { name: 'Google Workspace', category: 'Cloud Service', description: 'Business email and storage', purchasePrice: 0, monthlyFee: 12.00 },
    { name: 'Dropbox Business', category: 'Cloud Service', description: 'Cloud storage', purchasePrice: 0, monthlyFee: 15.00 },
    { name: 'AWS Services', category: 'Cloud Service', description: 'Cloud computing services', purchasePrice: 0, monthlyFee: 50.00 },
    { name: 'Hostinger Business', category: 'Hosting', description: 'Web hosting service', purchasePrice: 0, monthlyFee: 8.99 },

    // Marketing Tools
    { name: 'Meta Business Suite', category: 'Marketing', description: 'Facebook & Instagram ads', purchasePrice: 0, monthlyFee: 0 },
    { name: 'Hootsuite Professional', category: 'Marketing', description: 'Social media management', purchasePrice: 0, monthlyFee: 49.00 },
    { name: 'Buffer Pro', category: 'Marketing', description: 'Social media scheduling', purchasePrice: 0, monthlyFee: 15.00 },
    { name: 'Mailchimp Standard', category: 'Marketing', description: 'Email marketing platform', purchasePrice: 0, monthlyFee: 17.00 },
    { name: 'SEMrush Pro', category: 'Marketing', description: 'SEO and marketing tool', purchasePrice: 0, monthlyFee: 119.95 },
    { name: 'Google Ads Account', category: 'Marketing', description: 'Google advertising platform', purchasePrice: 0, monthlyFee: 0 },

    // Computers & Hardware
    { name: 'MacBook Pro M2', category: 'Computer', description: 'High-performance laptop', purchasePrice: 2499.00, monthlyFee: 0 },
    { name: 'iMac 27" 5K', category: 'Computer', description: 'Desktop workstation', purchasePrice: 2299.00, monthlyFee: 0 },
    { name: 'Dell XPS 15', category: 'Computer', description: 'Windows laptop', purchasePrice: 1899.00, monthlyFee: 0 },
    { name: 'iPad Pro 12.9"', category: 'Tablet', description: 'Digital drawing tablet', purchasePrice: 1099.00, monthlyFee: 0 },
    { name: 'Wacom Cintiq Pro', category: 'Tablet', description: 'Professional drawing display', purchasePrice: 2499.99, monthlyFee: 0 },

    // Storage & Backup
    { name: 'Synology NAS DS920+', category: 'Storage', description: 'Network storage device', purchasePrice: 549.99, monthlyFee: 0 },
    { name: 'Samsung SSD 2TB', category: 'Storage', description: 'External SSD', purchasePrice: 199.99, monthlyFee: 0 },
    { name: 'WD My Passport 5TB', category: 'Storage', description: 'External hard drive', purchasePrice: 129.99, monthlyFee: 0 },
    { name: 'Backblaze Backup', category: 'Cloud Service', description: 'Automatic cloud backup', purchasePrice: 0, monthlyFee: 7.00 },

    // Accessories
    { name: 'Manfrotto Tripod', category: 'Accessory', description: 'Professional camera tripod', purchasePrice: 199.99, monthlyFee: 0 },
    { name: 'Peak Design Backpack', category: 'Accessory', description: 'Camera bag', purchasePrice: 259.95, monthlyFee: 0 },
    { name: 'Logitech MX Master 3', category: 'Accessory', description: 'Wireless mouse', purchasePrice: 99.99, monthlyFee: 0 },
    { name: 'BenQ Monitor 32"', category: 'Monitor', description: '4K display for editing', purchasePrice: 699.00, monthlyFee: 0 },
    { name: 'LG UltraWide 34"', category: 'Monitor', description: 'Ultrawide monitor', purchasePrice: 799.99, monthlyFee: 0 }
];

const seedTools = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
        console.log('📦 MongoDB connected for seeding tools...');

        // Clear existing tools
        await Tool.deleteMany({});
        console.log('🗑️  Cleared existing tools');

        await Tool.insertMany(tools);
        console.log(`✅ Successfully seeded ${tools.length} tools`);

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding tools:', error);
        process.exit(1);
    }
};

seedTools();
