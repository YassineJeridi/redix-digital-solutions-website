import TeamMember from '../models/TeamMember.js';
import FinancialMetrics from '../models/FinancialMetrics.js';
import { logAudit } from '../utils/auditLogger.js';
import { createNotification } from '../utils/notificationService.js';

export const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team members', error: error.message });
    }
};

export const createTeamMember = async (req, res) => {
    try {
        const member = new TeamMember(req.body);
        await member.save();

        await logAudit({
            action: 'create',
            entityType: 'TeamMember',
            entityId: member._id,
            details: { name: member.name, role: member.role }
        }, req);

        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error creating team member', error: error.message });
    }
};

export const updateTeamMember = async (req, res) => {
    try {
        const updateData = { ...req.body };
        const hasPassword = updateData.password && updateData.password.length > 0;

        if (hasPassword) {
            // Use findById + save to trigger pre-save hook for password hashing
            const member = await TeamMember.findById(req.params.id).select('+password');
            if (!member) {
                return res.status(404).json({ message: 'Team member not found' });
            }

            Object.keys(updateData).forEach(key => {
                member[key] = updateData[key];
            });
            await member.save();

            // Return member without password
            const updatedMember = await TeamMember.findById(req.params.id);

            await logAudit({
                action: 'update',
                entityType: 'TeamMember',
                entityId: updatedMember._id,
                details: { name: updatedMember.name }
            }, req);

            return res.json(updatedMember);
        }

        // No password change — use findByIdAndUpdate
        delete updateData.password;
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        await logAudit({
            action: 'update',
            entityType: 'TeamMember',
            entityId: member._id,
            details: { name: member.name }
        }, req);

        res.json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error updating team member', error: error.message });
    }
};

export const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        await logAudit({
            action: 'delete',
            entityType: 'TeamMember',
            entityId: member._id,
            details: { name: member.name }
        }, req);

        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team member', error: error.message });
    }
};

export const addPayment = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const member = await TeamMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        member.addPayment(amount, description);
        await member.save();

        await logAudit({
            action: 'commission',
            entityType: 'TeamMember',
            entityId: member._id,
            details: { amount, description, type: 'commission' }
        }, req);

        // Notify team member about commission/tip received
        await createNotification(
            member._id,
            `Commission/tip of ${amount} TND received${description ? ': ' + description : ''}`,
            'success',
            member._id
        );

        // Commission is a tip — money coming in from outside, so
        // we ADD it to Redix Caisse (increases company funds)
        try {
            const metrics = await FinancialMetrics.getInstance();
            metrics.redixCaisse += amount;
            metrics.lastUpdated = new Date();
            await metrics.save();
        } catch (metricsErr) {
            console.error('Error updating Redix Caisse after commission:', metricsErr);
        }

        res.json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error adding commission', error: error.message });
    }
};

export const addAdvance = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const member = await TeamMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        member.addAdvance(amount, description);
        await member.save();

        res.json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error adding advance', error: error.message });
    }
};

export const addWithdrawal = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const member = await TeamMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Withdrawal amount must be greater than 0' });
        }

        member.addWithdrawal(amount, description);
        await member.save();

        await logAudit({
            action: 'withdrawal',
            entityType: 'TeamMember',
            entityId: member._id,
            details: { amount, description, type: 'withdrawal' }
        }, req);

        // Notify team member about withdrawal
        await createNotification(
            member._id,
            `Withdrawal of ${amount} TND processed${description ? ': ' + description : ''}`,
            'info',
            member._id
        );

        res.json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error processing withdrawal', error: error.message });
    }
};
