import mongoose from 'mongoose';

// Singleton model — only one document should ever exist in the collection.
// Stores system-wide configuration values.
const globalConfigSchema = new mongoose.Schema(
    {
        // Bcrypt-hashed master key for stealth portal access
        masterKeyHash: {
            type: String,
            required: true,
        },
        // Optional metadata
        lastKeyUpdate: {
            type: Date,
            default: Date.now,
        },
        updatedBy: {
            type: String,
            default: 'system',
        },
    },
    {
        timestamps: true,
        collection: 'globalconfig', // explicit collection name
    }
);

// Singleton helper — always returns the single config document
globalConfigSchema.statics.getInstance = async function () {
    let config = await this.findOne();
    if (!config) {
        // Should not happen after seeding, but safety fallback
        const bcrypt = await import('bcryptjs');
        const hash = await bcrypt.default.hash('RedixMasterKey2026', 12);
        config = await this.create({ masterKeyHash: hash });
    }
    return config;
};

const GlobalConfig = mongoose.model('GlobalConfig', globalConfigSchema);

export default GlobalConfig;
