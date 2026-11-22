import mysql from 'mysql2'
import jwt from 'jsonwebtoken'
// import 'dotenv/config' // TESTING

var pool = mysql.createPool({
	host: process.env.RDS_HOST,
	user: process.env.RDS_USER,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DATABASE
})

const jwt_secret = process.env.JWT_SECRET

function getItemCountValue() {
	return new Promise((resolve, reject) => {
		pool.query("SELECT COUNT(*) as count, SUM(Value) as totalValue FROM items", (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			if (rows?.length) {
				return resolve({count: rows[0].count, toalValue: rows[0].totalValue})
			} else {
				return resolve({count: 0, toalValue: 0})
			}
		})
	})
}

function getDonationCenterCount() {
	return new Promise((resolve, reject) => {
		pool.query("SELECT COUNT(*) as count FROM donation_center", (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			if (rows?.length) {
				return resolve(rows[0].count)
			} else {
				return resolve(0)
			}
		})
	})
}

export const handler = async (event) => {
	if (event?.body) {
		event = JSON.parse(event.body)
	}
	const token = event?.token

	const constructResponse = (code, result) => {
		return {
			statusCode: code,
			headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
			body: JSON.stringify(result),
		}
	}

	if (!token) {
		return constructResponse(400, "no token detected, log in first")
	}

	try {
		jwt.verify(token, jwt_secret)
	} catch (err) {
		return constructResponse(400, "invalid token: " + err)
	}

	let result;
	try {
		const itemData = await getItemCountValue()
		const donationCenterCount = await getDonationCenterCount()
		result = {
			itemCount: itemData.count,
			itemTotalValue: itemData.toalValue,
			donationCenterCount
		}
	} catch (err) {
		return constructResponse(400, "SQL error: " + err)
	}

	return constructResponse(200, result)
}

// console.log(await handler({
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZX0.AJHyg8Uqb1A6X9G55ubrTnCw232DGfQiigl8RR3vkXc"
// }))