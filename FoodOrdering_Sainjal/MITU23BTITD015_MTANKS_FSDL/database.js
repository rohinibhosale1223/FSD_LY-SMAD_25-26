const mysql = require('mysql2');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mtanks_db',
    port: process.env.DB_PORT || 3306
};

// Create connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Initialize database and create tables
const initializeDatabase = async () => {
    try {
        // Create a separate connection without selecting a default database first
        const adminConnection = mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port,
            multipleStatements: true
        });

        const admin = adminConnection.promise();

        // Create database if it doesn't exist
        await admin.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        // Select database
        await admin.query(`USE \`${dbConfig.database}\``);
        
        // Create users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        `;
        await admin.query(createUsersTable);
        console.log('✅ Users table created/verified');
        
        // Create user sessions table for additional session management
        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await admin.query(createSessionsTable);
        console.log('✅ User sessions table created/verified');
        
        // Create user profiles table for additional user information
        const createProfilesTable = `
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                bio TEXT,
                company VARCHAR(100),
                job_title VARCHAR(100),
                website VARCHAR(255),
                location VARCHAR(100),
                avatar_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await admin.query(createProfilesTable);
        // Ensure a unique index on user_id for upserts (compatible with older MySQL)
        const [idxRows] = await admin.query(
            `SELECT COUNT(1) AS cnt
             FROM information_schema.statistics
             WHERE table_schema = ? AND table_name = 'user_profiles' AND index_name = 'user_profiles_user_id_uq'`,
            [dbConfig.database]
        );
        if (!idxRows[0] || idxRows[0].cnt === 0) {
            await admin.query(`CREATE UNIQUE INDEX user_profiles_user_id_uq ON user_profiles(user_id)`);
        }
        console.log('✅ User profiles table created/verified');
        
        await admin.end();
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection,
    initializeDatabase
};


