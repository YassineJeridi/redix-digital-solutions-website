import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import projectRoutes from './routes/projects.js';
import toolRoutes from './routes/tools.js';
import settingsRoutes from './routes/settings.js';
import dashboardRoutes from './routes/dashboard.js';
import expensesRoutes from './routes/expenses.js';
import reportsRoutes from './routes/reports.js';
import notificationRoutes from './routes/notifications.js';
import auditRoutes from './routes/audit.js';
import financialRoutes from './routes/financial.js';
import marketingRoutes from './routes/marketing.js';
import chargesRoutes from './routes/charges.js';
import taskRoutes from './routes/tasks.js';
import backupRoutes from './routes/backup.js';
import configRoutes from './routes/config.js';
import { performBackup } from './controllers/backupController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Increase payload limit for image uploads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', projectRoutes); // Alias — frontend uses /api/services
app.use('/api/tools', toolRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/charges', chargesRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/config', configRoutes);

// Schedule automatic backup every 24 hours at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running scheduled daily backup...');
    try {
        await performBackup('Scheduled (Daily)');
        console.log('✅ Scheduled backup completed successfully');
    } catch (error) {
        console.error('❌ Scheduled backup failed:', error.message);
    }
});

// Database connection
connectDB();

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Redix Agency API Server' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
