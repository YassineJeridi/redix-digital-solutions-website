import { Router } from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addNote,
    addAttachment,
    exportToCSV,
    exportToPDF,
    getProjectStats,
    updateProjectStatus,
    recordPartialPayment
} from '../controllers/projectsController.js';
// import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Temporarily disable authentication until auth system is implemented
// router.use(protect);

// Get all projects (with filters, search, sort, pagination)
router.get('/', getProjects);

// Get project statistics
router.get('/stats', getProjectStats);

// Export routes
router.get('/export/csv', exportToCSV);
router.get('/export/pdf', exportToPDF);

// Get single project
router.get('/:id', getProjectById);

// Create project
router.post('/', createProject);

// Update project
router.put('/:id', updateProject);

// Inline status update
router.patch('/:id/status', updateProjectStatus);

// Record partial payment
router.post('/:id/partial-payment', recordPartialPayment);

// Delete project
router.delete('/:id', deleteProject);

// Add note to project
router.post('/:id/notes', addNote);

// Add attachment to project
router.post('/:id/attachments', addAttachment);

export default router;
