import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redix_agency');
const User = mongoose.connection.collection('users');

const salt = await bcrypt.genSalt(10);
const resets = [
    { email: 'redix@redix.agency', password: 'redix123' },
    { email: 'moemen@redix.agency', password: 'el_mon' },
    { email: 'yassine@redix.agency', password: 'pexa123' }
];

for (const r of resets) {
    const hash = await bcrypt.hash(r.password, salt);
    const result = await User.updateOne({ email: r.email }, { $set: { password: hash } });
    console.log(`${r.email} - updated: ${result.modifiedCount}`);
}

await mongoose.disconnect();
console.log('All passwords reset successfully');
