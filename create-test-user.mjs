import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create the user
        const { data, error } = await supabase.from('users').insert([{
            username: 'farmer1',
            email: 'farmer1@example.com',
            password: hashedPassword,
            full_name: 'Rajesh Kumar',
            role: 'farmer'
        }]).select();

        if (error) {
            console.error('Error creating user:', error);
            process.exit(1);
        }

        console.log('✅ Test user created successfully!');
        console.log('Username: farmer1');
        console.log('Password: password123');
        console.log('User data:', data);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createTestUser();
