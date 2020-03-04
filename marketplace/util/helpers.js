module.exports.errorMessage = error => {
  console.log('Error:', error);
  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify({error: error.message})
  }
}

module.exports.successMessage = (code, responseBody) => {
  return {
    statusCode: code,
    body: JSON.stringify(responseBody)
  }
}
