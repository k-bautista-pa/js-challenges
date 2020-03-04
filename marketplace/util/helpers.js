module.exports.errorMessage = error => {
  return {
    statusCode: error.statusCode || 500,
    body: `Error: Could not find sellers: ${error}`
  }
}

module.exports.successMessage = (code, responseBody) => {
  return {
    statusCode: code,
    body: JSON.stringify(responseBody)
  }
}
