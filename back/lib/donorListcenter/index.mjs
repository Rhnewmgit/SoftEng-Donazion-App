import mysql from 'mysql2'
// import 'dotenv/config' // TESTING

var pool = mysql.createPool({
	host: process.env.RDS_HOST,
	user: process.env.RDS_USER,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DATABASE
})

function getDonationCenterRows(page, pageSize) {
	return new Promise((resolve, reject) => {
		pool.query(`
			SELECT name FROM donation_center
			ORDER BY name
			LIMIT ? OFFSET ?`
			, [pageSize, (page - 1) * pageSize], (err, rows) => {
			if (err) { return reject(err.sqlMessage) }
			return resolve(rows)
		})
	})
}

export const handler = async (event) => {
	if (event?.body) {
		event = JSON.parse(event.body)
	}
	const page = event?.page
	const pageSize = event?.pageSize

	const constructResponse = (code, result) => {
		return {
			statusCode: code,
			headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
			body: JSON.stringify(result),
		}
	}

	if (page < 1 || pageSize < 1) {
		return constructResponse(400, `invalid pagination parameters: page ${page} with pageSize ${pageSize}`)
	}


	try {
		return constructResponse(200, await getDonationCenterRows(page, pageSize))
	} catch (err) {
		return constructResponse(400, "SQL error: " + err)
	}

}

// console.log(await handler({ // TESTING
//     "page": 2,
// 	"pageSize": 1
// }))