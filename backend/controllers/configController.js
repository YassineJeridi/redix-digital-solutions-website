import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GlobalConfig from '../models/GlobalConfig.js';

// ─────────────────────────────────────────────
//  POST /api/config/verify-master-key
//  Public — called from the stealth 404 page
// ─────────────────────────────────────────────
export const verifyMasterKey = async (req, res) => {
    try {
        const { key } = req.body;

        if (!key || typeof key !== 'string') {
            return res.status(400).json({ message: 'Access key is required.' });
        }

        const config = await GlobalConfig.getInstance();
        const isMatch = await bcrypt.compare(key.trim(), config.masterKeyHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid access key.' });
        }

        // Issue a short-lived JWT (5 minutes) — portal access token
        const accessToken = jwt.sign(
            { purpose: 'portal-access', iat: Math.floor(Date.now() / 1000) },
            process.env.JWT_SECRET || 'default-secret-key',
            { expiresIn: '5m' }
        );

        res.json({
            success: true,
            accessToken,
            message: 'Access granted.',
        });
    } catch (error) {
        console.error('verifyMasterKey error:', error);
        res.status(500).json({ message: 'Server error verifying access key.' });
    }
};

// ─────────────────────────────────────────────
//  PUT /api/config/master-key
//  Admin protected — update the master key
// ─────────────────────────────────────────────
export const updateMasterKey = async (req, res) => {
    try {
        const { currentKey, newKey } = req.body;

        if (!currentKey || !newKey) {
            return res.status(400).json({
                message: 'Both current key and new key are required.',
            });
        }

        if (newKey.length < 8) {
            return res.status(400).json({
                message: 'New key must be at least 8 characters long.',
            });
        }

        const config = await GlobalConfig.getInstance();

        // Verify the current key first
        const currentMatch = await bcrypt.compare(currentKey.trim(), config.masterKeyHash);
        if (!currentMatch) {
            return res.status(401).json({ message: 'Current access key is incorrect.' });
        }

        // Hash and save the new key
        const salt = await bcrypt.genSalt(12);
        const newHash = await bcrypt.hash(newKey.trim(), salt);

        config.masterKeyHash = newHash;
        config.lastKeyUpdate = new Date();
        config.updatedBy = req.user?.name || req.user?.email || 'admin';
        await config.save();

        res.json({
            success: true,
            message: 'Master key updated successfully.',
            lastKeyUpdate: config.lastKeyUpdate,
        });
    } catch (error) {
        console.error('updateMasterKey error:', error);
        res.status(500).json({ message: 'Server error updating master key.' });
    }
};

// ─────────────────────────────────────────────
//  GET /api/config/master-key-info
//  Admin protected — get last-update metadata
// ─────────────────────────────────────────────
export const getMasterKeyInfo = async (req, res) => {
    try {
        const config = await GlobalConfig.getInstance();
        res.json({
            lastKeyUpdate: config.lastKeyUpdate,
            updatedBy: config.updatedBy,
        });
    } catch (error) {
        console.error('getMasterKeyInfo error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
