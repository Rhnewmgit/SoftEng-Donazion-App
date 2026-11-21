import { config } from './config.mjs'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

export const handler = async (event) => {
    const token = event?.token;
    // Token handling
    const constructResponse = (code, payload) => {
        return {
            statusCode: code,
            body: JSON.stringify(payload)
        }
    }
    try {
        const data = jwt.verify(token, config.jwt_secret)
        if (!data?.admin) {
            return constructResponse(400, "Invalid token, log back in first.")
        }
    }
    catch (error) {
        return constructResponse(400, "Invalid token, log back in first: " + err?.message)
    }
    try {
        const aRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { category_name, category_item_name } = aRequest;
        const query = 'DELETE FROM an_organization.category WHERE category_name = ? and category_item_name = ?';
        const [result] = await pool.execute(query, [category_name, category_item_name]);
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    // - Can't find the inputted information.
    catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (error.code === 'ER_BAD_NULL_ERROR' || error.errno === 1048) {
            return constructResponse(400, "Missing required information to add a category.");
        }
        else if (error.code === 'ER_BAD_FIELD_ERROR') {
            return constructResponse(400, "Inputted category name cannot be found.");
        } else {
            return constructResponse(400, "An unexpected error has occured for an unknown reason.");
        }
    }
    const newToken = jwt.sign({ admin: true }, config.jwt_secret, { expiresIn: "24h" });
    const [rows] = await pool.execute('SELECT DISTINCT category_name FROM an_organization.category');
    const result = { categories: rows.map(row => row.category_name) };
    return constructResponse(200, result);
}
