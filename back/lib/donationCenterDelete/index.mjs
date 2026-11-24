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
    if (event?.body) {
		event = JSON.parse(event.body)
	}

    if (!donation_center_name || String(donation_center_name).trim() === '') {
        return constructResponse(400, "No donation center name provided");
    }
    if (!password || String(password).trim() === '') {
        return constructResponse(400, "No password provided");
    }
    const { name: donation_center_name, password, token } = event
    // Token handling to ensure that there is a valid token when adding a category.
    const constructResponse = (code, payload) => {
        return {
            statusCode: code,
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify(payload)
        }
    }
    try {
        const data = jwt.verify(token, jwt_secret)
        if (data?.username != event?.name) {
            return constructResponse(400, "Invalid token: username does not match provided username")
        }
    }
    catch (err) {
        return constructResponse(400, "Invalid token, log back in first: " + err?.message)
    }
    try {
        const [rows] = await pool.execute('SELECT password_hash FROM donation_center WHERE name = ?', [donation_center_name]);
        if (!rows.length) {
            return constructResponse(400, "Could not find user: " + donation_center_name)
        }
        const storedHash = rows[0]?.password_hash ?? ''
        if (!(bcrypt.compareSync(String(password), storedHash))) {
            return constructResponse(400, "Password was incorrect");
        }
        await pool.execute('DELETE FROM donation_center WHERE name = ?', [donation_center_name]);
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    catch (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (err.code === 'ER_BAD_NULL_ERROR' || err.errno === 1048) {
            return constructResponse(400, "Missing required information.");
        } else {
            return constructResponse(400, "SQL error: " + err);
        }
    }
    const result = { name: donation_center_name };
    return constructResponse(200, result);
}