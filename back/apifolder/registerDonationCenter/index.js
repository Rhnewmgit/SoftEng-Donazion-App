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
    let code;
    let body;
    let second_address_value;
    let wishlist_default_value = null;
    try {
        // A location has to be added first otherwise a 
        // donation center can't be registered (GPS coordinates).
        const aRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { street_address_one, street_address_two, latitude, longitude, city, state, zip, donation_center_name, donation_center_password_hash, organization_name } = aRequest;
        // Primary key handling for the first street address.
        if (!street_address_one || String(street_address_one).trim() === '') {
            code == 400;
            body = { message: "Missing a required street address." };
            return {
                statusCode: code,
                body: JSON.stringify(body)
            }
        }
        // Handling for the second address since this is optional.
        if (!street_address_two || String(street_address_one).trim() === '') {
            second_address_value = 'N / A';
        }
        const query = 'INSERT INTO an_organization.location (street_address_one, street_address_two, latitude, longitude, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await pool.query(query, [street_address_one, second_address_value, latitude, longitude, city, state, zip]);
        const centerQuery = 'INSERT INTO an_organization.donation_center (donation_center_name, donation_center_password_hash, organization_name, street_address_one) VALUES (?, ?, ?, ?, ?)';
        await pool.query(centerQuery, [donation_center_name, donation_center_password_hash, organization_name, street_address_one, wishlist_default_value]);
        body = { message: "Location and donation center have been successfully added and registered." };
        code = 200;
    }
    catch (error) {
        let errorMessage = "";
        if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
            errorMessage = "Database connection could not be secured.";
        }
    }










}


