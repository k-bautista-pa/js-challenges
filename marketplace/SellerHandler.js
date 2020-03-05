'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED, NOT_FOUND } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES } = constants;
const { SELLER_TABLE } = TABLES;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;


module.exports.getAllSellers = async event => {
  try {
    const rows = await db.getAll(SELLER_TABLE);
    return successMessage(OK, {sellers: rows});
  }
  catch(error) {
    console.log('[SELLER] GET All error: ', error);
    return errorMessage(error);
  }
}

module.exports.createSeller = async event => {
  try {
    const data = JSON.parse(event.body);
    await db.insert(SELLER_TABLE, data);
    return successMessage(CREATED, {message: `Succesfully created user ${data.name}.`});
  }
  catch(error) {
    console.log('[SELLER] Create seller error: ', error);
    return errorMessage(error);
  }
}

module.exports.updateSeller = async event => {
  try {
    const id = event.pathParameters.id;
    const record = await db.getById(SELLER_TABLE, id);
    
    if(record) {
      const data = JSON.parse(event.body);
      await db.updateById(SELLER_TABLE, id, data);
      return successMessage(OK, {message: `Successfully updated user ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Seller does not exist.'});
  }
  catch(error) {
    console.log('[SELLER] Update seller error: ', error);
    return errorMessage(error);
  }
}

module.exports.deleteSeller = async event => {
  try {
    const id = event.pathParameters.id;
    const record = await db.getById(SELLER_TABLE, id);
    const username = record.name;
    // @TODO: Soft or hard delete?
    
    if(record) {
      const data = JSON.parse(event.body);
      await db.deleteById(SELLER_TABLE, id, data);
      return successMessage(OK, {message: `Successfully deleted ${username}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Seller does not exist.'});
  }
  catch(error) {
    console.log('[SELLER] Delete seller error: ', error);
    return errorMessage(error);
  }
}
