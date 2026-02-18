import { Router } from 'express';
import {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addPayment,
    addAdvance,
    addWithdrawal
} from '../controllers/settingsController.js';

const router = Router();

router.get('/', getTeamMembers);
router.post('/', createTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);
router.post('/:id/payment', addPayment);
router.post('/:id/advance', addAdvance);
router.post('/:id/withdrawal', addWithdrawal);

export default router;
