import mysql from 'mysql2'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

var pool = mysql.createPool({
	host: process.env.RDS_HOST,
	user: process.env.RDS_USER,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DATABASE
})

const jwt_secret = process.env.JWT_SECRET

function getOrgHash() {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM organization", (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			if (rows?.length) {
				if (rows.length > 1) {
					return reject(`${rows.length} different rows in organization found`)
				}
				return resolve(rows[0]?.password_hash)
			} else {
				return reject("unable to locate organization's data")
			}
		})
	})
}

export const handler = async (event) => {
	if (event?.body) {
		event = JSON.parse(event.body)
	}
	const password = event?.password

	const constructResponse = (code, result) => {
		return {
			statusCode: code,
			headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
			body: JSON.stringify(result),
		}
	}

	if (!password) {
		return constructResponse(400, "no password provided")
	}

	try {
		const hash = await getOrgHash();
		if (!bcrypt.compareSync(password, hash)) {
			return constructResponse(400, "password was incorrect")
		}
	} catch (err) {
		return constructResponse(400, "SQL error:" + err)
	}

	const newToken = jwt.sign({admin: true}, jwt_secret, {expiresIn: "24h"})
	const result = {
		"token": newToken
	}

	return constructResponse(200, result)
}