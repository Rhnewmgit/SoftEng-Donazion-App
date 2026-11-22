import { config } from './config.mjs'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

var pool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE
})

const jwt_secret = process.env.JWT_SECRET

export const handler = async (event) => {
    const token = event?.token;
    // Token handling to ensure that there is a valid token when adding a category.
    const constructResponse = (code, payload) => {
        return {
            statusCode: code,
            body: JSON.stringify(payload)
        }
    }
    try {
        const data = jwt.verify(token, jwt_secret)
        if (data?.username != event?.name) {
            return constructResponse(400, "Invalid token, log back in first.")
        }
    }
    catch (error) {
        return constructResponse(400, "Invalid token, log back in first: " + error?.message)
    }
    try {
        const aRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { donation_center_name, password } = aRequest;
        if (!donation_center_name || String(donation_center_name).trim() === '') {
            return constructResponse(400, "Missing the first street address.");
        }
        if (!password || String(password).trim() === '') {
            return constructResponse(400, "Missing the password.");
        }
        const [rows] = await pool.execute('SELECT donation_center_password_hash FROM an_organization.donation_center WHERE donation_center_name = ?', [donation_center_name]);
        const storedHash = rows[0]?.donation_center_password_hash ?? '';
        if (!(await bcrypt.compare(String(password), storedHash))) {
            return constructResponse(400, "Password hashes do not match.");
        }
        await pool.execute('DELETE FROM an_organization.donation_center WHERE donation_center_name = ?', [donation_center_name]);
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (error.code === 'ER_BAD_NULL_ERROR' || error.errno === 1048) {
            return constructResponse(400, "Missing required information to add a category.");
        } else {
            return constructResponse(400, "An unexpected error has occured for an unknown reason.");
        }
    }
    const newToken = jwt.sign({ admin: true }, jwt_secret, { expiresIn: "24h" });
    const result = { name: donation_center_name };
    return constructResponse(200, result);
}