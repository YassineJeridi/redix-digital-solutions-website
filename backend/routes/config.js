import express from 'express';
import {
    verifyMasterKey,
    updateMasterKey,
    getMasterKeyInfo,
} from '../controllers/configController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public — stealth 404 page calls this
router.post('/verify-master-key', verifyMasterKey);

// Admin only — update the master key from dashboard settings
router.put('/master-key', protect, authorize('admin'), updateMasterKey);

// Admin only — get last-update metadata
router.get('/master-key-info', protect, authorize('admin'), getMasterKeyInfo);

export default router;
