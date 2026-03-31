"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("./db/supabase");
async function testConnection() {
    console.log('Testing Supabase Connection...');
    try {
        // Attempt to fetch projects to see if the connection works.
        // Since we are using the SERVICE_ROLE_KEY, it bypasses RLS and should be able to read all.
        const { data, error } = await supabase_1.supabase.from('projects').select('id, name').limit(1);
        if (error) {
            console.error('❌ Connection Failed. Database error:', error.message);
            return;
        }
        console.log('✅ Connection Successful! We reached the Database.');
        console.log('Projects retrieved:', data);
    }
    catch (err) {
        console.error('❌ Unexpected error during connection test:', err);
    }
}
testConnection();
