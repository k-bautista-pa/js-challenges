'use strict';
const db = require('./db_connect');

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.getAllSellers = async event => {
  
  try {
    // TODO: Refactor table names as constants
    const rows = await db.getAll('seller');
    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  }
  catch(error) { // TODO: Refactor as error message util.
    console.log('Get All Sellers error: ', error);
    return {
      statusCode: error.statusCode || 500,
      body: `Error: Could not find sellers: ${error}`
    }
  }
}
