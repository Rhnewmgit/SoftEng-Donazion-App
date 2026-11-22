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
        return constructResponse(400, "Invalid token, log back in first: " + err?.message)
    }
    try {
        // A location has to be added first otherwise a 
        // donation center can't be registered (GPS coordinates).
        const aRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { street_address_one, 
            street_address_two, 
            latitude, 
            longitude, 
            city, 
            state, 
            zip, 
            donation_center_name, 
            organization_name, 
            password,
            wishlist_default_value = null } = aRequest;
        // Handling for certain necessary values (Primary key in particular).
        if (!street_address_one || String(street_address_one).trim() === '') {
            return constructResponse(400, "Missing the first street address.");
        }
        if (!password || String(password).trim() === '') {
            return constructResponse(400, "Missing the password.");
        }
        // Password check to ensure the password is correct.
        const [rows] = await pool.execute('SELECT donation_center_password_hash FROM an_organization.donation_center WHERE donation_center_name = ?', [donation_center_name]);
        const storedHash = rows[0]?.donation_center_password_hash ?? '';
        if (!(await bcrypt.compare(String(password), storedHash))) {
            return constructResponse(400, "Password hashes do not match.");
        }
        // Handling for the second address since this is optional.
        const second_address_value = !street_address_two || String(street_address_two).trim() === '' ? 'N / A' : String(street_address_two).trim();
        const query = 'INSERT INTO an_organization.location (street_address_one, street_address_two, latitude, longitude, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await pool.execute(query, [street_address_one, 
            second_address_value, 
            latitude, 
            longitude, 
            city, 
            state, 
            zip]);
        const centerQuery = 'INSERT INTO an_organization.donation_center (donation_center_name, donation_center_password_hash, organization_name, street_address_one) VALUES (?, ?, ?, ?, ?)';
        await pool.execute(centerQuery, [donation_center_name, 
            storedHash, 
            organization_name, 
            street_address_one, 
            wishlist_default_value]);
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    // - Violating database rules (e.g. There can't be two of the same donation center names).
    catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (error.code === 'ER_BAD_NULL_ERROR' || error.errno === 1048) {
            return constructResponse(400, "Missing required information to add a category.");
        }
        else if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return constructResponse(400, "Duplicate donation center names cannot exist.");
        } else {
            return constructResponse(400, "An unexpected error has occured for an unknown reason.");
        }
    }
    const newToken = jwt.sign({ admin: true }, jwt_secret, { expiresIn: "24h" });
    const result = { name: donation_center_name, token: newToken};
    return constructResponse(200, result);
}


