const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const fs = require('fs');

// Routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const logicRoutes = require('./routes/logic');

// Ensure database directory exists
const dbDir = 'd:/data/dev/jobs/lamaran/apba/data/sqlite';
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const app = express();
const port = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Fixed typo

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api', authRoutes); // /api/login, /api/logout
app.use('/api/logic', logicRoutes);

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Test DB Connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Sync Models
sequelize.sync()
    .then(() => console.log('Tables synced...'))
    .catch(err => console.log('Error syncing tables: ' + err));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
