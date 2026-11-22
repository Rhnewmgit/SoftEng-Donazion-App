import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import 'dotenv/config' // TESTING

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
    // Token handling to ensure that there is a valid token when adding a category.
    const constructResponse = (code, payload) => {
        return {
            statusCode: code,
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            body: JSON.stringify(payload)
        }
    }
    const { 
        name: donation_center_name,
        street1: street_address_one, 
        street2: street_address_two, 
        lat: latitude, 
        long: longitude, 
        city, 
        state, 
        zip,  
        password,
        } = event;
    try {
        // A location has to be added first otherwise a 
        // donation center can't be registered (GPS coordinates).
        const saltRounds = 8
        const hash = bcrypt.hashSync(password, saltRounds)
        const centerQuery = 'INSERT INTO donation_center (name,password_hash,street_address_one,street_address_two,latitude,longitude,city,state,zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.execute(centerQuery, [donation_center_name, 
            hash, 
            street_address_one, 
            street_address_two,
            latitude,
            longitude,
            city,
            state,
            zip]);
    }
    // Should only trigger in the case that there is:
    // - Connection issues to the database (Cannot connect in the first place or disconnect while using it).
    // - Missing information that was supposed to be inputted.
    // - Violating database rules (e.g. There can't be two of the same donation center names).
    catch (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            return constructResponse(400, "Database connection could not be secured.");
        }
        else if (err.code === 'ER_BAD_NULL_ERROR' || err.errno === 1048) {
            return constructResponse(400, "Missing required information to add a category.");
        }
        else if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return constructResponse(400, "A donation center with that name already exists.");
        } else {
            return constructResponse(400, "SQL error: " + err);
        }
    }
    const newToken = jwt.sign({ admin: true }, jwt_secret, { expiresIn: "24h" });
    const result = { name: donation_center_name, token: newToken};
    return constructResponse(200, result);
}


// console.log(await handler({
//     "name": "testcenter0",
//     "street1": "100 Main St.",
//     "street2": "floor 2",
//     "zip": 12345,
//     "city": "Worcester",
//     "state": "MA",
//     "long": 42.274088715886016,
//     "lat": -71.80800962824668,
//     "password": "testpass0"
// })) // TESTING