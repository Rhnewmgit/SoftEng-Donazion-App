
export const handler = async (event) => {

  let result = 'default lambda function handler'
  
  const response = {
    statusCode: 200,
    headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(result),
  }
  
  return response
}
