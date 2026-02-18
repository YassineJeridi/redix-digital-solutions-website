import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect('mongodb://localhost:27017/redix_agency');
const User = mongoose.connection.collection('users');

const user = await User.findOne({ email: 'redix@redix.agency' });
console.log('Password hash:', user.password);
console.log('Hash length:', user.password.length);
console.log('Starts with $2:', user.password.startsWith('$2'));

const match = await bcrypt.compare('redix123', user.password);
console.log('bcrypt.compare result:', match);

await mongoose.disconnect();
