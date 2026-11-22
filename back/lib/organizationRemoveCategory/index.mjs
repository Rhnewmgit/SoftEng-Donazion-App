import mysql from 'mysql2/promise'
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
    const token = event?.token;
    // Token handling
    const constructResponse = (code, payload) => {
        return {
            statusCode: code,
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify(payload)
        }
    }
    try {
        const data = jwt.verify(token, jwt_secret)
        if (!data?.admin) {
            return constructResponse(400, "Invalid token, log back in first.")
        }
    }
    catch (err) {
        return constructResponse(400, "Invalid token, log back in first: " + err?.message)
    }
    const { category: category_name } = event
    if (!category_name) {
        return constructResponse(400, "No category provided")
    }
    try {        
        const query = 'DELETE FROM category WHERE name = ?';
        const [result] = await pool.execute(query, [category_name]);
        if (!result.affectedRows) {
            return constructResponse(400, "Could not delete category: " + category_name)
        }
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    // - Can't find the inputted information.
    catch (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (err.code === 'ER_BAD_NULL_ERROR' || err.errno === 1048) {
            return constructResponse(400, "Missing required information to add a category.");
        }
        else if (err.code === 'ER_BAD_FIELD_ERROR') {
            return constructResponse(400, "Inputted category name cannot be found.");
        } else {
            return constructResponse(400, "SQL error: " + err)
        }
    }
    try {
        const [rows] = await pool.execute('SELECT DISTINCT name FROM category');
        const result = { categories: rows.map(row => row.name) };
        return constructResponse(200, result);
    } 
    catch (err) {
        return constructResponse(400, "SQL error: " + err)
    }

}
