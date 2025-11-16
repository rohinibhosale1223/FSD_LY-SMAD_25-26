const { pool } = require('../database');

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

const findByUsernameOrEmail = async ({ email, username }) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
    [email, username]
  );
  return rows[0] || null;
};

const createUser = async (user) => {
  const { firstName, lastName, username, email, password, phone } = user;
  const [result] = await pool.query(
    `INSERT INTO users (first_name, last_name, username, email, password, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, username, email, password, phone || null]
  );
  return result.insertId;
};

const getProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.is_active,
            p.bio, p.company, p.job_title, p.website, p.location, p.avatar_url
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

const upsertProfile = async (userId, profile) => {
  // Ensure row exists then update
  await pool.query(
    `INSERT INTO user_profiles (user_id, bio, company, job_title, website, location)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE bio = VALUES(bio), company = VALUES(company), job_title = VALUES(job_title), website = VALUES(website), location = VALUES(location)`,
    [userId, profile.bio || null, profile.company || null, profile.jobTitle || null, profile.website || null, profile.location || null]
  );
};

const updateUserBasics = async (userId, data) => {
  await pool.query(
    `UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?`,
    [data.firstName, data.lastName, data.phone || null, userId]
  );
};

const updatePassword = async (userId, passwordHash) => {
  await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [passwordHash, userId]);
};

module.exports = {
  findByEmail,
  findById,
  findByUsernameOrEmail,
  createUser,
  getProfile,
  upsertProfile,
  updateUserBasics,
  updatePassword
};
