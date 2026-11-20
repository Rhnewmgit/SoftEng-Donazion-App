import { config } from './config.mjs'
import mysql from 'mysql2/promise'
// ^ Needed to allow usage of certain commands within mysql2
//   that allow it to interact with the database.

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

export const handler = async (event) => {

    try {
        const aRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { donation_center_name } = aRequest;
        const query = 'DELETE FROM an_organization.donation_center WHERE donation_center_name = ?';
        const [result] = await pool.query(query, [donation_center_name]);
        body = {message: "The requested donation center has been successfully deleted."};
        code = 200;
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    // - Can't find the inputted information.
    catch {
        let errorMessage = "";
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
            errorMessage = "Database connection could not be secured.";
        }
        else if (error.code === 'ER_BAD_NULL_ERROR' || error.errno === 1048) {
            errorMessage = "Missing required information to add a category.";
        }
        else if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            errorMessage = "The donation center name that was inputted could not be found.";
        } else {
            errorMessage = "An unexpected error has occured for an unknown reason.";
        }
        body = { error: errorMessage };
    }
    return {
        statusCode: code,
        // JSON is to be expected as the data type.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }
}