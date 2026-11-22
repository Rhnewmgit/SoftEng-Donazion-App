import mysql from 'mysql2'
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

function getCenterUserPass(username) {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM donation_center WHERE donation_center.name=?", [username], (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			if (rows.length == 1) {
				return resolve(rows[0]?.password_hash)
			} else {
				return reject(username)
			}
		})
	})
}

export const handler = async (event) => {
	if (event?.body) {
		event = JSON.parse(event.body)
	}
	const username = event?.name
	const password = event?.password
	const constructResponse = (code, result) => {
		return {
			statusCode: code,
			headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
			body: JSON.stringify(result),
		}
	}

	if (!username) {
		return constructResponse(400, "no center name provided") 
	}
	if (!password) {
		return constructResponse(400, "no password provided")
	}

	try {
		const hash = await getCenterUserPass(username)
		if (!bcrypt.compareSync(password, hash)) {
			return constructResponse(400, "password was incorrect")
		}
	} catch (err) {
		return constructResponse(400, "Could not find a donation center with the provided name: " + err)
	}

	const newToken = jwt.sign({username: username}, jwt_secret, {expiresIn: "24h"})
	const result = {
		"name": username,
		"token": newToken
	}

	return constructResponse(200, result)
}

// console.log(await handler({ // TESTING
//     "name": "badcenter",
//     "password": "badpass"
// }))