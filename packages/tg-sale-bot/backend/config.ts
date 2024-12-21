import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    dbConnectionString: process.env.DB_CONNECTION_STRING || ''
};

export default config;
