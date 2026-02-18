import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);

const runScript = async (scriptName) => {
    console.log(`\n🚀 Running ${scriptName}...`);
    try {
        const scriptPath = path.join(__dirname, scriptName);
        const { stdout, stderr } = await execPromise(`node "${scriptPath}"`);
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`❌ Error running ${scriptName}:`, error);
        throw error;
    }
};

const seedAll = async () => {
    try {
        console.log('🌱 Starting complete database seeding...\n');

        // Seed in order (dependencies first)
        await runScript('SeedFinancialMetrics.js');
        await runScript('SeedClient.js');
        await runScript('SeedTeamMember.js');
        await runScript('SeedTool.js');
        await runScript('SeedCharge.js');
        await runScript('SeedMarketingProject.js');

        console.log('\n✅ All seeding completed successfully!');
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAll();
