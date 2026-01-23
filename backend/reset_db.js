const fs = require('fs');
const path = require('path');

const dbPath = path.resolve('..', 'data', 'sqlite', 'database.sqlite');

try {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('Database file deleted.');
    } else {
        console.log('Database file not found, nothing to delete.');
    }
} catch (error) {
    console.error('Error deleting database:', error);
}
