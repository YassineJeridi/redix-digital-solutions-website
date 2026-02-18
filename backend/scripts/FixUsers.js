import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Use the CORRECT database name from .env
const CORRECT_URI = 'mongodb://localhost:27017/redix_agency';

await mongoose.connect(CORRECT_URI);
console.log('Connected to:', CORRECT_URI);

const usersCol = mongoose.connection.collection('users');
const teamCol = mongoose.connection.collection('teammembers');

const existingUsers = await usersCol.find().toArray();
console.log('Existing users in redix_agency:', existingUsers.length);
existingUsers.forEach(u => console.log('  ', u.name, u.email));

const salt = await bcrypt.genSalt(10);

const coreTeam = [
    { name: 'Redix', email: 'redix@redix.agency', password: 'redix123', role: 'admin', teamRole: 'Full Admin' },
    { name: 'Moemen', email: 'moemen@redix.agency', password: 'el_mon', role: 'manager', teamRole: 'Manager' },
    { name: 'Yassine', email: 'yassine@redix.agency', password: 'pexa123', role: 'member', teamRole: 'Developer' }
];

for (const m of coreTeam) {
    // Upsert user
    const hashedPassword = await bcrypt.hash(m.password, salt);
    const userResult = await usersCol.updateOne(
        { email: m.email },
        { $set: { name: m.name, email: m.email, password: hashedPassword, role: m.role, isActive: true }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
    );
    console.log(`User ${m.name}: matched=${userResult.matchedCount}, upserted=${userResult.upsertedCount}, modified=${userResult.modifiedCount}`);

    // Upsert team member
    const tmResult = await teamCol.updateOne(
        { email: m.email },
        { $set: { name: m.name, email: m.email, role: m.teamRole, status: 'active' }, $setOnInsert: { totalEarned: 0, totalReceived: 0, balance: 0, transactions: [], createdAt: new Date() } },
        { upsert: true }
    );
    console.log(`TeamMember ${m.name}: matched=${tmResult.matchedCount}, upserted=${tmResult.upsertedCount}, modified=${tmResult.modifiedCount}`);
}

// Verify
const finalUsers = await usersCol.find().toArray();
console.log('\nFinal users:', finalUsers.length);
for (const u of finalUsers) {
    const match = await bcrypt.compare(
        coreTeam.find(c => c.email === u.email)?.password || 'unknown',
        u.password
    );
    console.log(`  ${u.name} (${u.email}) - password verify: ${match}`);
}

await mongoose.disconnect();
console.log('\nDone!');
