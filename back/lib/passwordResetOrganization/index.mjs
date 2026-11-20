import { config } from './config.mjs'
import mysql from 'mysql2'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/** Testing:
 * 	bcrypt hash, 10 salting rounds:
 * 	testpass
 *  $2a$10$5ADQChPhMnyXiQ.dYWk/zus6SQQJWTrTa604iLQOoXpn3dD7Dr9g2
 * 	
 *  JWT:
 *  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZX0.AJHyg8Uqb1A6X9G55ubrTnCw232DGfQiigl8RR3vkXc
 * 	{"admin": true}
 * 
 * 	New Password:
 * 	newpass
 */

var pool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
})

function getOrgHash() {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM organization", (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			if ((rows)) {
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

function setNewHash(newHash) {
	return new Promise((resolve, reject) => {
		pool.query("Update organization	SET password_hash=?", [newHash], (err, res) => {
			if (err) { return reject(err.sqlMessage) }
			if ((res?.affectedRows) > 0) {
				return resolve(res.affectedRows)
			} else {
				return reject("failed to update organization password")
			}
		})
	})
}

export const handler = async (event) => {
	const token = event?.token
	const oldPass = event?.oldPass
	const newPass = event?.newPass

	const constructResponse = (code, result) => {
		return {
			statusCode: code,
			body: JSON.stringify(result),
		}
	}

	if (!newPass) {
		return constructResponse(400, "no new password provided")
	}
	if (newPass === oldPass) {
		return constructResponse(400, "new password same as old password")
	}

	try {
		const data = jwt.verify(token, config.jwt_secret)
		if (!data?.admin) {
			return constructResponse(400, "invalid token, log back in first")
		}
	} catch (err) {
		return constructResponse(400, "invalid token, log back in first: " + err?.message)
	}

	// Old pass
	try {
		const oldHash = await getOrgHash();
		if (!bcrypt.compareSync(oldPass, oldHash)) {
			return constructResponse("password was incorrect")
		}
	} catch (err) {
		return constructResponse(400, "SQL error:" + err)
	}

	// Token and old password accepted; update to new password
	try {
		const saltRounds = 8;
		const newHash = bcrypt.hashSync(newPass, saltRounds)
		// await setNewHash(newHash)
	} catch (err) {
		return constructResponse(400, "SQL error:" + err)
	}

	const newToken = jwt.sign({admin: true}, config.jwt_secret, {expiresIn: "24h"})
	const result = {
		"token": newToken
	}

	return constructResponse(200, result)
}

// console.log(await handler({
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZX0.AJHyg8Uqb1A6X9G55ubrTnCw232DGfQiigl8RR3vkXc",
//   "oldPass": "wrongbadincorrectpassword",
//   "newPass": "newpass"
// }))