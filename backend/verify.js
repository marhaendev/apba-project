// Used axios instead of node-fetch
// Actually, let's use the standard http module to avoid deps if possible, OR just assume fetch exists.
// Or better, I'll just install axios for the test.

const axios = require('axios');
const CryptoJS = require('crypto-js');

const BASE_URL = 'http://localhost:3001/api';

async function runTests() {
    try {
        console.log('--- 1. Testing Logic Routes ---');

        // Array
        const resArray = await axios.get(`${BASE_URL}/logic/array`);
        console.log('Array Result:', JSON.stringify(resArray.data.result) === JSON.stringify([1, 3, 4, 6, 7]) ? 'PASS' : 'FAIL', resArray.data.result);

        // String
        const resString = await axios.get(`${BASE_URL}/logic/string`);
        console.log('String Result:', resString.data.output === 'PT. Abadi Perkasa Bersama Digital Solutions' ? 'PASS' : 'FAIL', `"${resString.data.output}"`);

        // Terbilang
        const resTerbilang = await axios.get(`${BASE_URL}/logic/terbilang?nominal=10113199.50`);
        const expectedTerbilang = "Sepuluh Juta Seratus Tiga Belas Ribu Seratus Sembilan Puluh Sembilan Koma Lima Puluh Rupiah";
        console.log('Terbilang Result:', resTerbilang.data.terbilang === expectedTerbilang ? 'PASS' : 'FAIL', `"${resTerbilang.data.terbilang}"`);

        console.log('\n--- 2. Testing User CRUD ---');

        // Create
        const newUser = {
            id_user: 'U001',
            username: 'testuser',
            password: 'password123',
            nama: 'Test User',
            hakakses: 'admin',
            kdlink: '01',
            kdcbang: '01'
        };

        // Delete if exists first (cleanup)
        try { await axios.delete(`${BASE_URL}/users/U001`); } catch (e) { }

        const resCreate = await axios.post(`${BASE_URL}/users`, newUser);
        console.log('Create User:', resCreate.data.success ? 'PASS' : 'FAIL');

        // Read
        const resList = await axios.get(`${BASE_URL}/users`);
        const userFound = resList.data.find(u => u.id_user === 'U001');
        console.log('Read User:', userFound ? 'PASS' : 'FAIL');

        // Update
        await axios.put(`${BASE_URL}/users/U001`, { nama: 'Updated User' });
        const resUpdated = await axios.get(`${BASE_URL}/users`);
        const userUpdated = resUpdated.data.find(u => u.id_user === 'U001');
        console.log('Update User:', userUpdated.nama === 'Updated User' ? 'PASS' : 'FAIL');


        console.log('\n--- 3. Testing Auth ---');

        // Login with Encryption
        const payload = { username: 'testuser', password: 'password123' };
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), 'SecretPassphrase').toString();

        const resLogin = await axios.post(`${BASE_URL}/login`, { encryptedData: ciphertext });
        console.log('Login (Encrypted):', resLogin.data.message === 'Login successful' ? 'PASS' : 'FAIL');

        // Check Cookie? Axios in node doesn't auto-handle cookies easily without a jar, but we can check headers.
        const cookieHeader = resLogin.headers['set-cookie'];
        console.log('Cookie Set:', cookieHeader && cookieHeader[0].includes('token=') ? 'PASS' : 'FAIL');

        // Cleanup
        await axios.delete(`${BASE_URL}/users/U001`);
        console.log('Cleanup Done.');

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

// Check if axios is installed, if not try to install or rely on pre-install
runTests();
