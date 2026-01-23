const path = require('path');
const dotenv = require('dotenv');

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backendPort = process.env.BACKEND_PORT || 3001;

const PROXY_CONFIG = {
    "/api": {
        "target": `http://localhost:${backendPort}`,
        "secure": false,
        "changeOrigin": true
    }
};

module.exports = PROXY_CONFIG;
