

// src/models/users.model.js
const pool = require('../config/db');

const postUserModel = async (userInfo) => {
    const { username, email, password } = userInfo;
    try {
        const conn = await pool.getConnection();
        const sql = `
            INSERT INTO user (user_name, user_email, user_password) 
            VALUES (?, ?, ?)
        `;
        const [result] = await conn.query(sql, [username, email, password]);
        conn.release();
        return result;
    } catch (err) {
        console.error(err);
    }
};

    const getUserModel = async () => {
        try {
            const conn = await pool.getConnection();
            const sql = `SELECT * FROM user`;
            const [result] = await conn.query(sql);
            conn.release();
            return result;
        } catch (err) {
            console.log(err);
            throw err; // Re-throw error to handle it in the controller
        }
    };


module.exports = { postUserModel,getUserModel };
